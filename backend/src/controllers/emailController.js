import { Registrant } from '../models/Registrant.js';
import { EventConfig } from '../models/EventConfig.js';
import { sendPassEmail, sendBulkPassEmails, buildPassEmailHtml } from '../services/emailService.js';

/**
 * 1-Click Send Pass Email to a single registrant
 */
export const sendSinglePassEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const registrant = await Registrant.findById(id);

    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }

    let config = await EventConfig.findOne().lean();
    if (!config) {
      config = {
        eventName: 'HackSeries 2026',
        eventDate: 'October 16 - 18, 2026',
        eventTime: '09:00 AM IST',
        eventVenue: 'Apex Tech Hub & Innovation Arena, Pune',
      };
    }

    const emailResult = await sendPassEmail(registrant, config);

    registrant.emailSent = true;
    registrant.emailSentAt = new Date();
    registrant.emailSendCount = (registrant.emailSendCount || 0) + 1;
    await registrant.save();

    res.json({
      success: true,
      message: `Pass email successfully sent to ${registrant.email}`,
      result: emailResult,
      registrant: {
        _id: registrant._id,
        email: registrant.email,
        emailSent: registrant.emailSent,
        emailSentAt: registrant.emailSentAt,
        emailSendCount: registrant.emailSendCount,
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
    const { onlyPending = true, selectedIds } = req.body;

    let query = {};
    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
      query._id = { $in: selectedIds };
    } else if (onlyPending) {
      query.emailSent = false;
    }

    const registrants = await Registrant.find(query);

    if (registrants.length === 0) {
      return res.json({
        success: true,
        message: 'No eligible registrants found to email.',
        results: { total: 0, sent: 0, failed: 0 },
      });
    }

    let config = await EventConfig.findOne().lean();
    if (!config) {
      config = { eventName: 'HackSeries 2026' };
    }

    const results = await sendBulkPassEmails(registrants, config);

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
      registrant = await Registrant.findById(registrantId).lean();
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

    let config = await EventConfig.findOne().lean();
    if (!config) {
      config = {
        eventName: 'HackSeries 2026',
        eventDate: 'October 16 - 18, 2026',
        eventTime: '09:00 AM IST',
        eventVenue: 'Apex Tech Hub & Innovation Arena, Pune',
      };
    }

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
