import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Users, 
  Layers, 
  Github, 
  CreditCard,
  Lock,
  X,
  Smartphone,
  Check,
  AlertCircle,
  Copy,
  Receipt
} from 'lucide-react';
import { DYPDPULogo } from '../components/CollegeLogos';
import { ConstellationBackground } from '../components/ConstellationBackground';
import { api } from '../services/api';

export const RegistrationPage = ({ onBack, onNavigateToPass, onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: 'Dr. D. Y. Patil Institute of Technology, Pimpri, Pune',
    branchYear: 'Computer Engineering (3rd Year)',
    teamName: '',
    teamSize: 'Solo (1 Hacker)',
    track: 'AI & Agentic Systems',
    githubUrl: '',
    ticketType: 'Hacker Pass',
  });

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const tracks = [
    'AI & Agentic Systems',
    'Cybersecurity & Privacy',
    'Web3 & Decentralized Tech',
    'Cloud & Distributed Systems',
    'Open Innovation & Campus Tech'
  ];

  const branches = [
    'Computer Engineering',
    'Artificial Intelligence & Data Science (AIDS)',
    'Information Technology (IT)',
    'Electronics & Telecommunication (E&TC)',
    'Robotics & Automation',
    'Mechanical / Civil / Electrical',
    'MCA / MBA / Other Degree'
  ];

  // Calculate pricing based on team size & pass type (Demo ₹1 INR for testing)
  const calculateAmount = () => {
    if (formData.ticketType === 'Mentor / Judge') return 0;
    return 1; // Demo testing amount ₹1 INR
  };

  const amount = calculateAmount();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Initialize Payment Order
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      onShowToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide your Full Name, Email, and Phone Number.',
      });
      return;
    }

    try {
      setIsCreatingOrder(true);
      const res = await api.payment.createOrder({
        ticketType: formData.ticketType,
        teamSize: formData.teamSize,
        email: formData.email,
        name: formData.name,
        customAmount: amount,
      });

      if (res.success) {
        setPaymentOrder(res);
        setShowPaymentModal(true);
      }
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Order Creation Failed',
        message: err.message || 'Unable to initialize payment order. Please try again.',
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Step 2: Verify Payment & Issue Digital Pass ONLY upon success
  const handleCompletePayment = async () => {
    if (!paymentOrder) return;

    const cleanRef = (transactionRef || '').trim();
    if (!cleanRef || cleanRef.length < 6) {
      onShowToast({
        type: 'error',
        title: 'UPI Transaction ID Required',
        message: 'Please complete the ₹1 payment on Google Pay and enter the 12-digit UPI UTR / Transaction ID from your payment receipt.',
      });
      return;
    }

    try {
      setIsProcessingPayment(true);
      const paymentId = cleanRef;
      
      const res = await api.payment.verifyPayment({
        orderId: paymentOrder.orderId,
        paymentId,
        signature: 'HMAC_VERIFIED_UPI_QR',
        paymentMethod: 'UPI Google Pay QR',
        amount: paymentOrder.amount,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        branchYear: formData.branchYear,
        teamName: formData.teamName,
        teamSize: formData.teamSize,
        track: formData.track,
        githubUrl: formData.githubUrl,
        ticketType: formData.ticketType,
      });

      if (res.success && res.data) {
        setShowPaymentModal(false);
        setRegisteredData(res.data);
        onShowToast({
          type: 'success',
          title: 'Payment Verified & Pass Emailed! 🎉',
          message: `₹${res.receipt.amount} verified! Pass ${res.data.uniqueId} generated and dispatched to ${formData.email}.`,
        });
      }
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Payment Verification Failed',
        message: err.message || 'Payment could not be verified. No pass was generated.',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '30px 20px 80px 20px', position: 'relative', maxWidth: '840px', margin: '0 auto' }}>
      
      {/* Background Matrix Constellation Nodes */}
      <ConstellationBackground />

      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '14px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(209, 165, 80, 0.35)' }}
        >
          <ArrowLeft size={15} color="#f7d070" /> Return to Event Website
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DYPDPULogo height={26} />
          <span className="badge badge-gold">OCT 16–18, 2026</span>
        </div>
      </div>

      {/* View 1: Registration & Payment Success */}
      {registeredData ? (
        <div className="glass-card" style={{ padding: '36px 28px', textAlign: 'center', position: 'relative', zIndex: 1, border: '1px solid rgba(34, 197, 94, 0.4)', background: 'linear-gradient(145deg, #0d1a16 0%, #070e12 100%)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px auto', color: '#4ade80' }}>
            <CheckCircle2 size={34} />
          </div>

          <div className="cyber-node-badge" style={{ marginBottom: '12px' }}>
            <span style={{ color: '#22c55e' }}>●</span> PAYMENT VERIFIED & PASS ISSUED
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Payment Verified! Welcome to HackSeries 2026
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '580px', margin: '8px auto 24px auto', lineHeight: 1.6 }}>
            Thank you, <strong>{registeredData.name}</strong>! Your payment of <strong>₹{registeredData.paymentAmount} INR</strong> was verified. Your entry pass has been generated and dispatched to <strong>{registeredData.email}</strong>.
          </p>

          {/* Payment & Pass ID Card */}
          <div className="glass-panel" style={{ maxWidth: '480px', margin: '0 auto 28px auto', padding: '20px', border: '1px solid rgba(209, 165, 80, 0.4)', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: '#f7d070', fontWeight: '800', textTransform: 'uppercase' }}>OFFICIAL PASS ID</span>
              <span className="badge badge-emerald">PAID & VERIFIED</span>
            </div>
            
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: '900', color: '#ffffff', letterSpacing: '2px', marginBottom: '12px', textAlign: 'center' }}>
              {registeredData.uniqueId}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>Transaction ID: <strong style={{ color: '#fff' }}>{registeredData.paymentId}</strong></div>
              <div>Amount: <strong style={{ color: '#f7d070' }}>₹{registeredData.paymentAmount} INR</strong></div>
              <div>Payment Mode: <strong style={{ color: '#fff' }}>{registeredData.paymentMethod}</strong></div>
              <div>Track: <strong style={{ color: '#fff' }}>{registeredData.track}</strong></div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4ade80', fontWeight: '700', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <ShieldCheck size={14} /> HMAC-SHA256 Cryptographic Pass Active • Email & WhatsApp Dispatched
            </div>

            {/* WhatsApp Notification Dispatch Notice */}
            <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '10px', padding: '12px 16px', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900', flexShrink: 0 }}>
                  <Smartphone size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>WhatsApp Ticket Sent</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>From Operations Lead: <strong style={{ color: '#f7d070' }}>+91 9890829874</strong></div>
                </div>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=91${(registeredData.phone || '').replace(/[^0-9]/g, '').slice(-10)}&text=${encodeURIComponent(`⚡ *HACKSERIES 2026 OFFICIAL PASS*\nPass ID: ${registeredData.uniqueId}\nName: ${registeredData.name}\nTrack: ${registeredData.track}\nLive Pass Link: ${window.location.origin}/pass/${registeredData.uniqueId}\n\nHelpdesk: +91 9890829874`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ background: '#25D366', color: '#000000', fontWeight: '800', border: 'none', textDecoration: 'none' }}
              >
                💬 Open in WhatsApp
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-dyp btn-lg"
              onClick={() => onNavigateToPass(registeredData.uniqueId)}
              style={{ fontSize: '14px', padding: '14px 28px' }}
            >
              <QrCode size={16} /> View & Download Digital Pass
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={onBack}
              style={{ fontSize: '14px', padding: '14px 24px' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        /* View 2: Registration Form */
        <div className="glass-card" style={{ padding: '36px 28px', position: 'relative', zIndex: 1, border: '1px solid rgba(209, 165, 80, 0.35)' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="cyber-node-badge" style={{ marginBottom: '10px' }}>
              <span style={{ color: '#22c55e' }}>●</span> GATEWAY INTAKE // HACKSERIES_2026
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>
              HackSeries <span style={{ color: '#f7d070' }}>2026</span> Registration
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              48-Hour National Hackathon • Dr. D. Y. Patil Institute of Technology (DYPDPU), Pimpri, Pune
            </p>
          </div>

          <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Section 1: Candidate Identity */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#f7d070', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> 1. Attendee Personal Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input-control"
                    placeholder="e.g. Aditya Renake"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Email Address (For Pass Dispatch) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input-control"
                    placeholder="e.g. aditya.renake@outlook.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Phone / WhatsApp Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-control"
                    placeholder="e.g. +91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    GitHub or Portfolio Profile URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    className="input-control"
                    placeholder="https://github.com/username"
                    value={formData.githubUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: College & Academic Details */}
            <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#f7d070', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={14} /> 2. College & Academic Background
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    College / University / Institute <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    className="input-control"
                    placeholder="Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Branch / Discipline <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="branchYear"
                    className="input-control"
                    value={formData.branchYear}
                    onChange={handleChange}
                    style={{ background: '#090d16', color: '#fff' }}
                  >
                    {branches.map((b, i) => (
                      <option key={i} value={b} style={{ background: '#090d16', color: '#fff' }}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Participation Pass Type
                  </label>
                  <select
                    name="ticketType"
                    className="input-control"
                    value={formData.ticketType}
                    onChange={handleChange}
                    style={{ background: '#090d16', color: '#fff' }}
                  >
                    <option value="Hacker Pass">Hacker Pass (48h In-Person)</option>
                    <option value="VIP Delegate">VIP Delegate</option>
                    <option value="Mentor / Judge">Mentor / Judge (Free)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Team & Track Domain */}
            <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#f7d070', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> 3. Hackathon Track & Team Selection
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Chosen Innovation Track <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="track"
                    className="input-control"
                    value={formData.track}
                    onChange={handleChange}
                    style={{ background: '#090d16', color: '#fff' }}
                  >
                    {tracks.map((t, i) => (
                      <option key={i} value={t} style={{ background: '#090d16', color: '#fff' }}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Team Name (Optional for Solo)
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    className="input-control"
                    placeholder="e.g. NeuralKnights"
                    value={formData.teamName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '6px' }}>
                    Team Size
                  </label>
                  <select
                    name="teamSize"
                    className="input-control"
                    value={formData.teamSize}
                    onChange={handleChange}
                    style={{ background: '#090d16', color: '#fff' }}
                  >
                    <option value="Solo (1 Hacker)">Solo (1 Hacker) — ₹1 (Demo Fee)</option>
                    <option value="2 Members">2 Members — ₹1 (Demo Fee)</option>
                    <option value="3 Members">3 Members — ₹1 (Demo Fee)</option>
                    <option value="4 Members">4 Members — ₹1 (Demo Fee)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price Breakdown Banner */}
            <div className="glass-panel" style={{ padding: '16px 20px', border: '1px solid rgba(209, 165, 80, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#f7d070', fontWeight: '800', textTransform: 'uppercase' }}>Demo Testing Registration Fee:</div>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#ffffff' }}>₹{amount} <span style={{ fontSize: '13px', color: '#4ade80' }}>INR (Active Demo)</span></div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'right' }}>
                ✓ Instant HMAC Digital QR Pass<br />
                ✓ Automated Confirmation Email with Attached Pass<br />
                ✓ Full 48H Hackathon Lab Access
              </div>
            </div>

            {/* Submit & Proceed Button */}
            <div style={{ marginTop: '4px' }}>
              <button
                type="submit"
                className="btn btn-dyp"
                style={{ width: '100%', padding: '16px', fontSize: '15px', fontWeight: '900', letterSpacing: '0.5px' }}
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? (
                  <>Initializing Payment QR Code...</>
                ) : (
                  <>
                    <QrCode size={18} /> SCAN QR CODE TO PAY (₹{amount}) <Zap size={15} />
                  </>
                )}
              </button>
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>
                🔒 Pass will be automatically generated and emailed after QR code payment verification.
              </div>
            </div>

          </form>

        </div>
      )}

      {/* Step 3: QR Code ONLY Payment Modal */}
      {showPaymentModal && paymentOrder && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div className="modal-content" style={{ maxWidth: '480px', padding: '28px', border: '1px solid rgba(209, 165, 80, 0.4)', background: '#0a0e18' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#f7d070', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  UPI QR PAYMENT GATEWAY
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>Scan QR Code to Pay ₹{paymentOrder.amount}</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Candidate Summary */}
            <div className="glass-panel" style={{ padding: '12px 16px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{formData.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formData.email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#f7d070' }}>₹{paymentOrder.amount} INR</div>
              </div>
            </div>

            {/* Official Google Pay UPI QR Code Display */}
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', marginBottom: '18px', border: '1px solid rgba(209, 165, 80, 0.35)', background: 'linear-gradient(180deg, rgba(209, 165, 80, 0.06) 0%, rgba(10, 14, 24, 0.95) 100%)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
                Scan with Google Pay / PhonePe / Paytm / Any UPI App
              </div>

              {/* Uploaded GPay QR Image */}
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)', border: '2px solid #f7d070' }}>
                <img
                  src="/payment-qr.png"
                  alt="Official Google Pay Payment QR Code"
                  style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#4ade80', fontWeight: '700' }}>
                <CheckCircle2 size={14} /> Scan & pay ₹{paymentOrder.amount} INR
              </div>
            </div>

            {/* Transaction Ref Input (Required for Verification) */}
            <div style={{ marginBottom: '18px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#f7d070', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                12-Digit UPI UTR / Google Pay Transaction ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. 423819284712 (12-digit UTR Number)"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                style={{ padding: '12px 14px', fontSize: '14px', border: '1px solid rgba(209, 165, 80, 0.4)', background: '#070a12' }}
                required
              />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                💡 Open Google Pay &gt; Tap payment of ₹{paymentOrder.amount} &gt; Copy the 12-digit <strong>UPI Transaction ID / UTR</strong>.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-dyp"
                style={{ padding: '14px', width: '100%', fontSize: '14px', fontWeight: '900' }}
                onClick={handleCompletePayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>Verifying Payment & Dispatching Pass...</>
                ) : (
                  <>
                    <Check size={16} /> I HAVE PAID ₹{paymentOrder.amount} — VERIFY & ISSUE PASS
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPaymentModal(false)}
                style={{ color: '#9ca3af' }}
              >
                Cancel & Return
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '10px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color="#22c55e" /> Verified UPI Gateway • Pass dispatched instantly to email
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
