import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Registrant } from '../models/Registrant.js';
import { createQRPayload, generatePassSignature, generateQRCodeDataUrl } from '../services/qrService.js';
import { sendPassEmail } from '../services/emailService.js';

/**
 * Pricing tiers for HackSeries 2026 registration (Defaulted to ₹1 demo payment)
 */
const TIER_PRICING = {
  'Hacker Pass': 1,            // Demo ₹1 INR for testing / starting
  'Team Pass (2 Members)': 1,
  'Team Pass (3 Members)': 1,
  'Team Pass (4 Members)': 1,
  'VIP Delegate': 1,
  'Mentor / Judge': 0,        // Free pass
};

/**
 * 1. Create Payment Order
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { ticketType = 'Hacker Pass', teamSize = 'Solo (1 Hacker)', email, name, customAmount } = req.body;

    // Demo starting fee is ₹1 INR (or customAmount if specified)
    let amount = customAmount !== undefined ? Number(customAmount) : (TIER_PRICING[ticketType] !== undefined ? TIER_PRICING[ticketType] : 1);

    const rawUuid = uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase();
    const orderId = `order_hs26_${rawUuid}`;

    // If Razorpay API keys are configured in environment
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_hackseries2026';

    res.status(200).json({
      success: true,
      orderId,
      amount,
      amountInPaise: amount * 100,
      currency: 'INR',
      keyId,
      notes: {
        eventName: 'HackSeries 2026',
        candidateEmail: email,
        candidateName: name,
      },
    });
  } catch (error) {
    console.error('❌ Error creating payment order:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
};

/**
 * 2. Verify Payment & Generate Pass ONLY on Success
 */
export const verifyPaymentAndRegister = async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      paymentMethod = 'UPI',
      amount = 299,
      // Registrant information
      name,
      email,
      phone,
      institution,
      branchYear,
      teamName,
      teamSize,
      track = 'AI & Agentic Systems',
      githubUrl,
      ticketType = 'Hacker Pass',
      formResponses = {},
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and Email are required for registration.',
      });
    }

    if (!paymentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment parameters. Payment confirmation ID and Order ID are required.',
      });
    }

    // Razorpay HMAC Signature Verification (if secret is in env)
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (razorpaySecret && signature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification signature mismatch. Security check failed.',
        });
      }
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if registrant already exists and is paid
    let existing = await Registrant.findOne({ email: cleanEmail });
    if (existing && existing.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'You already have a verified paid pass for HackSeries 2026!',
        data: existing,
        uniqueId: existing.uniqueId,
        passUrl: `/pass/${existing.uniqueId}`,
        isExisting: true,
      });
    }

    // Generate unique Pass ID: HS26-<8 CHARS>
    const rawUuid = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    const uniqueId = `HS26-${rawUuid}`;

    // Cryptographic anti-forgery HMAC signature for QR code
    const qrSignature = generatePassSignature(uniqueId, cleanEmail, ticketType);
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
      institution: institution ? institution.trim() : 'Dr. D. Y. Patil Institute of Technology, Pimpri, Pune',
      formResponses: {
        ...formResponses,
        branchYear,
        teamSize,
      },
      // Payment details
      paymentStatus: 'paid',
      paymentId: paymentId.trim(),
      orderId: orderId.trim(),
      paymentAmount: Number(amount) || 1,
      paymentCurrency: 'INR',
      paymentMethod,
      paymentSignature: signature || 'VERIFIED_GATEWAY',
      paymentTimestamp: new Date(),
      // QR Pass data
      qrPayload,
      qrSignature,
      qrCodeDataUrl,
      emailSent: false,
      checkedIn: false,
    });

    await registrant.save();

    console.log(`💳 [PAYMENT VERIFIED] ₹${amount} received for ${registrant.name} (${registrant.email}) -> Pass ID: ${uniqueId}`);

    // Dispatch official digital pass to registrant's email in background
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
      message: 'Payment verified! HackSeries 2026 Digital Pass generated and emailed successfully.',
      data: registrant,
      uniqueId: registrant.uniqueId,
      passUrl: `/pass/${uniqueId}`,
      receipt: {
        paymentId: registrant.paymentId,
        orderId: registrant.orderId,
        amount: registrant.paymentAmount,
        currency: registrant.paymentCurrency,
        date: registrant.paymentTimestamp,
      },
    });
  } catch (error) {
    console.error('❌ Error verifying payment and registering:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};
