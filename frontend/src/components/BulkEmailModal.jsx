import React, { useState } from 'react';
import { X, Send, AlertCircle, RefreshCw, CheckCircle2, Users, CheckSquare, Mail } from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';

export const BulkEmailModal = ({
  pendingCount,
  totalCount,
  selectedRegistrants = [],
  onClose,
  onShowToast,
  onRefresh,
  onClearSelection,
}) => {
  // Target Mode: 'selected' | 'pending' | 'all'
  const hasSelected = selectedRegistrants && selectedRegistrants.length > 0;
  const [targetMode, setTargetMode] = useState(hasSelected ? 'selected' : 'pending');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(null);

  const getTargetCount = () => {
    if (targetMode === 'selected') return selectedRegistrants.length;
    if (targetMode === 'pending') return pendingCount;
    return totalCount;
  };

  const targetCount = getTargetCount();

  const handleStartBulkSend = async () => {
    if (targetCount === 0) {
      sounds.playWarning();
      onShowToast({
        type: 'info',
        title: 'No Recipients',
        message: 'There are no eligible recipients matching the selected criteria.',
      });
      return;
    }

    try {
      setIsSending(true);
      sounds.playClick();
      setProgress(`Dispatching QR passes via Gmail SMTP (tigeradi1504@gmail.com)...`);

      let payload = {};
      if (targetMode === 'selected') {
        payload.selectedIds = selectedRegistrants.map((r) => r.uniqueId || r._id);
      } else if (targetMode === 'pending') {
        payload.onlyPending = true;
      } else {
        payload.onlyPending = false;
      }

      const response = await api.email.sendBulk(payload);

      sounds.playSuccess();
      onShowToast({
        type: 'success',
        title: 'Bulk Passes Dispatched! 🚀',
        message: `Successfully emailed ${response.results.sent} digital passes from tigeradi1504@gmail.com`,
      });

      if (onClearSelection) onClearSelection();
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      sounds.playError();
      onShowToast({
        type: 'error',
        title: 'Bulk Dispatch Error',
        message: err.message,
      });
    } finally {
      setIsSending(false);
      setProgress(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', border: '1px solid rgba(255, 255, 255, 0.12)' }}
      >
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(6, 182, 212, 0.05) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Send size={18} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>Pass Email Dispatcher</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Send verified QR passes from tigeradi1504@gmail.com</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={isSending} style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Target Audience Selector */}
          <div style={{ background: '#0b0f19', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Select Dispatch Scope:
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '12px', padding: '4px 10px' }}>
                {targetCount} Hackers Targeted
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Option 1: Selected attendees */}
              {hasSelected && (
                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    fontSize: '13px', 
                    cursor: 'pointer',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: targetMode === 'selected' ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                    border: `1px solid ${targetMode === 'selected' ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-subtle)'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="bulkTarget"
                    checked={targetMode === 'selected'}
                    onChange={() => setTargetMode('selected')}
                    disabled={isSending}
                    style={{ accentColor: '#22c55e', width: '16px', height: '16px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckSquare size={14} color="#22c55e" />
                      <span>Only Selected Hackers ({selectedRegistrants.length} selected)</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Sends emails strictly to the individuals you checked in the table
                    </div>
                  </div>
                </label>
              )}

              {/* Option 2: Pending only */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: targetMode === 'pending' ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                  border: `1px solid ${targetMode === 'pending' ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="radio"
                  name="bulkTarget"
                  checked={targetMode === 'pending'}
                  onChange={() => setTargetMode('pending')}
                  disabled={isSending}
                  style={{ accentColor: '#22c55e', width: '16px', height: '16px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', color: '#ffffff' }}>
                    All Unsent / Pending Pass Hackers ({pendingCount} hackers)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Skips hackers who already received their pass to avoid spam
                  </div>
                </div>
              </label>

              {/* Option 3: All registrants */}
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: targetMode === 'all' ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                  border: `1px solid ${targetMode === 'all' ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-subtle)'}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <input
                  type="radio"
                  name="bulkTarget"
                  checked={targetMode === 'all'}
                  onChange={() => setTargetMode('all')}
                  disabled={isSending}
                  style={{ accentColor: '#22c55e', width: '16px', height: '16px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', color: '#ffffff' }}>
                    All Total Registrants ({totalCount} hackers)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Re-sends entry passes to everyone registered
                  </div>
                </div>
              </label>

            </div>
          </div>

          {/* List of Selected Recipients Preview */}
          {targetMode === 'selected' && hasSelected && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>
                Selected Recipients Preview ({selectedRegistrants.length}):
              </div>
              <div style={{ maxHeight: '140px', overflowY: 'auto', background: '#06080e', borderRadius: '10px', border: '1px solid var(--border-subtle)', padding: '8px' }}>
                {selectedRegistrants.map((reg) => (
                  <div key={reg._id || reg.uniqueId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px' }}>
                    <div>
                      <span style={{ fontWeight: '700', color: '#ffffff' }}>{reg.name}</span>
                      <span style={{ color: 'var(--text-dim)', marginLeft: '8px', fontSize: '11px' }}>{reg.email}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#22c55e' }}>{reg.uniqueId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          {isSending && (
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34, 197, 94, 0.08)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)', marginBottom: '20px' }}>
              <RefreshCw size={24} className="spin" color="#22c55e" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#4ade80' }}>{progress}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Please do not close this window while Gmail delivers passes.</div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={isSending}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleStartBulkSend} 
              disabled={isSending || targetCount === 0}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                fontWeight: '800',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Send size={15} /> 
              <span>{isSending ? 'Dispatching...' : `Send Passes to ${targetCount} ${targetMode === 'selected' ? 'Selected' : ''} Hackers`}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
