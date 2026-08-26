import React from 'react';

/**
 * Official Dr. D. Y. Patil Vidyapeeth / Institute of Technology (DYPDPU / DIT Pune) Emblem Logo
 */
export const DYPDPULogo = ({ size = 42, className = '' }) => (
  <div className={`dyp-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 8px rgba(178, 43, 47, 0.4))' }}
    >
      <defs>
        <linearGradient id="dypMaroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b22b2f" />
          <stop offset="100%" stopColor="#6e1417" />
        </linearGradient>
        <linearGradient id="dypGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d070" />
          <stop offset="50%" stopColor="#d1a550" />
          <stop offset="100%" stopColor="#8c6218" />
        </linearGradient>
      </defs>

      {/* Shield Background */}
      <path
        d="M50 4 L86 16 C86 52 74 78 50 96 C26 78 14 52 14 16 Z"
        fill="url(#dypMaroonGrad)"
        stroke="url(#dypGoldGrad)"
        strokeWidth="3"
      />

      {/* Inner Golden Border */}
      <path
        d="M50 11 L80 21 C80 50 69 72 50 88 C31 72 20 50 20 21 Z"
        fill="none"
        stroke="url(#dypGoldGrad)"
        strokeWidth="1.2"
        strokeDasharray="2 1"
        opacity="0.85"
      />

      {/* Knowledge Torch & Flame */}
      <path
        d="M50 26 C53 32 57 34 54 42 C51 38 49 37 50 26 Z"
        fill="#f59e0b"
      />
      <path
        d="M50 30 C51 34 53 36 51 40 C49 37 48 36 50 30 Z"
        fill="#fef08a"
      />
      <rect x="47.5" y="42" width="5" height="12" rx="1.5" fill="url(#dypGoldGrad)" />

      {/* Open Book of Wisdom */}
      <path
        d="M32 54 Q41 50 50 56 Q59 50 68 54 L68 66 Q59 62 50 68 Q41 62 32 66 Z"
        fill="#ffffff"
        stroke="url(#dypGoldGrad)"
        strokeWidth="1.5"
      />
      <line x1="50" y1="56" x2="50" y2="68" stroke="#b22b2f" strokeWidth="1.5" />

      {/* Stars / Excellence Laurels */}
      <circle cx="34" cy="38" r="2.5" fill="url(#dypGoldGrad)" />
      <circle cx="66" cy="38" r="2.5" fill="url(#dypGoldGrad)" />
      <circle cx="50" cy="78" r="3" fill="url(#dypGoldGrad)" />

      {/* DPU Text */}
      <text
        x="50"
        y="21"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="7.5"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="1.5"
      >
        DYPDPU
      </text>
    </svg>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.2px', lineHeight: 1.2 }}>
        Dr. D. Y. Patil Institute of Technology
      </div>
      <div style={{ fontSize: '10px', color: '#d1a550', fontWeight: '800', letterSpacing: '0.5px' }}>
        PIMPRI, PUNE • DYPDPU
      </div>
    </div>
  </div>
);

/**
 * Official ACES (Association of Computer Engineering Students) Logo
 */
export const ACESLogo = ({ size = 40, className = '' }) => (
  <div className={`aces-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 10px rgba(6, 182, 212, 0.4))' }}
    >
      <defs>
        <linearGradient id="acesCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="acesRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b22b2f" />
        </linearGradient>
      </defs>

      {/* Hexagon Cyber Frame */}
      <polygon
        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
        fill="#0b1120"
        stroke="url(#acesCyanGrad)"
        strokeWidth="3.5"
      />

      {/* Inner Matrix Grid */}
      <polygon
        points="50,15 82,33 82,67 50,85 18,67 18,33"
        fill="rgba(6, 182, 212, 0.08)"
        stroke="rgba(6, 182, 212, 0.3)"
        strokeWidth="1"
        strokeDasharray="3 2"
      />

      {/* Stylized 'A' Core */}
      <path
        d="M50 24 L72 72 L60 72 L50 48 L40 72 L28 72 Z"
        fill="url(#acesCyanGrad)"
      />
      <polygon points="50,38 56,54 44,54" fill="#0b1120" />

      {/* Tech Circuit Node */}
      <line x1="28" y1="58" x2="72" y2="58" stroke="url(#acesRedGrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="58" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
    </svg>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '15px', fontWeight: '900', color: '#22d3ee', letterSpacing: '1px' }}>ACES</span>
        <span style={{ fontSize: '9px', background: 'rgba(178, 43, 47, 0.25)', color: '#f87171', border: '1px solid rgba(178, 43, 47, 0.5)', padding: '1px 6px', borderRadius: '4px', fontWeight: '800' }}>
          DIT PUNE
        </span>
      </div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>
        Dept. of Computer Engineering
      </div>
    </div>
  </div>
);

/**
 * Top Institutional Accreditation Banner
 */
export const InstitutionalHeaderBar = () => (
  <div style={{ background: 'linear-gradient(90deg, #3d090b 0%, #1a0507 50%, #0d1527 100%)', borderBottom: '1px solid rgba(209, 165, 80, 0.3)', padding: '6px 20px', fontSize: '11px', color: '#e2ded9', textAlign: 'center' }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
        <span style={{ color: '#f7d070' }}>🏛️ DR. D. Y. PATIL INSTITUTE OF TECHNOLOGY</span>
        <span style={{ color: '#6b6d71' }}>•</span>
        <span style={{ color: '#a78bfa' }}>PIMPRI, PUNE (DYPDPU)</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '10px', color: '#d1d5dc' }}>
        <span>🎓 Department of Computer Engineering</span>
        <span style={{ color: '#6b6d71' }}>•</span>
        <span style={{ color: '#22c55e', fontWeight: '800' }}>⚡ ACES Student Body</span>
        <span style={{ color: '#6b6d71' }}>•</span>
        <span style={{ color: '#f59e0b' }}>⭐ NAAC 'A++' Accredited</span>
      </div>
    </div>
  </div>
);
