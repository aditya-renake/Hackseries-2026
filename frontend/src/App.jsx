import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { EventLandingPage } from './pages/EventLandingPage';
import { DigitalPassPage } from './pages/DigitalPassPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { api } from './services/api';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [activePassId, setActivePassId] = useState(null);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Check URL pathname for /pass/:uniqueId or /register
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/pass/')) {
      const id = path.split('/pass/')[1];
      if (id) {
        setActivePassId(id);
        setCurrentView('pass');
      }
    } else if (path === '/register') {
      setCurrentView('register');
    }
  }, []);

  // Check existing session
  useEffect(() => {
    const existingUser = api.auth.getUser();
    if (existingUser && api.auth.isAuthenticated()) {
      setUser(existingUser);
    }
  }, []);

  const handleShowToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    setCurrentView('landing');
    handleShowToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out of operations console.',
    });
  };

  const handleNavigateToPass = (uniqueId) => {
    setActivePassId(uniqueId);
    window.history.pushState({}, '', `/pass/${uniqueId}`);
    setCurrentView('pass');
  };

  const handleNavigateToRegister = (openInNewTab = false) => {
    if (openInNewTab) {
      window.open('/register', '_blank');
    } else {
      window.history.pushState({}, '', '/register');
      setCurrentView('register');
    }
  };

  const handleBackToLanding = () => {
    window.history.pushState({}, '', '/');
    setActivePassId(null);
    setCurrentView('landing');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      {currentView !== 'register' && currentView !== 'pass' && (
        <Navbar
          currentView={currentView}
          setCurrentView={(view) => {
            if (view === 'landing') {
              window.history.pushState({}, '', '/');
            } else if (view === 'register') {
              window.history.pushState({}, '', '/register');
            }
            setCurrentView(view);
          }}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <EventLandingPage
            onNavigateToPass={handleNavigateToPass}
            onNavigateToRegister={handleNavigateToRegister}
            onShowToast={handleShowToast}
          />
        )}

        {currentView === 'register' && (
          <RegistrationPage
            onBack={handleBackToLanding}
            onNavigateToPass={handleNavigateToPass}
            onShowToast={handleShowToast}
          />
        )}

        {currentView === 'pass' && activePassId && (
          <DigitalPassPage
            uniqueId={activePassId}
            onBack={handleBackToLanding}
            onShowToast={handleShowToast}
          />
        )}

        {currentView === 'dashboard' && user && (
          <DashboardPage
            onShowToast={handleShowToast}
            onNavigateToScanner={() => setCurrentView('scanner')}
          />
        )}

        {currentView === 'scanner' && user && (
          <ScannerPage onShowToast={handleShowToast} />
        )}

        {currentView === 'login' && (
          <LoginPage
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setCurrentView(loggedInUser.role === 'admin' ? 'dashboard' : 'scanner');
            }}
            onShowToast={handleShowToast}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'landing' && (
        <footer style={{ background: '#030712', borderTop: '1px solid var(--border-subtle)', padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              © 2026 <strong>HackSeries</strong> • Operations Lead: <strong>aditya.renake@outlook.com</strong>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>🔒 Zero-Forgery HMAC Engine</span>
              <span>⚡ Direct Database Intake</span>
              <span>📱 In-Browser Camera Scanner</span>
            </div>
          </div>
        </footer>
      )}

      {/* Global Toast Notification System */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast"
            style={{
              borderLeft: `4px solid ${
                t.type === 'success'
                  ? '#22c55e'
                  : t.type === 'error'
                  ? '#ef4444'
                  : t.type === 'warning'
                  ? '#f59e0b'
                  : '#06b6d4'
              }`,
            }}
          >
            {t.type === 'success' && <CheckCircle2 size={20} color="#22c55e" />}
            {t.type === 'error' && <XCircle size={20} color="#ef4444" />}
            {t.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
            {t.type === 'info' && <Info size={20} color="#06b6d4" />}
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{t.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
