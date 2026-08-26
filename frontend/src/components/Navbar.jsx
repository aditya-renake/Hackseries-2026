import React, { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, LayoutDashboard, Globe, LogOut, Lock, Zap, Menu, X } from 'lucide-react';
import { DYPDPULogo } from './CollegeLogos';

export const Navbar = ({ currentView, setCurrentView, user, onLogout }) => {
  const [time, setTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-root" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(9, 13, 22, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }} onClick={() => handleNavClick('landing')}>
          <DYPDPULogo height={24} />
          
          <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.12)', flexShrink: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff', whiteSpace: 'nowrap' }}>
              HACKSERIES <span style={{ color: 'var(--dyp-gold)' }}>2026</span>
            </span>
            <span className="badge badge-dyp hide-on-tiny" style={{ fontSize: '9px', padding: '1px 6px' }}>ACES DIT</span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`btn btn-sm ${currentView === 'landing' ? 'btn-dyp' : 'btn-ghost'}`}
            onClick={() => handleNavClick('landing')}
          >
            <Globe size={14} /> Event Website
          </button>

          {user && (
            <>
              {user.role === 'admin' && (
                <button
                  className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-dyp' : 'btn-ghost'}`}
                  onClick={() => handleNavClick('dashboard')}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </button>
              )}
              <button
                className={`btn btn-sm ${currentView === 'scanner' ? 'btn-aces' : 'btn-ghost'}`}
                onClick={() => handleNavClick('scanner')}
              >
                <QrCode size={14} /> Gate Scanner
              </button>
            </>
          )}

          {!user && (
            <button
              className={`btn btn-sm ${currentView === 'login' ? 'btn-dyp' : 'btn-ghost'}`}
              onClick={() => handleNavClick('login')}
            >
              <Lock size={14} /> Staff Login
            </button>
          )}
        </nav>

        {/* Right Info / Desktop Profile & Mobile Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="live-clock hide-on-mobile" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--dyp-gold)', background: 'rgba(209, 165, 80, 0.08)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(209, 165, 80, 0.25)', fontWeight: '700' }}>
            ● LIVE {time}
          </div>

          {user ? (
            <div className="desktop-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right' }} className="hide-on-mobile">
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
            <button className="btn btn-secondary btn-sm desktop-signin" onClick={() => handleNavClick('login')}>
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="btn btn-ghost btn-sm mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '6px', color: '#ffffff' }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" style={{ background: '#0a0e1a', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            className={`btn btn-sm ${currentView === 'landing' ? 'btn-dyp' : 'btn-secondary'}`}
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
            onClick={() => handleNavClick('landing')}
          >
            <Globe size={16} /> Event Website
          </button>

          {user && (
            <>
              {user.role === 'admin' && (
                <button
                  className={`btn btn-sm ${currentView === 'dashboard' ? 'btn-dyp' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
                  onClick={() => handleNavClick('dashboard')}
                >
                  <LayoutDashboard size={16} /> Operations Dashboard
                </button>
              )}
              <button
                className={`btn btn-sm ${currentView === 'scanner' ? 'btn-aces' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
                onClick={() => handleNavClick('scanner')}
              >
                <QrCode size={16} /> Gate Scanner Terminal
              </button>

              <button
                className="btn btn-danger btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', marginTop: '8px' }}
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut size={16} /> Sign Out ({user.name})
              </button>
            </>
          )}

          {!user && (
            <button
              className={`btn btn-sm ${currentView === 'login' ? 'btn-dyp' : 'btn-secondary'}`}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px' }}
              onClick={() => handleNavClick('login')}
            >
              <Lock size={16} /> Staff & Admin Login
            </button>
          )}

          <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '11px', color: 'var(--dyp-gold)', display: 'flex', justifyContent: 'space-between' }}>
            <span>🏛️ DIT PUNE • ACES</span>
            <span>● LIVE {time}</span>
          </div>
        </div>
      )}
    </header>
  );
};
