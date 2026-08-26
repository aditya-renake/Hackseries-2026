import { v4 as uuidv4 } from 'uuid';
import { Registrant } from '../models/Registrant.js';
import { createQRPayload, generatePassSignature, generateQRCodeDataUrl } from '../services/qrService.js';
import { sendPassEmail } from '../services/emailService.js';

/**
 * List registrants with search, filter, and pagination (optimized for 2000+ scale).
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

    const query = {};

    if (checkedIn !== undefined && checkedIn !== '') {
      query.checkedIn = checkedIn === 'true';
    }

    if (emailSent !== undefined && emailSent !== '') {
      query.emailSent = emailSent === 'true';
    }

    if (ticketType && ticketType !== 'all') {
      query.ticketType = ticketType;
    }

    if (track && track !== 'all') {
      query.track = track;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { uniqueId: regex },
        { teamName: regex },
        { institution: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [registrants, totalCount, totalAll, checkedInCount, emailSentCount] = await Promise.all([
      Registrant.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Registrant.countDocuments(query),
      Registrant.countDocuments({}),
      Registrant.countDocuments({ checkedIn: true }),
      Registrant.countDocuments({ emailSent: true }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: registrants,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems: totalCount,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      stats: {
        totalRegistrants: totalAll,
        checkedInCount,
        checkedInPercentage: totalAll > 0 ? Math.round((checkedInCount / totalAll) * 100) : 0,
        emailSentCount,
        pendingEmailCount: totalAll - emailSentCount,
      },
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
      return res.status(400).json({
        success: false,
        message: 'Name and Email are required fields from the form submission.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if registrant already exists
    let existing = await Registrant.findOne({ email: cleanEmail });
    if (existing) {
      existing.formResponses = { ...existing.formResponses, ...formResponses };
      if (phone) existing.phone = phone;
      if (teamName) existing.teamName = teamName;
      if (track) existing.track = track;
      if (githubUrl) existing.githubUrl = githubUrl;
      if (institution) existing.institution = institution;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: 'Existing HackSeries registrant updated with latest response.',
        data: existing,
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

    const registrant = new Registrant({
      uniqueId,
      name: name.trim(),
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
      emailSent: false,
      checkedIn: false,
    });

    await registrant.save();

    console.log(`📥 [HACKSERIES REGISTRATION] Registered: ${registrant.name} (${registrant.email}) -> Pass ID: ${uniqueId}`);

    // Automatically send pass email in background
    sendPassEmail(registrant)
      .then(async (result) => {
        if (result && result.success) {
          registrant.emailSent = true;
          registrant.emailSentAt = new Date();
          await registrant.save();
        }
      })
      .catch((err) => console.error('Automated pass email dispatch error:', err));

    res.status(201).json({
      success: true,
      message: 'Registration successful! Digital Pass generated and email dispatched.',
      data: registrant,
      uniqueId: registrant.uniqueId,
      passUrl: `/pass/${uniqueId}`,
      isNew: true,
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed', error: error.message });
  }
};

/**
 * Manual registrant creation by staff/admin or public registration form
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
    const existing = await Registrant.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A hacker is already registered with this email address.' });
    }

    const rawUuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const uniqueId = `HS26-${rawUuid}`;

    const signature = generatePassSignature(uniqueId, cleanEmail, ticketType);
    const qrPayload = createQRPayload(uniqueId, cleanEmail, ticketType);
    const qrCodeDataUrl = await generateQRCodeDataUrl(qrPayload);

    const registrant = new Registrant({
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
    });

    await registrant.save();

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
    const query = idOrEmail.includes('@')
      ? { email: idOrEmail.toLowerCase().trim() }
      : { uniqueId: idOrEmail.toUpperCase().trim() };

    const registrant = await Registrant.findOne(query).lean();
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
 * Get single registrant by DB ID
 */
export const getRegistrantById = async (req, res) => {
  try {
    const registrant = await Registrant.findById(req.params.id);
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
    const registrant = await Registrant.findById(req.params.id);
    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }

    const signature = generatePassSignature(registrant.uniqueId, registrant.email, registrant.ticketType);
    const qrPayload = createQRPayload(registrant.uniqueId, registrant.email, registrant.ticketType);
    const qrCodeDataUrl = await generateQRCodeDataUrl(qrPayload);

    registrant.qrSignature = signature;
    registrant.qrPayload = qrPayload;
    registrant.qrCodeDataUrl = qrCodeDataUrl;
    await registrant.save();

    res.json({
      success: true,
      message: 'Cryptographic QR Pass regenerated successfully',
      data: registrant,
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
    const registrant = await Registrant.findByIdAndDelete(req.params.id);
    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }
    res.json({ success: true, message: 'Registrant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete registrant', error: error.message });
  }
};

/**
 * Export registrants to CSV format
 */
export const exportCSV = async (req, res) => {
  try {
    const registrants = await Registrant.find({}).sort({ createdAt: -1 }).lean();

    const headers = ['Unique ID', 'Name', 'Email', 'Phone', 'Ticket Type', 'Team Name', 'Track', 'Checked In', 'Checked In At', 'Checked In By', 'Pass Emailed', 'Created At'];
    const rows = registrants.map((r) => [
      r.uniqueId,
      `"${r.name.replace(/"/g, '""')}"`,
      r.email,
      r.phone || '',
      r.ticketType,
      `"${(r.teamName || '').replace(/"/g, '""')}"`,
      `"${(r.track || '').replace(/"/g, '""')}"`,
      r.checkedIn ? 'YES' : 'NO',
      r.checkedInAt ? new Date(r.checkedInAt).toISOString() : '',
      r.checkedInBy || '',
      r.emailSent ? 'YES' : 'NO',
      new Date(r.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=hackseries-2026-registrants.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate CSV export', error: error.message });
  }
};
