import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  ShieldAlert, 
  Radio, 
  UserPlus, 
  Download, 
  Cpu, 
  Check, 
  Save, 
  Zap, 
  Sparkles,
  Server,
  Lock,
  Mail
} from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';

export const SuperAdminModal = ({ 
  currentUser, 
  eventConfig, 
  onClose, 
  onShowToast, 
  onRefreshData 
}) => {
  const [activeTab, setActiveTab] = useState('broadcast');
  const [broadcastText, setBroadcastText] = useState(eventConfig?.broadcastNotice || '');
  const [broadcastActive, setBroadcastActive] = useState(eventConfig?.broadcastActive || false);
  const [isSavingBroadcast, setIsSavingBroadcast] = useState(false);

  // VIP Pass Generator state
  const [vipName, setVipName] = useState('');
  const [vipEmail, setVipEmail] = useState('');
  const [vipRole, setVipRole] = useState('VIP Guest');
  const [vipTeam, setVipTeam] = useState('Special Invitee');
  const [vipTrack, setVipTrack] = useState('AI & Web3 Innovation');
  const [isGeneratingVip, setIsGeneratingVip] = useState(false);
  const [generatedVipPass, setGeneratedVipPass] = useState(null);

  // 1. Save Broadcast Notice to All Digital Passes
  const handleSaveBroadcast = async (e) => {
    e.preventDefault();
    try {
      setIsSavingBroadcast(true);
      await api.event.updateConfig({
        broadcastNotice: broadcastText,
        broadcastActive: broadcastActive,
      });
      sounds.playSuccess();
      onShowToast({
        type: 'success',
        title: 'Broadcast Synchronized 📡',
        message: broadcastActive
          ? 'Urgent announcement is now live across all attendee digital passes!'
          : 'Live pass broadcast has been deactivated.',
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      sounds.playError();
      onShowToast({
        type: 'error',
        title: 'Broadcast Error',
        message: err.message,
      });
    } finally {
      setIsSavingBroadcast(false);
    }
  };

  // 2. Generate Instant VIP / Judge Pass
  const handleGenerateVip = async (e) => {
    e.preventDefault();
    if (!vipName || !vipEmail) return;

    try {
      setIsGeneratingVip(true);
      const res = await api.registrants.create({
        name: vipName,
        email: vipEmail,
        ticketType: vipRole,
        teamName: vipTeam,
        track: vipTrack,
        institution: 'Dr. D. Y. Patil Institute of Technology (DYPDPU)',
      });

      sounds.playSuccess();
      setGeneratedVipPass(res.data);
      onShowToast({
        type: 'success',
        title: 'VIP Pass Generated! 👑',
        message: `Cryptographically signed entry pass created for ${vipName} (${res.data.uniqueId})`,
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      sounds.playError();
      onShowToast({
        type: 'error',
        title: 'Generation Failed',
        message: err.message,
      });
    } finally {
      setIsGeneratingVip(false);
    }
  };

  // 3. Export Full System Backup JSON
  const handleFullBackup = async () => {
    try {
      sounds.playClick();
      const allData = await api.registrants.list({ limit: 5000 });
      const backupObj = {
        exportedAt: new Date().toISOString(),
        exportedBy: currentUser?.name || 'Aditya Renake',
        leadOperations: 'Aditya Renake',
        stats: allData.stats,
        totalItems: allData.data?.length || 0,
        registrants: allData.data || [],
        config: eventConfig,
      };

      const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HackSeries2026_Full_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      onShowToast({
        type: 'success',
        title: 'Backup Downloaded 💾',
        message: 'Full system snapshot downloaded securely to your local machine.',
      });
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Backup Failed',
        message: err.message,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '820px', 
          border: '2px solid rgba(34, 211, 238, 0.4)', 
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.7), 0 0 30px rgba(34, 211, 238, 0.2)',
          background: 'linear-gradient(145deg, #090d18 0%, #03060f 100%)'
        }}
      >
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', borderBottom: '1px solid rgba(34, 211, 238, 0.2)', background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.12) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030712', boxShadow: '0 0 14px rgba(34, 197, 94, 0.4)' }}>
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>Operations Command Center</span>
                <span className="badge badge-cyan" style={{ fontSize: '10px' }}>ADMIN TOOLS</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Active Operator: <strong style={{ color: '#22d3ee' }}>{currentUser?.name || 'Operations Admin'}</strong>
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '10px', padding: '14px 26px', borderBottom: '1px solid var(--border-subtle)', background: '#070a13' }}>
          <button
            className={`btn btn-sm ${activeTab === 'broadcast' ? 'btn-gold' : 'btn-ghost'}`}
            onClick={() => setActiveTab('broadcast')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Radio size={14} /> Live Pass Broadcast
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'vip' ? 'btn-gold' : 'btn-ghost'}`}
            onClick={() => setActiveTab('vip')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={14} /> Issue Instant VIP Pass
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'backup' ? 'btn-gold' : 'btn-ghost'}`}
            onClick={() => setActiveTab('backup')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Full System Backup
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'diagnostics' ? 'btn-gold' : 'btn-ghost'}`}
            onClick={() => setActiveTab('diagnostics')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Cpu size={14} /> Security & System Diagnostics
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '26px' }}>

          {/* TAB 1: Live Broadcast Notice to All Digital Passes */}
          {activeTab === 'broadcast' && (
            <form onSubmit={handleSaveBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(209, 165, 80, 0.08)', border: '1px solid rgba(209, 165, 80, 0.3)', borderRadius: '12px', padding: '16px', fontSize: '13px', color: '#f7d070' }}>
                <div style={{ fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={15} /> Real-Time Pass Broadcast Network
                </div>
                Broadcast text entered here will immediately appear as a dynamic glowing announcement banner at the top of <strong>every attendee's holographic digital pass</strong> when they open it!
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <span>Broadcast Message</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', textTransform: 'none', color: broadcastActive ? '#4ade80' : '#9ca3af' }}>
                    <input
                      type="checkbox"
                      checked={broadcastActive}
                      onChange={(e) => setBroadcastActive(e.target.checked)}
                      style={{ accentColor: '#22c55e', width: '15px', height: '15px' }}
                    />
                    <span>{broadcastActive ? '● Broadcast is LIVE' : '○ Broadcast Paused'}</span>
                  </label>
                </label>
                <textarea
                  className="input-control"
                  rows={3}
                  placeholder="e.g. 📢 Hacking has officially begun! Mentors are stationed at Lab 4. Dinner opens at 8:30 PM."
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold" disabled={isSavingBroadcast}>
                  <Save size={15} /> {isSavingBroadcast ? 'Transmitting...' : 'Save & Broadcast Live'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Instant VIP / Guest Pass Generator */}
          {activeTab === 'vip' && (
            <div>
              <form onSubmit={handleGenerateVip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34, 211, 238, 0.3)', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#22d3ee' }}>
                  <div style={{ fontWeight: '800', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} /> On-The-Fly Pass Generation
                  </div>
                  Instantly issue a signed VIP, Judge, Guest, or Special Invitee pass on the spot with zero delay.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input-control"
                      placeholder="Dr. Rajesh Patil"
                      value={vipName}
                      onChange={(e) => setVipName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input-control"
                      placeholder="vip.guest@dypvp.edu.in"
                      value={vipEmail}
                      onChange={(e) => setVipEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Pass Tier
                    </label>
                    <select
                      className="input-control"
                      value={vipRole}
                      onChange={(e) => setVipRole(e.target.value)}
                    >
                      <option value="VIP Guest">VIP Guest</option>
                      <option value="Judge / Mentor">Judge / Mentor</option>
                      <option value="Keynote Speaker">Keynote Speaker</option>
                      <option value="Core Organizer">Core Organizer</option>
                      <option value="Hacker Pass">Hacker Pass</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Track / Category
                    </label>
                    <input
                      type="text"
                      className="input-control"
                      value={vipTrack}
                      onChange={(e) => setVipTrack(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '12px', marginTop: '6px' }} disabled={isGeneratingVip}>
                  {isGeneratingVip ? 'Generating Signed Pass...' : '👑 Generate & Issue Cryptographic Pass'}
                </button>
              </form>

              {/* Success output card */}
              {generatedVipPass && (
                <div style={{ marginTop: '20px', background: '#050811', padding: '16px', borderRadius: '12px', border: '1px solid #22c55e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: '800' }}>✅ VIP PASS CREATED & SIGNED</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{generatedVipPass.name}</div>
                    <div style={{ fontSize: '13px', color: '#f7d070', fontFamily: 'var(--font-mono)' }}>Pass ID: {generatedVipPass.uniqueId}</div>
                  </div>
                  <a
                    href={`/pass/${generatedVipPass.uniqueId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-cyan btn-sm"
                  >
                    View Holographic Pass ↗
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Full System Backup */}
          {activeTab === 'backup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={18} color="#22c55e" /> Full Google Cloud Firestore Snapshot
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.6' }}>
                  As Lead Operations, you can download a complete offline JSON snapshot containing all registered hackers, verified cryptographic check-in logs, gate photos, email delivery histories, and system configuration.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <button className="btn btn-primary" onClick={handleFullBackup} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
                    <Download size={16} /> Download Full System JSON Backup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Diagnostics */}
          {activeTab === 'diagnostics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#090d18', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4ade80', fontWeight: '800' }}>
                    <Server size={13} /> CLOUD DATABASE
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>Google Cloud Firestore</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Project: hackseries-2026 (Live)</div>
                </div>

                <div style={{ background: '#090d18', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#22d3ee', fontWeight: '800' }}>
                    <Mail size={13} /> SMTP DISPATCH ENGINE
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>Gmail SMTP TLS</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>tigeradi1504@gmail.com</div>
                </div>

                <div style={{ background: '#090d18', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f7d070', fontWeight: '800' }}>
                    <Lock size={13} /> SECURITY AUTHORITY
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>HMAC-SHA256 Token</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Zero-Forgery Gate Protection</div>
                </div>
              </div>

              <div style={{ background: '#060913', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#9ca3af' }}>
                <div style={{ color: '#f7d070', fontWeight: '700', marginBottom: '8px' }}>⚡ OPERATOR CREDENTIALS VERIFICATION</div>
                <div>• Active Session Operator: <strong style={{ color: '#fff' }}>{currentUser?.name || 'Aditya Renake'}</strong></div>
                <div>• Username: <strong style={{ color: '#fff' }}>{currentUser?.username || 'adityarenake'}</strong></div>
                <div>• Assigned Security Clearance: <strong style={{ color: '#22c55e' }}>LEVEL 0 — LEAD OPERATIONS SOVEREIGN</strong></div>
                <div>• Gate Scanner Camera Module: <strong style={{ color: '#22d3ee' }}>HTML5-QRCode + Frame Capture Active</strong></div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
