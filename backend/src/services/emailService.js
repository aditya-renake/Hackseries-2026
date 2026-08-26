import nodemailer from 'nodemailer';
import { generateQRCodeBuffer } from './qrService.js';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

export const getTransporter = async () => {
  if (transporter) return transporter;

  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const customHost = (process.env.SMTP_HOST || '').trim();

  if (pass && pass !== '') {
    const isGmail = user.includes('@gmail.com') || customHost.includes('gmail');
    const isResend = customHost.includes('resend.com') || user.toLowerCase() === 'resend';
    const isOutlook = user.includes('@outlook.') || user.includes('@hotmail.') || user.includes('@live.');
    
    let host = customHost;
    let port = parseInt(process.env.SMTP_PORT || '587', 10);
    let secure = port === 465;

    if (!host) {
      if (isGmail) host = 'smtp.gmail.com';
      else if (isResend) host = 'smtp.resend.com';
      else if (isOutlook) host = 'smtp-mail.outlook.com';
      else host = 'smtp.office365.com';
    }

    const transportConfig = {
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    };

    if (isGmail) {
      transportConfig.service = 'gmail';
    }

    transporter = nodemailer.createTransport(transportConfig);
    console.log(`📧 Configured SMTP transporter (${isGmail ? 'Gmail' : isResend ? 'Resend' : host}) for: ${user}`);
  } else {
    // Ethereal / Simulated Mailer for zero-setup local dev
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`📧 Zero-config mailer initialized (Ethereal test mailbox: ${testAccount.user})`);
    } catch (err) {
      console.warn('⚠️ Falling back to mock logger mailer:', err.message);
      transporter = {
        sendMail: async (mailOptions) => {
          console.log(`📨 [SIMULATED EMAIL] From: ${mailOptions.from} | To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
          return { messageId: 'hackseries-simulated-' + Date.now(), simulated: true };
        },
      };
    }
  }

  return transporter;
};

/**
 * Builds the high-impact HackSeries 2026 Pass Email Template
 */
export const buildPassEmailHtml = ({
  attendeeName,
  ticketType,
  uniqueId,
  teamName,
  track,
  eventName,
  eventDate,
  eventTime,
  eventVenue,
  passUrl,
  notice,
}) => {
  const badgeColor =
    ticketType === 'VIP Pass'
      ? '#f59e0b'
      : ticketType === 'Mentor / Judge'
      ? '#ec4899'
      : ticketType === 'Team Lead Pass'
      ? '#06b6d4'
      : '#6366f1';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Pass for ${eventName}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #030712;
      color: #f3f4f6;
    }
    .wrapper {
      max-width: 600px;
      margin: 20px auto;
      background: #0b0f19;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #1f293d;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      background: linear-gradient(135deg, #7a1518 0%, #b22b2f 50%, #d1a550 100%);
      padding: 36px 30px;
      text-align: center;
    }
    .header .college-sub {
      margin: 0 0 6px 0;
      font-size: 11px;
      font-weight: 800;
      color: #f7d070;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 13px;
      color: #fef08a;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .subtext {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    .ticket-card {
      background: #111827;
      border-radius: 16px;
      border: 1px solid #b22b2f44;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
      box-shadow: 0 0 30px rgba(178, 43, 47, 0.12);
    }
    .ticket-badge {
      display: inline-block;
      padding: 6px 18px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      background: ${badgeColor}22;
      color: ${badgeColor};
      border: 1px solid ${badgeColor}66;
      margin-bottom: 14px;
    }
    .attendee-name {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 4px 0;
    }
    .ticket-id {
      font-family: monospace;
      font-size: 13px;
      color: #f7d070;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .qr-container {
      background: #ffffff;
      padding: 16px;
      border-radius: 14px;
      display: inline-block;
      margin: 0 auto 16px auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .qr-image {
      width: 220px;
      height: 220px;
      display: block;
    }
    .security-notice {
      font-size: 12px;
      color: #22c55e;
      font-weight: 700;
      display: block;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }
    .meta-box {
      background: #030712;
      border-radius: 12px;
      border: 1px solid #1f2937;
      padding: 16px;
      text-align: left;
      margin-top: 16px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .meta-row:last-child {
      margin-bottom: 0;
    }
    .meta-label {
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 11px;
    }
    .meta-val {
      color: #f1f5f9;
      font-weight: 600;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 20px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #b22b2f 0%, #d1a550 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 15px;
      padding: 14px 32px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      box-shadow: 0 10px 25px -5px rgba(178, 43, 47, 0.5);
    }
    .footer {
      background: #030712;
      padding: 24px 30px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #1f2937;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="college-sub">🏛️ DR. D. Y. PATIL INSTITUTE OF TECHNOLOGY, PIMPRI, PUNE (DYPDPU)</div>
      <h1>⚡ ${eventName}</h1>
      <p>Presented by ACES — Dept. of Computer Engineering</p>
    </div>
    <div class="content">
      <div class="greeting">Hey ${attendeeName}! 🚀</div>
      <p class="subtext">
        Your spot for <strong>${eventName}</strong> at <strong>Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune</strong> is confirmed! Present the verified QR code below at the check-in gates for express access, hacker swag kits, and food coupon wristbands.
      </p>

      <div class="ticket-card">
        <div class="ticket-badge">${ticketType}</div>
        <div class="attendee-name">${attendeeName}</div>
        <div class="ticket-id">PASS ID: ${uniqueId}</div>

        <div class="qr-container">
          <img src="cid:hackpassqr" alt="HackSeries Entry QR" class="qr-image" />
        </div>

        <div class="security-notice">
          🛡️ Cryptographically Signed Pass • Zero-Tamper Verified
        </div>

        <div class="meta-box">
          <div class="meta-row">
            <span class="meta-label">📅 Date & Time:</span>
            <span class="meta-val">${eventDate} • ${eventTime}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">📍 Venue:</span>
            <span class="meta-val">${eventVenue}</span>
          </div>
          ${
            teamName
              ? `<div class="meta-row">
            <span class="meta-label">👥 Team:</span>
            <span class="meta-val">${teamName}</span>
          </div>`
              : ''
          }
          ${
            track
              ? `<div class="meta-row">
            <span class="meta-label">🎯 Track:</span>
            <span class="meta-val">${track}</span>
          </div>`
              : ''
          }
        </div>
      </div>

      <div class="btn-container">
        <a href="${passUrl}" class="btn" target="_blank">
          📱 Open Mobile Pass & Offline Wallet
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
        ${notice || 'Tip: Save this pass to your phone or take a screenshot for ultra-fast check-in upon arrival.'}
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">Organised by <strong>ACES</strong> • Department of Computer Engineering, DIT Pune (DYPDPU)</p>
      <p style="margin: 0;">Lead Coordinator: <strong>Aditya Renake</strong> (aditya.renake@outlook.com)</p>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Sends a single pass email to a registrant
 */
export const sendPassEmail = async (registrant, eventConfig = {}) => {
  const mailTransporter = await getTransporter();

  const eventName = eventConfig.eventName || 'HackSeries 2026';
  const eventDate = eventConfig.eventDate || 'October 16 - 18, 2026';
  const eventTime = eventConfig.eventTime || '09:00 AM IST';
  const eventVenue = eventConfig.eventVenue || 'Apex Tech Hub & Innovation Arena, Pune';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const passUrl = `${clientUrl}/pass/${registrant.uniqueId}`;
  const senderEmail = process.env.SMTP_USER || 'aditya.renake@outlook.com';

  const qrBuffer = await generateQRCodeBuffer(registrant.qrPayload);

  const html = buildPassEmailHtml({
    attendeeName: registrant.name,
    ticketType: registrant.ticketType,
    uniqueId: registrant.uniqueId,
    teamName: registrant.teamName,
    track: registrant.track,
    eventName,
    eventDate,
    eventTime,
    eventVenue,
    passUrl,
    notice: eventConfig.emailBodyNotice,
  });

  const subject = (eventConfig.emailSubjectTemplate || '🎟️ Your Official Entry Pass for HackSeries 2026 — {{name}}')
    .replace('{{eventName}}', eventName)
    .replace('{{name}}', registrant.name);

  const fromAddress = process.env.EMAIL_FROM || `"HackSeries 2026" <${senderEmail}>`;

  const mailOptions = {
    from: fromAddress,
    to: registrant.email,
    replyTo: process.env.REPLY_TO || senderEmail,
    subject: subject,
    html: html,
    attachments: [
      {
        filename: `hackseries-pass-${registrant.uniqueId}.png`,
        content: qrBuffer,
        cid: 'hackpassqr',
      },
    ],
  };

  const info = await mailTransporter.sendMail(mailOptions);
  let previewUrl = null;

  if (nodemailer.getTestMessageUrl) {
    previewUrl = nodemailer.getTestMessageUrl(info);
  }

  return {
    success: true,
    messageId: info.messageId,
    previewUrl: previewUrl,
    passUrl: passUrl,
    recipient: registrant.email,
  };
};

/**
 * Bulk send pass emails with batching
 */
export const sendBulkPassEmails = async (registrants, eventConfig, onProgress) => {
  const results = {
    total: registrants.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  const BATCH_SIZE = 5;
  for (let i = 0; i < registrants.length; i += BATCH_SIZE) {
    const batch = registrants.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (reg) => {
        try {
          await sendPassEmail(reg, eventConfig);
          reg.emailSent = true;
          reg.emailSentAt = new Date();
          reg.emailSendCount = (reg.emailSendCount || 0) + 1;
          await reg.save();
          results.sent++;
        } catch (err) {
          results.failed++;
          results.errors.push({ id: reg._id, email: reg.email, error: err.message });
        }
      })
    );

    if (onProgress) {
      onProgress(results.sent + results.failed, results.total);
    }

    if (i + BATCH_SIZE < registrants.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return results;
};
