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
  Send,
  ExternalLink
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
    teamSize: '4 Members',
    track: 'AI & Agentic Systems',
    githubUrl: '',
    ticketType: 'Hacker Pass',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      onShowToast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please provide both your Full Name and Email Address.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.registrants.register({
        ...formData,
        formResponses: {
          branchYear: formData.branchYear,
          teamSize: formData.teamSize,
        }
      });

      if (res.success && res.data) {
        setRegisteredData(res.data);
        onShowToast({
          type: 'success',
          title: 'Registration Successful! ⚡',
          message: `Your entry pass ${res.data.uniqueId} has been generated and dispatched to your email.`,
        });
      }
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Failed to submit registration. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
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

      {/* Registration Success View */}
      {registeredData ? (
        <div className="glass-card" style={{ padding: '36px 28px', textAlign: 'center', position: 'relative', zIndex: 1, border: '1px solid rgba(34, 197, 94, 0.4)', background: 'linear-gradient(145deg, #0d1a16 0%, #070e12 100%)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px auto', color: '#4ade80' }}>
            <CheckCircle2 size={34} />
          </div>

          <div className="cyber-node-badge" style={{ marginBottom: '12px' }}>
            <span style={{ color: '#22c55e' }}>●</span> PASS ISSUED & VERIFIED
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
            You're Registered for HackSeries 2026!
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '580px', margin: '8px auto 24px auto', lineHeight: 1.6 }}>
            Welcome aboard, <strong>{registeredData.name}</strong>! Your cryptographic entry QR pass is ready and has been dispatched to <strong>{registeredData.email}</strong>.
          </p>

          {/* Pass ID Display Card */}
          <div className="glass-panel" style={{ maxWidth: '440px', margin: '0 auto 28px auto', padding: '20px', border: '1px solid rgba(209, 165, 80, 0.4)' }}>
            <div style={{ fontSize: '11px', color: '#f7d070', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
              OFFICIAL HACKER PASS ID
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: '6px 0', letterSpacing: '2px' }}>
              {registeredData.uniqueId}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#4ade80', fontWeight: '700' }}>
              <ShieldCheck size={14} /> HMAC-SHA256 Cryptographic Signature Active
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
        /* Registration Form */
        <div className="glass-card" style={{ padding: '36px 28px', position: 'relative', zIndex: 1, border: '1px solid rgba(209, 165, 80, 0.35)' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="cyber-node-badge" style={{ marginBottom: '10px' }}>
              <span style={{ color: '#22c55e' }}>●</span> SYS.INTAKE // CANDIDATE_REGISTRATION
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: '900', color: '#ffffff', letterSpacing: '-1px' }}>
              HackSeries <span style={{ color: '#f7d070' }}>2026</span> Registration
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              48-Hour National Hackathon • Dr. D. Y. Patil Institute of Technology (DYPDPU), Pimpri, Pune
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
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
                    <option value="Mentor Pass">Mentor / Judge Pass</option>
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
                    Team Name (Optional for Solo Hackers)
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
                    <option value="Solo (1 Hacker)">Solo (1 Hacker)</option>
                    <option value="2 Members">2 Members</option>
                    <option value="3 Members">3 Members</option>
                    <option value="4 Members">4 Members</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="submit"
                className="btn btn-dyp"
                style={{ width: '100%', padding: '16px', fontSize: '15px', fontWeight: '900', letterSpacing: '0.5px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Processing Cryptographic Pass & Dispatching Email...</>
                ) : (
                  <>
                    <Zap size={18} /> INITIALIZE PASS & COMPLETE REGISTRATION
                  </>
                )}
              </button>
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-dim)' }}>
                🔒 Your digital QR entry pass will be generated instantly and emailed with HMAC cryptographic anti-forgery protection.
              </div>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
