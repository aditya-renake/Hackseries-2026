import { configRepo } from '../models/configRepo.js';
import { getFirestore } from '../config/firebase.js';

export const getEventConfig = async (req, res) => {
  try {
    const config = await configRepo.getConfig();
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event configuration', error: error.message });
  }
};

export const updateEventConfig = async (req, res) => {
  try {
    const updated = await configRepo.updateConfig(req.body);
    res.json({ success: true, message: 'Event configuration updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event configuration', error: error.message });
  }
};

/**
 * Real-Time Database Telemetry & Capacity Diagnostics
 */
export const getDatabaseTelemetry = async (req, res) => {
  const startTime = Date.now();
  try {
    const db = getFirestore();

    // 1. Registrants stats & byte calculation
    const regSnapshot = await db.collection('registrants').get();
    const totalRegistrants = regSnapshot.size;
    let checkedInCount = 0;
    let emailSentCount = 0;
    let withPhotoCount = 0;
    let totalBytes = 0;

    regSnapshot.forEach((doc) => {
      const data = doc.data();
      const docBytes = Buffer.byteLength(JSON.stringify(data), 'utf8');
      totalBytes += docBytes;
      if (data.checkedIn) checkedInCount++;
      if (data.emailSent) emailSentCount++;
      if (data.checkedInPhoto) withPhotoCount++;
    });

    // 2. Staff stats
    const staffSnapshot = await db.collection('staff_users').get();
    const staffMembers = [];
    staffSnapshot.forEach((doc) => {
      const d = doc.data();
      staffMembers.push({ username: d.username, name: d.name, role: d.role, email: d.email || '' });
    });

    // 3. Mailer Detection
    let activeMailer = 'Gmail SMTP (tigeradi1504@gmail.com)';
    const pass = process.env.SMTP_PASS || '';
    if (process.env.RESEND_API_KEY || pass.startsWith('re_')) {
      activeMailer = 'Resend High-Speed SMTP';
    } else if (process.env.SENDGRID_API_KEY || pass.startsWith('SG.')) {
      activeMailer = 'SendGrid SMTP Engine';
    }

    const pingMs = Date.now() - startTime;
    const freeCapacityPercent = (100 - (totalBytes / (1024 * 1024 * 1024)) * 100).toFixed(4);

    res.json({
      success: true,
      data: {
        status: 'ONLINE & HEALTHY',
        projectId: process.env.FIREBASE_PROJECT_ID || 'hackseries-2026',
        pingMs,
        totalRegistrants,
        checkedInCount,
        pendingCheckin: totalRegistrants - checkedInCount,
        emailSentCount,
        pendingEmailDispatch: totalRegistrants - emailSentCount,
        withPhotoCount,
        totalBytes,
        totalKB: (totalBytes / 1024).toFixed(2),
        totalMB: (totalBytes / (1024 * 1024)).toFixed(4),
        freeCapacityPercent,
        freeQuotaLimit: '1.00 GB (1,024 MB)',
        approxRemainingAttendeesCapacity: Math.floor((1024 * 1024 * 1024) / (totalBytes > 0 ? (totalBytes / Math.max(totalRegistrants, 1)) : 5000)),
        staffCount: staffSnapshot.size,
        staffMembers,
        activeMailer,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to query database telemetry',
      error: error.message,
    });
  }
};

