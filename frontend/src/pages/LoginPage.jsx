import React, { useState } from 'react';
import { Lock, Mail, Zap, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const LoginPage = ({ onLoginSuccess, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsLoading(true);
      const data = await api.auth.login(email, password);
      onShowToast({
        type: 'success',
        title: 'Authentication Verified! ⚡',
        message: `Welcome back, ${data.user.name} (${data.user.role})`,
      });
      onLoginSuccess(data.user);
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Login Failed',
        message: err.message || 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-card" style={{ padding: '36px 30px', border: '1px solid rgba(34, 197, 94, 0.3)', background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.95) 100%)' }}>
        
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030712', margin: '0 auto 12px auto', boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}>
            <Lock size={22} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>Staff & Admin Portal</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>HackSeries 2026 Operations Console</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Staff Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="input-control"
                placeholder="aditya.renake@outlook.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
              <Mail size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
                required
              />
              <Lock size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '6px', fontSize: '14px' }} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Sign In to Operations'} <ArrowRight size={16} />
          </button>
        </form>

        {/* 1-Click Demo Logins */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px', letterSpacing: '0.5px' }}>
            Quick 1-Click Demo Accounts
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '8px 14px' }}
              onClick={() => handleQuickFill('aditya.renake@outlook.com', 'hackseries2026')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={14} color="#22c55e" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Aditya Renake (Lead Admin)</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>aditya.renake@outlook.com</div>
                </div>
              </div>
              <span className="badge badge-emerald">Auto Fill</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', padding: '8px 14px' }}
              onClick={() => handleQuickFill('gate1@hackseries.io', 'scanner123')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={14} color="#06b6d4" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Gate Scanner Staff #1</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>gate1@hackseries.io</div>
                </div>
              </div>
              <span className="badge badge-cyan">Auto Fill</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
