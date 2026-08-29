import { v4 as uuidv4 } from 'uuid';
import { registrantRepo } from '../models/registrantRepo.js';
import { configRepo } from '../models/configRepo.js';
import { createQRPayload, generatePassSignature, generateQRCodeDataUrl } from '../services/qrService.js';
import { sendRegistrationReceivedEmail } from '../services/emailService.js';

/**
 * List registrants with search, filter, and pagination (optimized via DynamoDB).
 */
export const getRegistrants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      checkedIn,
      emailSent,
      ticketType,
      track,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const result = await registrantRepo.getAll({
      page,
      limit,
      search,
      checkedIn,
      emailSent,
      ticketType,
      track,
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      stats: result.stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch registrants', error: error.message });
  }
};

/**
 * Webhook receiver for Google Forms / Google Sheet Apps Script onFormSubmit trigger
 */
export const handleWebhookSubmission = async (req, res) => {
  try {
    // 1. Check if this is explicitly a Google Sheets row edit / status update event
    if (req.body.action === 'update_status') {
      const cleanEmail = String(req.body.email || '').toLowerCase().trim();
      if (!cleanEmail) {
        return res.status(400).json({ success: false, message: 'Email is required for status update.' });
      }

      const existing = await registrantRepo.findByEmail(cleanEmail);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: `Attendee with email ${cleanEmail} not found in HackSeries database.`,
        });
      }

      const isVerified = req.body.verified === true || String(req.body.verificationStatus).toLowerCase() === 'verified';
      const updated = await registrantRepo.update(existing.uniqueId, {
        verified: isVerified,
        verificationStatus: isVerified ? 'Verified' : 'Not Verified',
        verifiedAt: isVerified ? new Date().toISOString() : null,
      });

      console.log(`📊 [GOOGLE SHEET SYNC] Verification status updated for ${cleanEmail} -> ${isVerified ? 'VERIFIED ✅' : 'NOT VERIFIED ⏳'}`);
      return res.status(200).json({
        success: true,
        message: `Status updated to ${isVerified ? 'Verified' : 'Not Verified'}`,
        data: updated,
      });
    }

    const {
      name,
      email,
      phone,
      ticketType = 'Hacker Pass',
      teamName = '',
      track = 'AI & Agentic Systems',
      githubUrl = '',
      institution = '',
      formResponses = {},
      verified = false,
      verificationStatus = 'Not Verified',
    } = req.body;

    // Fallback extraction if name/email are inside formResponses or alternate casing
    let attendeeName = name;
    let attendeeEmail = email;

    if (!attendeeName && formResponses) {
      for (const [k, v] of Object.entries(formResponses)) {
        if (k.toLowerCase().includes('name') && !k.toLowerCase().includes('team')) {
          attendeeName = v;
          break;
        }
      }
    }

    if (!attendeeEmail && formResponses) {
      for (const [k, v] of Object.entries(formResponses)) {
        if (k.toLowerCase().includes('email') || k.toLowerCase().includes('mail')) {
          attendeeEmail = v;
          break;
        }
      }
    }

    if (!attendeeName || !attendeeEmail) {
      return res.status(400).json({
        success: false,
        message: 'Name and Email are required fields from the form submission.',
      });
    }

    const cleanEmail = attendeeEmail.toLowerCase().trim();

    // Check if registrant already exists in Firestore
    let existing = await registrantRepo.findByEmail(cleanEmail);
    if (existing) {
      const updated = await registrantRepo.update(existing.uniqueId, {
        formResponses: { ...existing.formResponses, ...formResponses },
        phone: phone ? phone.trim() : existing.phone,
        teamName: teamName ? teamName.trim() : existing.teamName,
        track: track || existing.track,
        githubUrl: githubUrl ? githubUrl.trim() : existing.githubUrl,
        institution: institution ? institution.trim() : existing.institution,
        verified: verified !== undefined ? verified : (existing.verified || false),
        verificationStatus: verificationStatus || existing.verificationStatus || 'Not Verified',
      });

      return res.status(200).json({
        success: true,
        message: 'Existing HackSeries registrant updated with latest response.',
        data: updated,
        isNew: false,
      });
    }

    // Generate unique ID: HS26-<8 CHARS>
    const rawUuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const uniqueId = `HS26-${rawUuid}`;

    // Generate cryptographic anti-forgery HMAC signature
    const signature = generatePassSignature(uniqueId, cleanEmail, ticketType);
    const qrPayload = createQRPayload(uniqueId, cleanEmail, ticketType);
    const qrCodeDataUrl = await generateQRCodeDataUrl(qrPayload);

    const newRegistrant = await registrantRepo.create({
      uniqueId,
      name: attendeeName.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      ticketType,
      teamName: teamName ? teamName.trim() : '',
      track,
      githubUrl: githubUrl ? githubUrl.trim() : '',
      institution: institution ? institution.trim() : '',
      formResponses,
      qrPayload,
      qrSignature: signature,
      qrCodeDataUrl,
      verified: verified !== undefined ? verified : false,
      verificationStatus: verificationStatus || 'Not Verified',
      emailSent: false,
      checkedIn: false,
    });

    console.log(`📥 [HACKSERIES WEBHOOK] Registered in Firestore: ${newRegistrant.name} (${newRegistrant.email}) -> Pass ID: ${uniqueId}`);

    // Asynchronously dispatch instant "Registration Received • Details Under Verification" email
    configRepo.getConfig()
      .then((cfg) => sendRegistrationReceivedEmail(newRegistrant, cfg))
      .then(() => console.log(`📧 [AUTO-DISPATCH] Registration acknowledgement email delivered to ${newRegistrant.email}`))
      .catch((mailErr) => console.warn(`⚠️ [AUTO-DISPATCH NOTICE] Registration ack email error: ${mailErr.message}`));

    res.status(201).json({
      success: true,
      message: 'Registrant created successfully & verification email dispatched',
      data: newRegistrant,
      isNew: true,
      ackEmailDispatched: true,
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed', error: error.message });
  }
};

/**
 * Manual registrant creation by staff/admin
 */
export const createRegistrant = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      ticketType = 'Hacker Pass',
      teamName = '',
      track = 'AI & Agentic Systems',
      githubUrl = '',
      institution = '',
      formResponses = {},
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await registrantRepo.findByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A hacker is already registered with this email address.' });
    }

    const rawUuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const uniqueId = `HS26-${rawUuid}`;

    const signature = generatePassSignature(uniqueId, cleanEmail, ticketType);
    const qrPayload = createQRPayload(uniqueId, cleanEmail, ticketType);
    const qrCodeDataUrl = await generateQRCodeDataUrl(qrPayload);

    const registrant = await registrantRepo.create({
      uniqueId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || '',
      ticketType,
      teamName: teamName || '',
      track,
      githubUrl: githubUrl || '',
      institution: institution || '',
      formResponses: formResponses || {},
      qrPayload,
      qrSignature: signature,
      qrCodeDataUrl,
      emailSent: false,
      checkedIn: false,
    });

    res.status(201).json({
      success: true,
      message: 'Hacker registered successfully',
      data: registrant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create registrant', error: error.message });
  }
};

/**
 * Public Pass Lookup (by uniqueId or Email) for attendee mobile portal
 */
export const getPublicPass = async (req, res) => {
  try {
    const { idOrEmail } = req.params;
    const registrant = await registrantRepo.findByIdOrEmail(idOrEmail);

    if (!registrant) {
      return res.status(404).json({
        success: false,
        message: 'No HackSeries pass found matching the provided ID or Email address.',
      });
    }

    res.json({
      success: true,
      data: {
        uniqueId: registrant.uniqueId,
        name: registrant.name,
        email: registrant.email,
        phone: registrant.phone,
        ticketType: registrant.ticketType,
        teamName: registrant.teamName,
        track: registrant.track,
        institution: registrant.institution,
        qrCodeDataUrl: registrant.qrCodeDataUrl,
        qrPayload: registrant.qrPayload,
        checkedIn: registrant.checkedIn,
        checkedInAt: registrant.checkedInAt,
        createdAt: registrant.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve pass', error: error.message });
  }
};

/**
 * Get single registrant by uniqueId or DB ID
 */
export const getRegistrantById = async (req, res) => {
  try {
    const registrant = await registrantRepo.findByUniqueId(req.params.id);
    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }
    res.json({ success: true, data: registrant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch registrant', error: error.message });
  }
};

/**
 * Regenerate QR Code
 */
export const regenerateQR = async (req, res) => {
  try {
    const registrant = await registrantRepo.findByUniqueId(req.params.id);
    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }

    const signature = generatePassSignature(registrant.uniqueId, registrant.email, registrant.ticketType);
    const qrPayload = createQRPayload(registrant.uniqueId, registrant.email, registrant.ticketType);
    const qrCodeDataUrl = await generateQRCodeDataUrl(qrPayload);

    const updated = await registrantRepo.update(registrant.uniqueId, {
      qrSignature: signature,
      qrPayload,
      qrCodeDataUrl,
    });

    res.json({
      success: true,
      message: 'Cryptographic QR Pass regenerated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to regenerate QR', error: error.message });
  }
};

/**
 * Delete a registrant
 */
export const deleteRegistrant = async (req, res) => {
  try {
    const deleted = await registrantRepo.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }
    res.json({ success: true, message: 'Registrant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete registrant', error: error.message });
  }
};

/**
 * Toggle verification status of an attendee from Admin Dashboard
 */
export const toggleVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const registrant = await registrantRepo.findByIdOrEmail(id);
    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }

    const nextVerified = !registrant.verified;
    const updated = await registrantRepo.update(registrant.uniqueId, {
      verified: nextVerified,
      verificationStatus: nextVerified ? 'Verified' : 'Not Verified',
      verifiedAt: nextVerified ? new Date().toISOString() : null,
    });

    res.json({
      success: true,
      message: `Registrant ${updated.name} marked as ${nextVerified ? 'Verified ✅' : 'Not Verified ⏳'}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle verification status', error: error.message });
  }
};

/**
 * Export registrants to CSV format
 */
export const exportCSV = async (req, res) => {
  try {
    const result = await registrantRepo.getAll({ limit: 10000 });
    const registrants = result.items || [];

    const headers = ['Unique ID', 'Name', 'Email', 'Phone', 'Verification Status', 'Ticket Type', 'Team Name', 'Track', 'Checked In', 'Checked In At', 'Checked In By', 'Pass Emailed', 'Created At'];
    const rows = registrants.map((r) => [
      r.uniqueId,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      r.email,
      r.phone || '',
      r.verified ? 'VERIFIED' : 'NOT VERIFIED',
      r.ticketType,
      `"${(r.teamName || '').replace(/"/g, '""')}"`,
      `"${(r.track || '').replace(/"/g, '""')}"`,
      r.checkedIn ? 'YES' : 'NO',
      r.checkedInAt ? new Date(r.checkedInAt).toISOString() : '',
      r.checkedInBy || '',
      r.emailSent ? 'YES' : 'NO',
      r.createdAt ? new Date(r.createdAt).toISOString() : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=hackseries-2026-registrants.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate CSV export', error: error.message });
  }
};
