import React, { useState } from 'react';
import { X, Send, AlertCircle, RefreshCw, CheckCircle2, Users } from 'lucide-react';
import { api } from '../services/api';

export const BulkEmailModal = ({ pendingCount, totalCount, onClose, onShowToast, onRefresh }) => {
  const [onlyPending, setOnlyPending] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(null);

  const targetCount = onlyPending ? pendingCount : totalCount;

  const handleStartBulkSend = async () => {
    if (targetCount === 0) {
      onShowToast({
        type: 'info',
        title: 'No Recipients',
        message: 'There are no eligible recipients matching the selected criteria.',
      });
      return;
    }

    try {
      setIsSending(true);
      setProgress('Dispatching passes in parallel batches via Outlook SMTP...');

      const response = await api.email.sendBulk({ onlyPending });

      onShowToast({
        type: 'success',
        title: 'Bulk Dispatch Finished! 🚀',
        message: `Successfully emailed ${response.results.sent} passes from aditya.renake@outlook.com`,
      });

      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="#22c55e" />
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>Bulk Pass Email Distribution</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={isSending}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Send verified QR code passes directly to attendee inboxes registered via Google Forms.
          </p>

          <div style={{ background: '#0b0f19', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target Recipients:</span>
              <strong style={{ fontSize: '14px', color: '#22c55e' }}>{targetCount} Hackers</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="bulkTarget"
                  checked={onlyPending}
                  onChange={() => setOnlyPending(true)}
                  disabled={isSending}
                />
                <span>Only Pending ({pendingCount} hackers with un-sent passes)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="bulkTarget"
                  checked={!onlyPending}
                  onChange={() => setOnlyPending(false)}
                  disabled={isSending}
                />
                <span>All Registrants ({totalCount} total hackers)</span>
              </label>
            </div>
          </div>

          {isSending && (
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: '20px' }}>
              <RefreshCw size={24} className="spin" color="#22c55e" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e' }}>{progress}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Please keep this tab open while emails are processed.</div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={isSending}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleStartBulkSend} disabled={isSending || targetCount === 0}>
              <Send size={15} /> {isSending ? 'Sending...' : `Send Passes to ${targetCount} Hackers`}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
