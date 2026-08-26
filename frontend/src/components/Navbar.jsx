import React, { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, LayoutDashboard, Globe, LogOut, Lock, Zap, Search } from 'lucide-react';
import { DYPDPULogo, ACESLogo } from './CollegeLogos';

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
    <header className="glass-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setCurrentView('landing')}>
          <DYPDPULogo height={28} />
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.12)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff' }}>
              HACKSERIES <span style={{ color: 'var(--dyp-gold)' }}>2026</span>
            </span>
            <span className="badge badge-dyp" style={{ fontSize: '10px', padding: '2px 8px' }}>ACES DIT</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`btn btn-sm ${currentView === 'landing' ? 'btn-dyp' : 'btn-ghost'}`}
            onClick={() => setCurrentView('landing')}
          >
            <Globe size={14} /> Event Website
          </button>

          {user && (
            <>
              {user.role === 'admin' && (
                <button
                  className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-dyp' : 'btn-ghost'}`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </button>
              )}
              <button
                className={`btn btn-sm ${currentView === 'scanner' ? 'btn-aces' : 'btn-ghost'}`}
                onClick={() => setCurrentView('scanner')}
              >
                <QrCode size={14} /> Gate Scanner
              </button>
            </>
          )}

          {!user && (
            <button
              className={`btn btn-sm ${currentView === 'login' ? 'btn-dyp' : 'btn-ghost'}`}
              onClick={() => setCurrentView('login')}
            >
              <Lock size={14} /> Staff Login
            </button>
          )}
        </nav>

        {/* Right Info & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dyp-gold)', background: 'rgba(209, 165, 80, 0.08)', padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(209, 165, 80, 0.25)', fontWeight: '700' }}>
            ● LIVE {time}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>{user.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {user.role === 'admin' ? 'Operations Lead' : 'Gate Staff'}
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onLogout}
                title="Logout"
                style={{ padding: '6px', color: '#f87171' }}
              >
                <LogOut size={15} />
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
