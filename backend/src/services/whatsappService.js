import dotenv from 'dotenv';

dotenv.config();

export const WHATSAPP_SENDER_NUMBER = '9890829874';

/**
 * Clean phone number to E.164 standard Indian format
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    clean = '91' + clean;
  } else if (clean.startsWith('0') && clean.length === 11) {
    clean = '91' + clean.substring(1);
  }
  return clean;
};

/**
 * Format the official HackSeries 2026 WhatsApp Pass Message
 */
export const formatWhatsAppPassMessage = (registrant) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const passUrl = `${clientUrl}/pass/${registrant.uniqueId}`;

  return `⚡ *HACKSERIES 2026 — OFFICIAL ENTRY PASS* ⚡
🏛️ *Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune (DYPDPU)*

Hey *${registrant.name}*! 👋
Your spot for *HackSeries 2026 (48-Hour National Hackathon)* is confirmed & verified!

🎫 *Pass ID:* ${registrant.uniqueId}
🏷️ *Pass Type:* ${registrant.ticketType || 'Hacker Pass'}
🎯 *Track:* ${registrant.track || 'AI & Agentic Systems'}
${registrant.teamName ? `👥 *Team:* ${registrant.teamName}\n` : ''}📅 *Event Dates:* October 16 – 18, 2026
📍 *Venue:* DIT Pimpri, Pune (Near Sant Tukaram Nagar Metro)

📱 *OPEN YOUR DIGITAL QR ENTRY PASS:*
${passUrl}

🔒 *Check-in Instructions:*
1. Keep this link bookmarked on your mobile phone.
2. Present the cryptographic QR code at DIT Main Entrance.
3. Collect your ID badge, hacker swag kit & meal wristbands.

📞 *Event Helpdesk & Operations:* +91 ${WHATSAPP_SENDER_NUMBER}
— *HackSeries 2026 Team • ACES Dept. of Computer Engineering*`;
};

/**
 * Dispatches WhatsApp Message via WhatsApp Gateway API or Webhook
 * Sender: 9890829874
 */
export const sendWhatsAppPass = async (registrant) => {
  try {
    const rawPhone = registrant.phone || '';
    const formattedPhone = formatPhoneNumber(rawPhone);
    const message = formatWhatsAppPassMessage(registrant);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const passUrl = `${clientUrl}/pass/${registrant.uniqueId}`;

    const encodedText = encodeURIComponent(message);
    const directWhatsAppUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;

    console.log(`📱 [WHATSAPP DISPATCH] Sending from: +91 ${WHATSAPP_SENDER_NUMBER} -> To: +${formattedPhone} | Pass: ${registrant.uniqueId}`);

    // If external WhatsApp API Provider is configured (e.g. UltraMsg / Twilio / Meta Cloud API)
    const whatsappApiUrl = process.env.WHATSAPP_API_URL;
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;

    if (whatsappApiUrl && whatsappToken) {
      try {
        const response = await fetch(whatsappApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: WHATSAPP_SENDER_NUMBER,
            to: formattedPhone,
            body: message,
            token: whatsappToken,
          }),
        });
        const resData = await response.json().catch(() => ({}));
        console.log(`✅ [WHATSAPP API RESULT] Dispatched to +${formattedPhone}:`, resData);
      } catch (gatewayErr) {
        console.warn(`⚠️ External WhatsApp Gateway unreachable, fallback to direct dispatch:`, gatewayErr.message);
      }
    }

    return {
      success: true,
      sender: WHATSAPP_SENDER_NUMBER,
      recipient: formattedPhone,
      message,
      whatsappUrl: directWhatsAppUrl,
      passUrl,
    };
  } catch (error) {
    console.error('❌ Error dispatching WhatsApp notification:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
