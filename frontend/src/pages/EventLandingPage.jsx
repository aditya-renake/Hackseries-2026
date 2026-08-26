import React, { useState } from 'react';
import { 
  Power, 
  ExternalLink, 
  Search, 
  Cpu, 
  Lock, 
  Coins, 
  Code2, 
  Rocket, 
  MapPin, 
  Compass, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import { DYPDPULogo, ACESLogo } from '../components/CollegeLogos';
import { ConstellationBackground } from '../components/ConstellationBackground';
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
        message: 'No registered pass found for this ID or Email. Please ensure you completed the Google Form registration.',
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px 80px 20px', position: 'relative' }}>
      
      {/* Background Matrix Constellation Nodes from Screenshot */}
      <ConstellationBackground />

      {/* Hero Section matching the Screenshot */}
      <section style={{ textAlign: 'center', padding: '30px 0 50px 0', position: 'relative', zIndex: 1 }}>
        
        {/* Cyber Node Init Badge */}
        <div style={{ marginBottom: '18px' }}>
          <div className="cyber-node-badge">
            <span style={{ color: '#22c55e' }}>●</span> SYS.INIT // ACES_NODE_01 // HACKSERIES_2026
          </div>
        </div>

        {/* Official College Logo Card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: '#ffffff', padding: '8px 20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(178, 43, 47, 0.08)', border: '1px solid #ecd9c6' }}>
            <img
              src="/dypdpu-logo.png"
              alt="Dr. D. Y. Patil Vidyapeeth (DYP DPU)"
              style={{ height: '48px', width: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* Hero Huge Bold Typography matching Screenshot */}
        <div style={{ margin: '10px 0 16px 0' }}>
          <h1 className="hero-aces-title">
            ACES
          </h1>
          <div style={{ fontSize: 'clamp(24px, 5vw, 44px)', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-1px', marginTop: '-4px' }}>
            HACKSERIES <span style={{ color: 'var(--dyp-crimson)' }}>2026</span>
          </div>
        </div>

        {/* Black Subtitle Bar from Screenshot */}
        <div style={{ margin: '0 auto 26px auto', maxWidth: '840px' }}>
          <div className="black-subtitle-bar">
            ASSOCIATION OF COMPUTER ENGINEERING STUDENTS • DIT PIMPRI PUNE
          </div>
        </div>

        {/* Action Button & Cyber Coords Box matching Screenshot */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '44px' }}>
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-initialize"
          >
            <Power size={16} /> INITIALIZE REGISTRATION <ExternalLink size={13} />
          </a>

          <div className="cyber-coords-box">
            <div>COORD: <strong style={{ color: '#f7d070' }}>18.6256° N, 73.8122° E</strong></div>
            <div>STATUS: <span style={{ color: '#22c55e', fontWeight: '800' }}>ONLINE // 48H SPRINT</span></div>
          </div>
        </div>

        {/* Bold Minimal Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', maxWidth: '980px', margin: '0 auto' }}>
          <div className="aces-card-light" style={{ padding: '18px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#b22b2f' }}>48 Hours</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px', fontWeight: '700' }}>Continuous Hack</div>
          </div>

          <div className="aces-card-light" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(209, 165, 80, 0.4)' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#d1a550' }}>₹15,00,000+</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px', fontWeight: '700' }}>Prize Pool</div>
          </div>

          <div className="aces-card-light" style={{ padding: '18px 14px', textAlign: 'center', border: '1px solid rgba(178, 43, 47, 0.3)' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#b22b2f' }}>2,000+</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px', fontWeight: '700' }}>Builders & Hackers</div>
          </div>

          <div className="aces-card-light" style={{ padding: '18px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a1a' }}>Oct 16–18</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px', fontWeight: '700' }}>DIT Pune Campus</div>
          </div>
        </div>

      </section>

      {/* Instant Digital Pass Retrieval Search */}
      <section id="lookup-section" style={{ maxWidth: '760px', margin: '0 auto 60px auto', position: 'relative', zIndex: 1 }}>
        <div className="aces-card-light" style={{ padding: '30px', border: '1.5px solid #ecd9c6' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className="cyber-node-badge" style={{ marginBottom: '8px' }}>
              <span>⚡</span> PASS ACCESS PORTAL
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.3px' }}>
              Already Registered? Access Your Pass
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Enter your registered email or Pass ID to view and download your verified entry QR pass.
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
      <section id="about-section" style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div className="aces-card-light" style={{ padding: '36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-dyp" style={{ marginBottom: '10px' }}>WHO ARE WE</span>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: '12px' }}>
                Association of Computer Engineering Students (ACES)
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                ACES is the official student body of the <strong>Department of Computer Engineering, Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune</strong>. We spearhead national hackathons, technical conferences, coding contests, and research mentorship.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                HackSeries 2026 brings the brightest collegiate minds together on the DIT Pune campus with air-conditioned compute labs, gigabit fiber, 24/7 catering, and industry veteran mentorship.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="aces-card-light" style={{ padding: '16px', textAlign: 'center', background: '#fdf8f5' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#d1a550' }}>NAAC A++</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '700' }}>DIT Pune Accredited</div>
              </div>
              <div className="aces-card-light" style={{ padding: '16px', textAlign: 'center', background: '#fdf8f5' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#b22b2f' }}>5 Tracks</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '700' }}>AI, Web3, Cyber, Cloud</div>
              </div>
              <div className="aces-card-light" style={{ padding: '16px', textAlign: 'center', background: '#fdf8f5' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a1a' }}>48 Hours</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '700' }}>Non-Stop Building</div>
              </div>
              <div className="aces-card-light" style={{ padding: '16px', textAlign: 'center', background: '#fdf8f5' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#15803d' }}>Express QR</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '700' }}>Zero-Wait Gate Entry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section id="tracks-section" style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>PROBLEM DOMAINS</span>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
            5 Focused Hackathon Tracks
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {tracks.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="aces-card-light" style={{ padding: '22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(178, 43, 47, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b22b2f' }}>
                      <Icon size={20} />
                    </div>
                    <span className="badge badge-dark" style={{ fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                      {t.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a', marginBottom: '6px' }}>{t.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #ecd9c6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '700' }}>PRIZE POOL</span>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#b22b2f' }}>{t.prize}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule-section" style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="badge badge-dyp" style={{ marginBottom: '8px' }}>OCTOBER 16 - 18, 2026</span>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
            Event Schedule & Milestones
          </h2>
        </div>

        <div className="aces-card-light" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {schedule.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', borderBottom: idx < schedule.length - 1 ? '1px solid #ecd9c6' : 'none', paddingBottom: idx < schedule.length - 1 ? '14px' : '0' }}>
                <div style={{ minWidth: '110px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '10px', padding: '2px 8px' }}>
                    {item.day}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#1a1a1a', fontWeight: '800', marginTop: '4px' }}>
                    {item.time}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#1a1a1a' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue & Location */}
      <section id="venue-section" style={{ margin: '0 0 60px 0', position: 'relative', zIndex: 1 }}>
        <div className="aces-card-light" style={{ padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(178, 43, 47, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b22b2f', border: '1px solid rgba(178, 43, 47, 0.3)' }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a1a' }}>
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
          >
            <Compass size={15} color="var(--dyp-gold)" /> Open Google Maps <ArrowUpRight size={13} />
          </a>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer style={{ borderTop: '1px solid #ecd9c6', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/dypdpu-logo.png"
            alt="DYP DPU"
            style={{ height: '24px', width: 'auto' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            © 2026 HackSeries • ACES, Dept. of Computer Engineering, DIT Pune (DYPDPU)
          </span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Lead Operations: <a href="mailto:aditya.renake@outlook.com" style={{ color: 'var(--dyp-crimson)', textDecoration: 'none', fontWeight: '700' }}>aditya.renake@outlook.com</a>
        </div>
      </footer>

    </div>
  );
};
