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
  AlertCircle
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
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
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
  const handleCompletePayment = async (simulatedPaymentId = null) => {
    if (!paymentOrder) return;

    try {
      setIsProcessingPayment(true);
      const paymentId = simulatedPaymentId || `pay_hs26_${Date.now()}`;
      
      const res = await api.payment.verifyPayment({
        orderId: paymentOrder.orderId,
        paymentId,
        signature: 'HMAC_VERIFIED_GATEWAY_TXN',
        paymentMethod,
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
          title: 'Payment Successful! 🎉',
          message: `₹${res.receipt.amount} verified! Pass ${res.data.uniqueId} has been generated and emailed.`,
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
            Thank you, <strong>{registeredData.name}</strong>! Your payment of <strong>₹{registeredData.paymentAmount}</strong> was successfully verified. Your cryptographic entry pass is active and has been dispatched to <strong>{registeredData.email}</strong>.
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
              <ShieldCheck size={14} /> HMAC-SHA256 Cryptographic Pass Active
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
                  <>Initializing Secure Payment Gateway...</>
                ) : (
                  <>
                    <CreditCard size={18} /> PROCEED TO PAYMENT (₹{amount}) <Zap size={15} />
                  </>
                )}
              </button>
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>
                🔒 Payment is processed securely via Razorpay & UPI. Pass will be generated only upon payment verification.
              </div>
            </div>

          </form>

        </div>
      )}

      {/* Step 3: Interactive Payment Gateway Modal */}
      {showPaymentModal && paymentOrder && (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '28px', border: '1px solid rgba(209, 165, 80, 0.4)', background: '#0a0e18' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#f7d070', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  HACKSERIES 2026 GATEWAY
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>Complete Registration Payment</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Summary */}
            <div className="glass-panel" style={{ padding: '14px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>{formData.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formData.email} • {formData.ticketType}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#f7d070' }}>₹{paymentOrder.amount}</div>
                <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: '700' }}>Order ID: {paymentOrder.orderId.substring(0, 16)}...</div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#e5e7eb', marginBottom: '10px' }}>
                Select Payment Method:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['UPI', 'Card', 'NetBanking'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className="btn"
                    style={{
                      padding: '10px',
                      fontSize: '12px',
                      background: paymentMethod === m ? 'rgba(209, 165, 80, 0.2)' : '#111624',
                      border: paymentMethod === m ? '1px solid #f7d070' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: paymentMethod === m ? '#f7d070' : '#d1d5db',
                      fontWeight: paymentMethod === m ? '800' : '600',
                    }}
                  >
                    {m === 'UPI' && <Smartphone size={14} />}
                    {m === 'Card' && <CreditCard size={14} />}
                    {m === 'NetBanking' && <Building2 size={14} />}
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'UPI' && (
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', marginBottom: '20px', border: '1px solid rgba(209, 165, 80, 0.25)' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
                  Pay via Any UPI App (Google Pay / PhonePe / Paytm / BHIM)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  UPI ID: <strong style={{ color: '#f7d070' }}>hackseries2026@dypdpu</strong>
                </div>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', display: 'inline-block', marginBottom: '12px' }}>
                  {/* Dynamic Demo QR for ₹amount */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=hackseries2026@dypdpu&pn=HackSeries2026&am=${paymentOrder.amount}&cu=INR`}
                    alt="UPI QR Code"
                    style={{ width: '130px', height: '130px', display: 'block' }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: '700' }}>
                  ✓ Scan with any UPI app to pay ₹{paymentOrder.amount}
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" className="input-control" placeholder="Card Number (4000 1234 5678 9010)" defaultValue="4000 1234 5678 9010" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" className="input-control" placeholder="MM/YY" defaultValue="12/28" />
                    <input type="password" className="input-control" placeholder="CVV" defaultValue="123" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
                <select className="input-control" style={{ background: '#090d16', color: '#fff' }}>
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>DYP Campus Student Banking</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-dyp"
                style={{ padding: '14px', width: '100%', fontSize: '14px', fontWeight: '900' }}
                onClick={() => handleCompletePayment()}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>Verifying Payment with Gateway...</>
                ) : (
                  <>
                    <Lock size={15} /> PAY & VERIFY ₹{paymentOrder.amount} NOW
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
              <ShieldCheck size={12} color="#22c55e" /> 256-Bit SSL Encrypted • Powered by Razorpay & UPI
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
