import { registrantRepo } from '../models/registrantRepo.js';
import { configRepo } from '../models/configRepo.js';
import { sendPassEmail, sendBulkPassEmails, buildPassEmailHtml } from '../services/emailService.js';

/**
 * 1-Click Send Pass Email to a single registrant
 */
export const sendSinglePassEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const registrant = await registrantRepo.findByUniqueId(id);

    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }

    const config = await configRepo.getConfig();
    const emailResult = await sendPassEmail(registrant, config);

    const updated = await registrantRepo.update(registrant.uniqueId, {
      emailSent: true,
      emailSentAt: new Date().toISOString(),
      emailSendCount: (registrant.emailSendCount || 0) + 1,
    });

    res.json({
      success: true,
      message: `Pass email successfully sent to ${updated.email}`,
      result: emailResult,
      registrant: {
        _id: updated.uniqueId,
        email: updated.email,
        emailSent: updated.emailSent,
        emailSentAt: updated.emailSentAt,
        emailSendCount: updated.emailSendCount,
      },
    });
  } catch (error) {
    console.error('❌ Send email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send pass email',
      error: error.message,
    });
  }
};

/**
 * Bulk send pass emails to pending or selected attendees
 */
export const sendBulkEmails = async (req, res) => {
  try {
    const { onlyPending = true, onlyVerified = false, selectedIds } = req.body;

    const allResult = await registrantRepo.getAll({ limit: 10000 });
    let registrants = allResult.items || [];

    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
      const idSet = new Set(selectedIds.map((id) => String(id).toUpperCase().trim()));
      const emailSet = new Set(selectedIds.map((id) => String(id).toLowerCase().trim()));
      
      registrants = registrants.filter((r) => 
        idSet.has(String(r.uniqueId || '').toUpperCase().trim()) ||
        idSet.has(String(r._id || '').toUpperCase().trim()) ||
        emailSet.has(String(r.email || '').toLowerCase().trim())
      );
    } else {
      if (onlyVerified) {
        registrants = registrants.filter((r) => r.verified === true || String(r.verificationStatus).toLowerCase() === 'verified');
      }
      if (onlyPending) {
        registrants = registrants.filter((r) => !r.emailSent);
      }
    }

    if (registrants.length === 0) {
      return res.json({
        success: true,
        message: 'No eligible registrants found to email.',
        results: { total: 0, sent: 0, failed: 0 },
      });
    }

    const config = await configRepo.getConfig();
    const results = await sendBulkPassEmails(registrants, config);

    // Update sent flags in DynamoDB
    for (const r of registrants) {
      await registrantRepo.update(r.uniqueId, {
        emailSent: true,
        emailSentAt: new Date().toISOString(),
        emailSendCount: (r.emailSendCount || 0) + 1,
      });
    }

    res.json({
      success: true,
      message: `Bulk pass dispatch completed. Sent: ${results.sent}, Failed: ${results.failed}`,
      results,
    });
  } catch (error) {
    console.error('❌ Bulk send email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Bulk email dispatch failed',
      error: error.message,
    });
  }
};

/**
 * Preview Pass Email HTML
 */
export const previewPassEmail = async (req, res) => {
  try {
    const { registrantId } = req.query;
    let registrant;

    if (registrantId) {
      registrant = await registrantRepo.findByUniqueId(registrantId);
    }

    if (!registrant) {
      registrant = {
        name: 'Aditya Renake',
        email: 'aditya.renake@outlook.com',
        ticketType: 'Team Lead Pass',
        uniqueId: 'HS26-9B4D2E1A',
        teamName: 'NeuralHackers',
        track: 'AI & Agentic Systems',
      };
    }

    const config = await configRepo.getConfig();
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const html = buildPassEmailHtml({
      attendeeName: registrant.name,
      ticketType: registrant.ticketType,
      uniqueId: registrant.uniqueId,
      teamName: registrant.teamName,
      track: registrant.track,
      eventName: config.eventName,
      eventDate: config.eventDate,
      eventTime: config.eventTime,
      eventVenue: config.eventVenue,
      passUrl: `${clientUrl}/pass/${registrant.uniqueId}`,
      notice: config.emailBodyNotice,
    });

    res.send(html);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate preview', error: error.message });
  }
};
