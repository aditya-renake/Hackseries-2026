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
  Building2,
  GraduationCap,
  Wifi,
  Coffee,
  BatteryCharging,
  ArrowUpRight,
  Mail
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
      desc: 'Autonomous multi-agent architectures, local LLM orchestration, devops mesh, and self-healing systems.',
      icon: Cpu,
      prize: '₹4,00,000',
      color: '#b22b2f',
      accent: 'rgba(178, 43, 47, 0.15)',
    },
    {
      title: 'Cybersecurity & Privacy',
      desc: 'Zero-knowledge proofs, automated vulnerability discovery, tamper-proof audit trails, and privacy primitives.',
      icon: Lock,
      prize: '₹3,50,000',
      color: '#06b6d4',
      accent: 'rgba(6, 182, 212, 0.15)',
    },
    {
      title: 'Web3 & Decentralized Protocols',
      desc: 'Cross-chain liquidity routers, account abstraction, resilient infra, and decentralized identity systems.',
      icon: Coins,
      prize: '₹3,50,000',
      color: '#8b5cf6',
      accent: 'rgba(139, 92, 246, 0.15)',
    },
    {
      title: 'Cloud & Distributed Systems',
      desc: 'High-throughput stream processing, edge computing, distributed databases, and serverless architectures.',
      icon: Code2,
      prize: '₹2,50,000',
      color: '#d1a550',
      accent: 'rgba(209, 165, 80, 0.15)',
    },
    {
      title: 'Open Innovation & Smart Campus',
      desc: 'Sustainable campus tech, health informatics, civic technologies, and developer productivity tooling.',
      icon: Rocket,
      prize: '₹1,50,000',
      color: '#22c55e',
      accent: 'rgba(34, 197, 94, 0.15)',
    },
  ];

  const schedule = [
    { 
      time: 'Day 1 • 07:30 AM', 
      title: 'Express Gate Check-in & Breakfast', 
      desc: 'Present your verified QR pass at the DIT Main Auditorium entrance to collect your badge & official hacker kit.' 
    },
    { 
      time: 'Day 1 • 09:30 AM', 
      title: 'Inauguration & Problem Statements Release', 
      desc: 'Welcome address by College Dignitaries, HOD Computer Engineering, and ACES faculty advisors.' 
    },
    { 
      time: 'Day 1 • 11:00 AM', 
      title: 'Hacking Commences ⚡', 
      desc: '48 hours of uninterrupted building with high-speed gigabit Wi-Fi, food courts, and continuous mentoring.' 
    },
    { 
      time: 'Day 2 • 02:00 PM', 
      title: 'ACES Midway Mentor Review & Dry Runs', 
      desc: 'Technical feedback and architecture review from industry leaders, alumni mentors, and startup founders.' 
    },
    { 
      time: 'Day 2 • 11:30 PM', 
      title: 'Midnight Gaming & Energy Break', 
      desc: 'Midnight snacks, gaming challenges, and entertainment hosted by the ACES student council.' 
    },
    { 
      time: 'Day 3 • 11:00 AM', 
      title: 'Code Freeze & Project Submissions', 
      desc: 'GitHub repo freeze, project demo uploads, and automated integrity validation.' 
    },
    { 
      time: 'Day 3 • 03:00 PM', 
      title: 'Grand Finale & Award Ceremony in DIT Auditorium', 
      desc: 'Top 10 finalist presentations on the main stage followed by ₹15,00,000+ prize awards distribution.' 
    },
  ];

  const campusFeatures = [
    {
      title: 'High-Density Hack Labs',
      desc: 'Centrally air-conditioned computer labs with high-performance workstations and comfortable seating.',
      icon: Building2,
    },
    {
      title: 'Gigabit Campus Wi-Fi',
      desc: 'Dedicated enterprise multi-SSID fiber connection for seamless development, testing, and deployment.',
      icon: Wifi,
    },
    {
      title: '24/7 Power & Infra Backup',
      desc: 'Triple-redundant power backup ensuring zero downtime across the entire 48-hour sprint.',
      icon: BatteryCharging,
    },
    {
      title: 'Continuous Meals & Refreshments',
      desc: 'Complimentary breakfast, lunch, dinner, midnight energy snacks, coffee, and hydration stations.',
      icon: Coffee,
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
    <div style={{ paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ maxWidth: '1280px', margin: '30px auto 60px auto', padding: '0 24px', textAlign: 'center' }}>
        
        {/* Presented by ACES & DYPDPU Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(90deg, rgba(178, 43, 47, 0.15) 0%, rgba(209, 165, 80, 0.15) 100%)', border: '1px solid rgba(209, 165, 80, 0.4)', borderRadius: '999px', padding: '8px 20px', fontSize: '13px', color: '#f7d070', fontWeight: '800', marginBottom: '24px', boxShadow: '0 4px 20px rgba(178, 43, 47, 0.2)' }}>
          <Sparkles size={16} color="#d1a550" />
          <span>Presented by ACES • Department of Computer Engineering • DIT Pune (DYPDPU)</span>
        </div>

        {/* Institutional Logos Showcase */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(178, 43, 47, 0.35)', background: 'rgba(15, 23, 42, 0.6)' }}>
            <DYPDPULogo size={38} />
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: '18px', fontWeight: '900' }}>×</div>
          <div className="glass-card" style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(6, 182, 212, 0.35)', background: 'rgba(15, 23, 42, 0.6)' }}>
            <ACESLogo size={36} />
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1.05, marginBottom: '20px' }}>
          INNOVATE AT SCALE AT <br />
          <span style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d1a550 40%, #b22b2f 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HACKSERIES 2026
          </span>
        </h1>

        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
          India’s premier 48-hour hackathon hosted at <strong style={{ color: '#fff' }}>Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune</strong>. Bringing together 2,000+ builders, creators, and engineers with instant cryptographic digital entry passes.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
          
          {/* Primary Google Form Registration Link */}
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-dyp btn-lg"
            style={{ padding: '16px 36px', fontSize: '16px' }}
          >
            <Zap size={20} /> Register via Google Form <ExternalLink size={16} />
          </a>

          <a href="#lookup-section" className="btn btn-secondary btn-lg" style={{ border: '1px solid rgba(209, 165, 80, 0.3)' }}>
            <Search size={18} color="#d1a550" /> Retrieve My Pass
          </a>
        </div>

        {/* Key Event Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', maxWidth: '1060px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(178, 43, 47, 0.3)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(178, 43, 47, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={22} color="#b22b2f" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>October 16 - 18, 2026</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>48 Hours Non-Stop Sprint</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(209, 165, 80, 0.3)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(209, 165, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={22} color="#d1a550" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>DIT Campus, Pimpri</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Pune • Hybrid & Onsite</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} color="#06b6d4" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>₹15,00,000+ Pool</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Cash Prizes & Grants</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#22c55e" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#fff' }}>Instant Digital Passes</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>HMAC Verified QR Check-in</div>
            </div>
          </div>
        </div>

      </section>

      {/* Lookup Pass Section */}
      <section id="lookup-section" style={{ maxWidth: '820px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(209, 165, 80, 0.3)', background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.95) 100%)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(209, 165, 80, 0.12)', border: '1px solid rgba(209, 165, 80, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1a550', margin: '0 auto 12px auto' }}>
              <Terminal size={24} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>Already Registered via Google Form?</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Enter your registered Email Address or Pass ID to view your official digital event pass and save it to your phone.
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
            <button type="submit" className="btn btn-dyp" style={{ padding: '14px 28px' }} disabled={isLookingUp}>
              <Search size={16} /> {isLookingUp ? 'Searching...' : 'Find My Pass'}
            </button>
          </form>
        </div>
      </section>

      {/* About ACES & DIT Pune */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(178, 43, 47, 0.3)', background: 'linear-gradient(135deg, rgba(20, 10, 12, 0.9) 0%, rgba(11, 15, 25, 0.9) 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-dyp" style={{ marginBottom: '12px' }}>ABOUT THE ORGANIZERS</span>
              <h2 style={{ fontSize: '30px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px' }}>
                Association of Computer Engineering Students (ACES)
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                ACES is the student innovation body of the <strong>Department of Computer Engineering at Dr. D. Y. Patil Institute of Technology, Pimpri, Pune (DYPDPU)</strong>. ACES spearheads technical summits, programming hackathons, developer bootcamps, and cutting-edge workshops.
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '24px' }}>
                With state-of-the-art computing laboratories, high-speed campus networks, and a community of passionate engineers, HackSeries 2026 provides builders with the ideal launchpad to build transformative solutions.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f7d070', fontSize: '13px', fontWeight: '700' }}>
                  <GraduationCap size={18} /> NAAC 'A++' Accredited
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontSize: '13px', fontWeight: '700' }}>
                  <Code2 size={18} /> Dept. of Computer Engineering
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(209, 165, 80, 0.25)' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#f7d070' }}>25+</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Years of Institutional Legacy</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(178, 43, 47, 0.25)' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#f87171' }}>2000+</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Registered Hackers & Builders</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#22d3ee' }}>50+</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Industry Mentors & Judges</div>
              </div>
              <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#4ade80' }}>₹15L+</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Prize Pool & Grants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Tracks */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '10px' }}>TRACKS & BOUNTIES</span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>Choose Your Battleground</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
            5 focused tracks curated with leading engineering research groups and industry partners.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {tracks.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${t.accent}` }}>
                <div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: t.accent, border: `1px solid ${t.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color, marginBottom: '20px' }}>
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
      <section style={{ maxWidth: '1000px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-dyp" style={{ marginBottom: '10px' }}>EVENT TIMELINE</span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>48-Hour Sprint Schedule</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Held on-site at Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '28px 36px', border: '1px solid rgba(178, 43, 47, 0.25)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {schedule.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '150px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#f7d070', fontWeight: '800', paddingTop: '2px' }}>
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

      {/* Campus Venue & Facilities */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-aces" style={{ marginBottom: '10px' }}>CAMPUS & INFRASTRUCTURE</span>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>Venue & Facilities</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px' }}>
            World-class engineering campus built for non-stop collaborative development.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '32px' }}>
          {campusFeatures.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(209, 165, 80, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1a550', flexShrink: 0 }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>{f.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Location Banner */}
        <div className="glass-card" style={{ padding: '28px 32px', border: '1px solid rgba(209, 165, 80, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(178, 43, 47, 0.2)', border: '1px solid rgba(178, 43, 47, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
              <MapPin size={24} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                Dr. D. Y. Patil Institute of Technology (DIT)
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Sant Tukaram Nagar, Pimpri, Pune - 411018, Maharashtra, India (Near Pimpri / Kasarwadi Metro)
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Dr.+D.+Y.+Patil+Institute+of+Technology,+Pimpri,+Pune"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ padding: '10px 18px', border: '1px solid rgba(209, 165, 80, 0.4)' }}
          >
            <Compass size={16} color="#d1a550" /> View on Google Maps <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '48px 32px', background: 'linear-gradient(135deg, rgba(178, 43, 47, 0.15) 0%, rgba(209, 165, 80, 0.15) 100%)', border: '1px solid rgba(209, 165, 80, 0.35)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '12px' }}>
            Ready to build at HackSeries 2026?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 28px auto' }}>
            Fill the official Google Form. Your pass will be generated and cryptographically signed for express check-in at DIT Pune campus!
          </p>
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-dyp btn-lg"
          >
            <Zap size={18} /> Complete Registration via Google Form <ExternalLink size={15} />
          </a>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer style={{ maxWidth: '1200px', margin: '80px auto 0 auto', padding: '30px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <DYPDPULogo size={32} />
          <ACESLogo size={30} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'right' }}>
          <div>© 2026 HackSeries • Organised by ACES, Dept. of Computer Engineering, DIT Pune (DYPDPU)</div>
          <div style={{ marginTop: '4px' }}>Lead Coordinator: Aditya Renake (<a href="mailto:aditya.renake@outlook.com" style={{ color: '#d1a550' }}>aditya.renake@outlook.com</a>)</div>
        </div>
      </footer>

    </div>
  );
};
