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
  Rocket,
  Compass,
  ArrowUpRight,
  Wifi,
  Coffee,
  BatteryCharging,
  Layers,
  GraduationCap
} from 'lucide-react';
import { DYPDPULogo, ACESLogo } from '../components/CollegeLogos';
import { api } from '../services/api';

export const EventLandingPage = ({ onNavigateToPass, onShowToast }) => {
  const [lookupInput, setLookupInput] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  const googleFormUrl = 'https://forms.gle/U24ip7E6NqtbZkiT9';

  const tracks = [
    {
      title: 'AI & Agentic Systems',
      desc: 'Autonomous multi-agent swarms, local LLM tooling, automated workflows, and self-healing systems.',
      icon: Cpu,
      prize: '₹4,00,000',
      tag: 'AI / ML',
    },
    {
      title: 'Cybersecurity & Privacy',
      desc: 'Zero-knowledge proofs, automated vulnerability scanners, secure enclaves, and cryptographic primitives.',
      icon: Lock,
      prize: '₹3,50,000',
      tag: 'SECURITY',
    },
    {
      title: 'Web3 & Decentralized Tech',
      desc: 'Account abstraction, cross-chain infrastructure, decentralized storage, and resilient smart contracts.',
      icon: Coins,
      prize: '₹3,50,000',
      tag: 'WEB3',
    },
    {
      title: 'Cloud & Distributed Systems',
      desc: 'High-throughput stream processing, edge computing, distributed storage, and serverless architectures.',
      icon: Code2,
      prize: '₹2,50,000',
      tag: 'CLOUD',
    },
    {
      title: 'Open Innovation & Campus Tech',
      desc: 'Smart campus systems, healthcare tech, developer productivity, and civic technology tools.',
      icon: Rocket,
      prize: '₹1,50,000',
      tag: 'OPEN',
    },
  ];

  const schedule = [
    { 
      day: 'DAY 1',
      time: '07:30 AM', 
      title: 'Express Gate Check-in & Breakfast', 
      desc: 'Scan your digital QR pass at DIT Main Entrance to collect your badge and hacker kit.' 
    },
    { 
      day: 'DAY 1',
      time: '09:30 AM', 
      title: 'Inauguration & Track Release', 
      desc: 'Official keynote by DIT dignitaries and release of 2026 problem statements in DIT Auditorium.' 
    },
    { 
      day: 'DAY 1',
      time: '11:00 AM', 
      title: '48-Hour Hackathon Commences ⚡', 
      desc: 'Hacking begins with Gigabit Wi-Fi, high-density lab access, and uninterrupted power.' 
    },
    { 
      day: 'DAY 2',
      time: '02:00 PM', 
      title: 'ACES Midway Mentor Review', 
      desc: '1-on-1 architecture reviews and dry runs with industry engineers and startup founders.' 
    },
    { 
      day: 'DAY 2',
      time: '11:30 PM', 
      title: 'Midnight Energy & Gaming Break', 
      desc: 'Midnight snacks, trivia challenges, and music hosted by the ACES student team.' 
    },
    { 
      day: 'DAY 3',
      time: '11:00 AM', 
      title: 'Code Freeze & Project Submission', 
      desc: 'GitHub repositories frozen and demo verification completed.' 
    },
    { 
      day: 'DAY 3',
      time: '03:00 PM', 
      title: 'Grand Finale & Award Ceremony', 
      desc: 'Top 10 team live stage pitches and ₹15,00,000+ cash prizes distribution.' 
    },
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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px 80px 20px', position: 'relative' }}>
      
      {/* Background Glowing Ambient Orbs matching ACES theme */}
      <div className="bg-glow-orb" style={{ width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(178, 43, 47, 0.3) 0%, transparent 70%)', top: '2%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="bg-glow-orb" style={{ width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(209, 165, 80, 0.15) 0%, transparent 70%)', top: '25%', right: '5%' }} />

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '40px 0 50px 0', position: 'relative', zIndex: 1 }}>
        
        {/* ACES Background Hero Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <span className="badge badge-aces-hero" style={{ padding: '6px 18px', fontSize: '12px' }}>
            🏛️ DR. D. Y. PATIL INSTITUTE OF TECHNOLOGY (DYPDPU)
          </span>
          <span className="badge badge-aces-gold hide-on-tiny" style={{ padding: '6px 14px', fontSize: '11px' }}>
            ⚡ ACES PRESENTS
          </span>
        </div>

        {/* Attached Official DYP DPU Logo with ACES card styling */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ background: '#ffffff', padding: '10px 24px', borderRadius: '14px', boxShadow: '0 10px 35px rgba(0,0,0,0.6)', border: '2px solid rgba(209, 165, 80, 0.5)' }}>
            <img
              src="/dypdpu-logo.png"
              alt="Dr. D. Y. Patil Vidyapeeth (DYP DPU)"
              style={{ height: '54px', width: 'auto', display: 'block', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Big Bold Headline */}
        <h1 style={{ fontSize: 'clamp(40px, 7.5vw, 84px)', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1.05, color: '#ffffff', marginBottom: '18px' }}>
          HACKSERIES <span style={{ color: 'var(--dyp-crimson)' }}>2026</span>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2.2vw, 19px)', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 32px auto', lineHeight: 1.6, fontWeight: '500' }}>
          India’s premier 48-hour student hackathon hosted at <strong>Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune</strong>. 2,000+ builders, instant digital QR check-in, and ₹15,00,000+ in prizes.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-dyp btn-lg"
            style={{ fontSize: '15px', padding: '16px 36px' }}
          >
            <Zap size={18} /> Register via Google Form <ExternalLink size={15} />
          </a>

          <a 
            href="#lookup-section" 
            className="btn btn-secondary btn-lg"
            style={{ fontSize: '15px', padding: '16px 28px', border: '1px solid rgba(209, 165, 80, 0.35)' }}
          >
            <Search size={16} color="var(--dyp-gold)" /> Retrieve My Digital Pass
          </a>
        </div>

        {/* Bold Minimal Metrics Strip with ACES Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', maxWidth: '980px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff' }}>48 Hours</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Non-Stop Sprint</div>
          </div>

          <div className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(209, 165, 80, 0.35)', background: 'rgba(209, 165, 80, 0.06)' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#f7d070' }}>₹15,00,000+</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Prize Pool</div>
          </div>

          <div className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(178, 43, 47, 0.35)', background: 'rgba(178, 43, 47, 0.06)' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fca5a5' }}>2,000+</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Participants</div>
          </div>

          <div className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff' }}>Oct 16–18</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>DIT Pune Campus</div>
          </div>
        </div>

      </section>

      {/* Instant Digital Pass Retrieval Search with ACES Badges */}
      <section id="lookup-section" style={{ maxWidth: '760px', margin: '0 auto 60px auto', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: '30px', border: '1px solid rgba(209, 165, 80, 0.4)', background: 'linear-gradient(145deg, #111624 0%, #090c15 100%)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span className="badge badge-aces-gold" style={{ marginBottom: '8px' }}>EXPRESS PASS PORTAL</span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.3px' }}>
              Already Registered? Access Your Pass
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Enter your registered email or Pass ID to view your HMAC-signed entry QR pass.
            </p>
          </div>

          <form onSubmit={handleLookup} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. aditya.renake@outlook.com or HS26-9B4D2E"
              value={lookupInput}
              onChange={(e) => setLookupInput(e.target.value)}
              style={{ flex: 1, minWidth: '220px', padding: '12px 16px', fontSize: '14px' }}
              required
            />
            <button type="submit" className="btn btn-dyp" style={{ padding: '12px 24px' }} disabled={isLookingUp}>
              <Search size={15} /> {isLookingUp ? 'Searching...' : 'Retrieve Pass'}
            </button>
          </form>
        </div>
      </section>

      {/* About ACES & DIT Pune */}
      <section style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-aces-hero" style={{ marginBottom: '10px' }}>ABOUT THE HOSTS</span>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px', marginBottom: '12px' }}>
                Association of Computer Engineering Students (ACES)
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                ACES is the student body of the <strong>Department of Computer Engineering, Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune</strong>. ACES drives programming contests, technical symposiums, hackathons, and industry mentorship.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                HackSeries 2026 brings collegiate and professional engineers together on the DIT Pune campus with cutting-edge labs, gigabit internet, and non-stop mentoring.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', border: '1px solid rgba(209, 165, 80, 0.25)', background: 'rgba(209, 165, 80, 0.06)' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#f7d070' }}>NAAC A++</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>DIT Pune Accredited</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', border: '1px solid rgba(178, 43, 47, 0.25)', background: 'rgba(178, 43, 47, 0.06)' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#fca5a5' }}>5 Tracks</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>AI, Web3, Cyber, Cloud</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff' }}>48 Hours</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Continuous Building</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.25)', background: 'rgba(34, 197, 94, 0.06)' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#4ade80' }}>Express QR</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Zero-Wait Entry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section with ACES Badges */}
      <section style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="badge badge-aces-gold" style={{ marginBottom: '8px' }}>INNOVATION DOMAINS</span>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
            5 Focused Hackathon Tracks
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {tracks.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(178, 43, 47, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', border: '1px solid rgba(178, 43, 47, 0.3)' }}>
                      <Icon size={20} />
                    </div>
                    <span className="badge badge-aces-dark" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                      {t.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{t.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '700' }}>PRIZE</span>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#f7d070' }}>{t.prize}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Schedule Section */}
      <section style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="badge badge-aces-hero" style={{ marginBottom: '8px' }}>OCTOBER 16 - 18, 2026</span>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>
            Event Schedule & Milestones
          </h2>
        </div>

        <div className="glass-card" style={{ padding: '24px 28px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {schedule.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', borderBottom: idx < schedule.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none', paddingBottom: idx < schedule.length - 1 ? '14px' : '0' }}>
                <div style={{ minWidth: '110px' }}>
                  <span className="badge badge-aces-gold" style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {item.day}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', fontWeight: '700', marginTop: '4px' }}>
                    {item.time}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue & Location */}
      <section style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ padding: '28px 32px', border: '1px solid rgba(209, 165, 80, 0.35)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', background: 'linear-gradient(145deg, #111522 0%, #090c14 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(178, 43, 47, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', border: '1px solid rgba(178, 43, 47, 0.4)' }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                Dr. D. Y. Patil Institute of Technology (DIT)
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Sant Tukaram Nagar, Pimpri, Pune - 411018 (Near Sant Tukaram Nagar Metro Station)
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Dr.+D.+Y.+Patil+Institute+of+Technology,+Pimpri,+Pune"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ border: '1px solid rgba(209, 165, 80, 0.4)' }}
          >
            <Compass size={15} color="var(--dyp-gold)" /> Open Google Maps <ArrowUpRight size={13} />
          </a>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DYPDPULogo height={26} />
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            © 2026 HackSeries • ACES, Dept. of Computer Engineering, DIT Pune (DYPDPU)
          </span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
          Lead Operations: <a href="mailto:aditya.renake@outlook.com" style={{ color: 'var(--dyp-gold)', textDecoration: 'none' }}>aditya.renake@outlook.com</a>
        </div>
      </footer>

    </div>
  );
};
