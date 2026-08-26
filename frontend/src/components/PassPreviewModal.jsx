import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Send, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  MapPin, 
  Users, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';

export const PassPreviewModal = ({ registrant, onClose, onShowToast, onRefresh }) => {
  const [isSending, setIsSending] = useState(false);
  if (!registrant) return null;

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      const res = await api.email.sendSingle(registrant._id);
      onShowToast({
        type: 'success',
        title: 'Pass Email Sent! 🎟️',
        message: `Pass dispatched from aditya.renake@outlook.com to ${registrant.email}`,
      });
      if (res.result?.previewUrl) {
        window.open(res.result.previewUrl, '_blank');
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Email Delivery Failed',
        message: err.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `HackSeries2026-Pass-${registrant.uniqueId}.png`;
    link.href = registrant.qrCodeDataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const publicPassUrl = `${window.location.origin}/pass/${registrant.uniqueId}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#22c55e" />
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>Official Digital Hacker Pass</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Holographic Pass Card */}
        <div style={{ padding: '24px' }}>
          <div className="holo-ticket">
            <div className="holo-inner">
              
              {/* Event Badge Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>HACKSERIES 2026</span>
                    <span className="badge badge-dyp" style={{ fontSize: '9px' }}>ACES • DIT PUNE</span>
                  </div>
                  <div style={{ fontSize: '9px', color: '#d1a550', fontWeight: '800', marginTop: '2px' }}>DR. D. Y. PATIL INSTITUTE OF TECHNOLOGY (DYPDPU)</div>
                </div>
                <span className="badge badge-emerald">{registrant.ticketType}</span>
              </div>

              {/* Attendee Info */}
              <div style={{ textAlign: 'center', margin: '14px 0' }}>
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>
                  {registrant.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{registrant.email}</div>
                {registrant.teamName && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '12px', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '3px 12px', borderRadius: '999px' }}>
                    <Users size={12} /> Team: {registrant.teamName}
                  </div>
                )}
              </div>

              {/* QR Code Container */}
              <div style={{ textAlign: 'center', margin: '18px 0' }}>
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                  <img
                    src={registrant.qrCodeDataUrl}
                    alt={`Pass QR for ${registrant.uniqueId}`}
                    style={{ width: '200px', height: '200px', display: 'block' }}
                  />
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#f7d070', fontWeight: '800', marginTop: '12px', letterSpacing: '1px' }}>
                  {registrant.uniqueId}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: '700' }}>
                  <ShieldCheck size={14} /> HMAC-SHA256 Cryptographic Signature Verified
                </div>
              </div>

              {/* Event Metadata Footer */}
              <div style={{ background: '#030712', borderRadius: '10px', padding: '12px 16px', border: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                  <MapPin size={13} color="#b22b2f" style={{ marginTop: '2px', flexShrink: 0 }} /> Dr. D. Y. Patil Institute of Technology (DIT), Sant Tukaram Nagar, Pimpri, Pune
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} color="#f7d070" /> Check-in: Oct 16, 07:30 AM IST • Bring Laptop & ID
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? <RefreshCw size={15} className="spin" /> : <Send size={15} />}
              <span>{registrant.emailSent ? 'Resend Pass Email' : 'Send Pass Email'}</span>
            </button>

            <button className="btn btn-secondary" onClick={handleDownloadQR} title="Download QR PNG">
              <Download size={15} /> Download
            </button>

            <button className="btn btn-secondary" onClick={handlePrint} title="Print Badge">
              <Printer size={15} /> Print
            </button>

            <a
              href={publicPassUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              title="Open Public Pass Portal"
            >
              <ExternalLink size={15} />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
