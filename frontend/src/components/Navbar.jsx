import React, { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, LayoutDashboard, Globe, LogOut, Lock, Zap } from 'lucide-react';
import { DYPDPULogo, ACESLogo, InstitutionalHeaderBar } from './CollegeLogos';
import { api } from '../services/api';

export const Navbar = ({ currentView, setCurrentView, user, onLogout }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Institutional Bar */}
      <InstitutionalHeaderBar />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logos: DYPDPU + ACES + HackSeries */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setCurrentView('landing')}>
          <DYPDPULogo size={38} />
          
          <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)' }} />

          <ACESLogo size={36} />

          <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #ffffff 0%, #d1a550 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                HACKSERIES
              </span>
              <span className="badge badge-emerald">2026</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.5px' }}>DIT PUNE • 48H HACKATHON</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0b0f19', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn btn-sm ${currentView === 'landing' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCurrentView('landing')}
          >
            <Globe size={15} /> Event Website
          </button>

          {user && (
            <>
              {user.role === 'admin' && (
                <button
                  className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  <LayoutDashboard size={15} /> Dashboard
                </button>
              )}
              <button
                className={`btn btn-sm ${currentView === 'scanner' ? 'btn-cyan' : 'btn-ghost'}`}
                onClick={() => setCurrentView('scanner')}
              >
                <QrCode size={15} /> Gate Scanner
              </button>
            </>
          )}

          {!user && (
            <button
              className={`btn btn-sm ${currentView === 'login' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setCurrentView('login')}
            >
              <Lock size={15} /> Staff Login
            </button>
          )}
        </nav>

        {/* Right Info & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-emerald)', background: 'rgba(34, 197, 94, 0.08)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            ● LIVE {time}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role === 'admin' ? '⚡ Operations Lead' : '🛡️ Gate Staff'}
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onLogout}
                title="Logout"
                style={{ padding: '8px', color: '#f87171' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentView('login')}>
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
