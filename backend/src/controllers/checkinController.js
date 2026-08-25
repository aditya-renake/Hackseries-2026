import { Registrant } from '../models/Registrant.js';
import { verifyQRPayload } from '../services/qrService.js';

/**
 * Gate Check-In Scanner Processor with Zero Forged QR Code Verification
 */
export const scanCheckin = async (req, res) => {
  try {
    const { qrPayload, manualCode } = req.body;
    const rawInput = (qrPayload || manualCode || '').trim();

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        message: 'No QR code payload or Pass ID provided.',
      });
    }

    // Extract potential unique ID from token (e.g. HS26.v1.HS26-8A3F1B.abcdef or raw HS26-8A3F1B)
    let searchId = rawInput;
    if (rawInput.startsWith('HS26.v1.')) {
      const parts = rawInput.split('.');
      if (parts.length >= 3) {
        searchId = parts[2];
      }
    }

    // Fast indexed query
    const registrant = await Registrant.findOne({
      $or: [
        { uniqueId: searchId.toUpperCase() },
        { uniqueId: rawInput.toUpperCase() },
        { email: rawInput.toLowerCase() },
      ],
    });

    if (!registrant) {
      return res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        message: '❌ Invalid Pass: No attendee found matching this QR code or ID.',
      });
    }

    // Cryptographic Anti-Forgery Signature Verification
    const verification = verifyQRPayload(rawInput, registrant);
    if (!verification.valid && verification.forged) {
      return res.status(400).json({
        success: false,
        status: 'FORGERY_DETECTED',
        forged: true,
        message: '🚫 SECURITY ALERT: Forged or tampered QR pass detected! Cryptographic signature verification failed.',
        registrant: {
          name: registrant.name,
          uniqueId: registrant.uniqueId,
        },
      });
    }

    // Check if already checked in (Duplicate Scan Protection)
    if (registrant.checkedIn) {
      return res.status(200).json({
        success: false,
        status: 'ALREADY_CHECKED_IN',
        alreadyCheckedIn: true,
        message: `⚠️ Already Checked In at ${new Date(registrant.checkedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} by ${registrant.checkedInBy || 'Gate Staff'}`,
        checkedInAt: registrant.checkedInAt,
        checkedInBy: registrant.checkedInBy,
        registrant: {
          _id: registrant._id,
          uniqueId: registrant.uniqueId,
          name: registrant.name,
          email: registrant.email,
          phone: registrant.phone,
          ticketType: registrant.ticketType,
          teamName: registrant.teamName,
          track: registrant.track,
          checkedIn: true,
          checkedInAt: registrant.checkedInAt,
          checkedInBy: registrant.checkedInBy,
        },
      });
    }

    // Perform Check-in
    const staffName = req.user ? req.user.name : (req.body.scannedBy || 'Gate Scanner');
    registrant.checkedIn = true;
    registrant.checkedInAt = new Date();
    registrant.checkedInBy = staffName;
    await registrant.save();

    console.log(`✅ [CHECK-IN APPROVED] ${registrant.name} (${registrant.uniqueId}) checked in by ${staffName}`);

    res.json({
      success: true,
      status: 'SUCCESS',
      message: `✅ Check-in Approved: Welcome to HackSeries 2026, ${registrant.name}!`,
      registrant: {
        _id: registrant._id,
        uniqueId: registrant.uniqueId,
        name: registrant.name,
        email: registrant.email,
        phone: registrant.phone,
        ticketType: registrant.ticketType,
        teamName: registrant.teamName,
        track: registrant.track,
        institution: registrant.institution,
        checkedIn: true,
        checkedInAt: registrant.checkedInAt,
        checkedInBy: staffName,
      },
    });
  } catch (error) {
    console.error('❌ Checkin error:', error);
    res.status(500).json({ success: false, message: 'Check-in processing failed', error: error.message });
  }
};

/**
 * Check-in status lookup by ID
 */
export const getCheckinStatus = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const registrant = await Registrant.findOne({ uniqueId: uniqueId.toUpperCase() }).lean();

    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }

    res.json({
      success: true,
      uniqueId: registrant.uniqueId,
      name: registrant.name,
      checkedIn: registrant.checkedIn,
      checkedInAt: registrant.checkedInAt,
      checkedInBy: registrant.checkedInBy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve check-in status', error: error.message });
  }
};

/**
 * Undo Check-in (Revert in case of gate mis-scan)
 */
export const undoCheckin = async (req, res) => {
  try {
    const { id } = req.params;
    const registrant = await Registrant.findById(id);

    if (!registrant) {
      return res.status(404).json({ success: false, message: 'Registrant not found' });
    }

    registrant.checkedIn = false;
    registrant.checkedInAt = null;
    registrant.checkedInBy = null;
    await registrant.save();

    res.json({
      success: true,
      message: `Check-in reverted for ${registrant.name}`,
      registrant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to revert check-in', error: error.message });
  }
};

/**
 * Get recent check-ins stream for gate monitor
 */
export const getRecentScans = async (req, res) => {
  try {
    const recents = await Registrant.find({ checkedIn: true })
      .sort({ checkedInAt: -1 })
      .limit(20)
      .select('uniqueId name email ticketType teamName track checkedInAt checkedInBy')
      .lean();

    res.json({ success: true, data: recents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recent scans', error: error.message });
  }
};
