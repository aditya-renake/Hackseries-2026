import React, { useState } from 'react';
import { 
  Zap, 
  Award, 
  Calendar, 
  MapPin, 
  Users, 
  Terminal, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Code2, 
  Cpu, 
  Lock, 
  Coins, 
  Rocket 
} from 'lucide-react';
import { api } from '../services/api';

export const EventLandingPage = ({ onNavigateToPass, onShowToast }) => {
  const [lookupInput, setLookupInput] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  const googleFormUrl = 'https://forms.gle/U24ip7E6NqtbZkiT9';

  const tracks = [
    {
      title: 'AI & Agentic Systems',
      desc: 'Autonomous multi-agent architectures, local LLM orchestration, devops mesh, and self-healing systems.',
      icon: Cpu,
      prize: '₹4,00,000',
      color: '#22c55e',
    },
    {
      title: 'Cybersecurity & Privacy',
      desc: 'Zero-knowledge proofs, automated vulnerability discovery, tamper-proof audit trails, and privacy primitives.',
      icon: Lock,
      prize: '₹3,50,000',
      color: '#06b6d4',
    },
    {
      title: 'Web3 & Decentralized Protocols',
      desc: 'Cross-chain liquidity routers, account abstraction, resilient infra, and decentralized identity.',
      icon: Coins,
      prize: '₹3,50,000',
      color: '#8b5cf6',
    },
    {
      title: 'Open Innovation & FinTech',
      desc: 'Voice financial inclusion, public goods tooling, developer experience, and edge-native apps.',
      icon: Rocket,
      prize: '₹4,00,000',
      color: '#f59e0b',
    },
  ];

  const schedule = [
    { time: 'Day 1 • 07:30 AM', title: 'Express Gate Check-in & Breakfast', desc: 'Present your verified QR pass at the entrance to collect your badge & hacker kit.' },
    { time: 'Day 1 • 09:30 AM', title: 'Opening Keynote & Problem Statements Release', desc: 'Official kickoff, sponsor track releases, and team matchmaking.' },
    { time: 'Day 1 • 11:00 AM', title: 'Hacking Commences ⚡', desc: '48 hours of continuous building, mentorship rounds, and midnight energy sessions.' },
    { time: 'Day 2 • 02:00 PM', title: 'Midway Mentor Review & Dry Runs', desc: 'Direct feedback from industry leaders, venture partners, and senior architects.' },
    { time: 'Day 3 • 11:00 AM', title: 'Code Freeze & Project Submissions', desc: 'GitHub repository freeze, demo video uploads, and technical verification.' },
    { time: 'Day 3 • 03:00 PM', title: 'Grand Finale & ₹15L+ Prize Awards', desc: 'Top 10 team live stage pitches and awards ceremony.' },
  ];

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupInput.trim()) return;

    try {
      setIsLookingUp(true);
      const res = await api.registrants.getPublicPass(lookupInput.trim());
      if (res.data?.uniqueId) {
        onNavigateToPass(res.data.uniqueId);
      }
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Pass Not Found',
        message: 'No registered pass found for this ID or Email. Please make sure you completed the Google Form.',
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '40px auto 60px auto', padding: '0 24px', textAlign: 'center' }}>
        
        {/* Banner Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '999px', padding: '6px 18px', fontSize: '13px', color: '#4ade80', fontWeight: '700', marginBottom: '24px' }}>
          <Sparkles size={15} /> 48 Hours • ₹15,00,000+ Prize Pool • Pune & Hybrid
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: '900', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '20px' }}>
          BUILD THE FUTURE AT <br />
          <span style={{ background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HACKSERIES 2026
          </span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
          India’s premier gathering of 2,000+ builders, security researchers, and systems engineers. Instant digital passes with cryptographic zero-forgery protection.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
          
          {/* Primary Google Form Registration Link */}
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-lg"
            style={{ padding: '16px 36px', fontSize: '16px' }}
          >
            <Zap size={20} /> Register via Google Form <ExternalLink size={16} />
          </a>

          <a href="#lookup-section" className="btn btn-secondary btn-lg">
            <Search size={18} /> Retrieve My Pass
          </a>
        </div>

        {/* Key Event Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', maxWidth: '960px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={24} color="#22c55e" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>October 16 - 18, 2026</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>48 Hours Non-Stop</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapPin size={24} color="#06b6d4" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Apex Tech Hub, Pune</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Onsite Arena + Hybrid</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award size={24} color="#f59e0b" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>₹15,00,000+ Grants</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cash Prizes & VC Funding</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={24} color="#a78bfa" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Instant QR Entry</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Zero-Wait Gate Scans</div>
            </div>
          </div>
        </div>

      </section>

      {/* Lookup Pass Section */}
      <section id="lookup-section" style={{ maxWidth: '780px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(34, 197, 94, 0.3)', background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(3, 7, 18, 0.9) 100%)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', margin: '0 auto 12px auto' }}>
              <Terminal size={24} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>Already Registered via Google Form?</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Enter your registered Email Address or Pass ID to view your digital pass ticket and save it to your phone.
            </p>
          </div>

          <form onSubmit={handleLookup} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. aditya.renake@outlook.com or HS26-9B4D2E"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              style={{ flex: 1, minWidth: '260px', padding: '14px 18px', fontSize: '15px' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px' }} disabled={isLookingUp}>
              <Search size={16} /> {isLookingUp ? 'Searching...' : 'Find My Pass'}
            </button>
          </form>
        </div>
      </section>

      {/* Hackathon Tracks */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>TRACKS & BOUNTIES</span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>Choose Your Battleground</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Tailored problem tracks designed with leading global AI labs and security firms.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {tracks.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${t.color}15`, border: `1px solid ${t.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color, marginBottom: '20px' }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>{t.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{t.desc}</p>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Track Prize</span>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: t.color }}>{t.prize}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Schedule */}
      <section style={{ maxWidth: '960px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>EVENT TIMELINE</span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>48-Hour Sprint Schedule</h2>
        </div>

        <div className="glass-panel" style={{ padding: '24px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {schedule.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '140px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#22c55e', fontWeight: '700', paddingTop: '2px' }}>
                  {item.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '48px 32px', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '12px' }}>Ready to hack at HackSeries 2026?</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 28px auto' }}>
            Fill the official Google Form. Your pass will be created and verified automatically!
          </p>
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-lg"
          >
            <Zap size={18} /> Complete Registration via Google Form <ExternalLink size={15} />
          </a>
        </div>
      </section>

    </div>
  );
};
