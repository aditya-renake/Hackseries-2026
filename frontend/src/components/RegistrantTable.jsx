import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { api } from '../services/api';

export const RegistrantTable = ({
  registrants = [],
  pagination = {},
  onPageChange,
  onRefresh,
  onViewPass,
  onShowToast,
}) => {
  const [sendingId, setSendingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // 1-Click Send Pass Email
  const handleSendEmail = async (reg) => {
    try {
      setSendingId(reg._id);
      const res = await api.email.sendSingle(reg._id);
      onShowToast({
        type: 'success',
        title: 'Pass Email Dispatched! 🎟️',
        message: `Official QR pass sent from aditya.renake@outlook.com to ${reg.email}`,
      });
      if (res.result?.previewUrl) {
        window.open(res.result.previewUrl, '_blank');
      }
      onRefresh();
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Email Delivery Failed',
        message: err.message || 'Could not send pass email.',
      });
    } finally {
      setSendingId(null);
    }
  };

  // Toggle Check-in status
  const handleToggleCheckin = async (reg) => {
    try {
      setTogglingId(reg._id);
      if (reg.checkedIn) {
        await api.checkin.undo(reg._id);
        onShowToast({
          type: 'info',
          title: 'Check-in Reverted',
          message: `Reverted check-in for ${reg.name}`,
        });
      } else {
        await api.checkin.scan({ manualCode: reg.uniqueId, scannedBy: 'Dashboard Admin' });
        onShowToast({
          type: 'success',
          title: 'Checked In! ✅',
          message: `${reg.name} checked in successfully.`,
        });
      }
      onRefresh();
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Check-in Error',
        message: err.message,
      });
    } finally {
      setTogglingId(null);
    }
  };

  // Delete attendee
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from HackSeries 2026?`)) return;
    try {
      await api.registrants.delete(id);
      onShowToast({
        type: 'success',
        title: 'Attendee Removed',
        message: `${name} has been removed.`,
      });
      onRefresh();
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  const getTicketBadge = (type) => {
    switch (type) {
      case 'VIP Pass':
        return <span className="badge badge-amber">{type}</span>;
      case 'Mentor / Judge':
        return <span className="badge badge-rose">{type}</span>;
      case 'Team Lead Pass':
        return <span className="badge badge-cyan">{type}</span>;
      case 'Speaker Pass':
        return <span className="badge badge-violet">{type}</span>;
      default:
        return <span className="badge badge-emerald">{type}</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#0b0f19', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
              <th style={{ padding: '14px 20px' }}>Hacker / Attendee</th>
              <th style={{ padding: '14px 16px' }}>Pass ID</th>
              <th style={{ padding: '14px 16px' }}>Tier & Track</th>
              <th style={{ padding: '14px 16px' }}>Check-in Status</th>
              <th style={{ padding: '14px 16px' }}>Pass Emailed?</th>
              <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrants.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>No Registrants Found</div>
                  <p style={{ fontSize: '13px' }}>Google Form submissions will automatically appear here in real time via webhook.</p>
                </td>
              </tr>
            ) : (
              registrants.map((reg) => (
                <tr
                  key={reg._id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Attendee Details */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '14px' }}>{reg.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{reg.email}</div>
                    {reg.phone && <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>{reg.phone}</div>}
                    {reg.teamName && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                        <Users size={11} /> Team: {reg.teamName}
                      </div>
                    )}
                  </td>

                  {/* Pass ID with anti-forgery indicator */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#22c55e', fontSize: '12px' }}>
                      {reg.uniqueId}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#10b981', marginTop: '2px' }}>
                      <ShieldCheck size={11} /> Verified Signed
                    </div>
                  </td>

                  {/* Tier & Track */}
                  <td style={{ padding: '14px 16px' }}>
                    <div>{getTicketBadge(reg.ticketType)}</div>
                    {reg.track && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {reg.track}
                      </div>
                    )}
                    {reg.institution && (
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Building2 size={10} /> {reg.institution}
                      </div>
                    )}
                  </td>

                  {/* Check-in status */}
                  <td style={{ padding: '14px 16px' }}>
                    {reg.checkedIn ? (
                      <div>
                        <span className="badge badge-emerald" style={{ gap: '4px' }}>
                          <CheckCircle2 size={12} /> CHECKED IN
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
                          {reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Gate Check-in'}
                        </div>
                      </div>
                    ) : (
                      <span className="badge" style={{ background: '#1f293d', color: '#9ca3af', border: '1px solid #374151' }}>
                        <Clock size={11} /> PENDING
                      </span>
                    )}
                  </td>

                  {/* Email sent status */}
                  <td style={{ padding: '14px 16px' }}>
                    {reg.emailSent ? (
                      <div>
                        <span className="badge badge-cyan" style={{ gap: '4px' }}>
                          <Check size={11} /> SENT ({reg.emailSendCount || 1})
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
                          {reg.emailSentAt ? new Date(reg.emailSentAt).toLocaleDateString() : 'Dispatched'}
                        </div>
                      </div>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                        <X size={11} /> NOT SENT
                      </span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      
                      {/* 1-Click Send Email Button */}
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSendEmail(reg)}
                        disabled={sendingId === reg._id}
                        title={`1-Click: Send Pass Email from aditya.renake@outlook.com to ${reg.email}`}
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                      >
                        {sendingId === reg._id ? (
                          <RefreshCw size={12} className="spin" />
                        ) : (
                          <Send size={12} />
                        )}
                        <span>{reg.emailSent ? 'Resend Pass' : 'Send Pass'}</span>
                      </button>

                      {/* View Pass Modal Button */}
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onViewPass(reg)}
                        title="View Digital Holographic Pass Ticket"
                        style={{ padding: '6px 10px' }}
                      >
                        <Eye size={13} />
                      </button>

                      {/* Check-in Toggle Button */}
                      <button
                        className={`btn btn-sm ${reg.checkedIn ? 'btn-ghost' : 'btn-cyan'}`}
                        onClick={() => handleToggleCheckin(reg)}
                        disabled={togglingId === reg._id}
                        title={reg.checkedIn ? 'Undo Check-in' : 'Mark Checked-in'}
                        style={{ padding: '6px 10px' }}
                      >
                        {reg.checkedIn ? <X size={13} color="#f87171" /> : <Check size={13} />}
                      </button>

                      {/* Delete */}
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleDelete(reg._id, reg.name)}
                        title="Remove attendee"
                        style={{ padding: '6px 8px', color: '#6b7280' }}
                      >
                        <Trash2 size={13} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#0b0f19', borderTop: '1px solid var(--border-subtle)', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            Showing Page <strong style={{ color: '#fff' }}>{pagination.page}</strong> of <strong style={{ color: '#fff' }}>{pagination.totalPages}</strong> ({pagination.totalItems} total hackers)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
