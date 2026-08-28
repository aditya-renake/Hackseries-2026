import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Mail, 
  Percent, 
  Search, 
  Filter, 
  RefreshCw, 
  FileSpreadsheet, 
  Send, 
  Sliders, 
  Download,
  Zap,
  ShieldCheck,
  QrCode,
  CheckSquare,
  Crown
} from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { RegistrantTable } from '../components/RegistrantTable';
import { PassPreviewModal } from '../components/PassPreviewModal';
import { WebhookGuideModal } from '../components/WebhookGuideModal';
import { EmailTemplateModal } from '../components/EmailTemplateModal';
import { BulkEmailModal } from '../components/BulkEmailModal';
import { SuperAdminModal } from '../components/SuperAdminModal';
import { sounds } from '../utils/soundEffects';

export const DashboardPage = ({ onShowToast, onNavigateToScanner }) => {
  const [registrants, setRegistrants] = useState([]);
  const [stats, setStats] = useState({
    totalRegistrants: 0,
    checkedInCount: 0,
    checkedInPercentage: 0,
    emailSentCount: 0,
    pendingEmailCount: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    totalItems: 0,
    totalPages: 1,
  });

  // Selected Attendees for Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [checkedInFilter, setCheckedInFilter] = useState('');
  const [emailSentFilter, setEmailSentFilter] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');
  const [ticketFilter, setTicketFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Modals
  const [selectedPassRegistrant, setSelectedPassRegistrant] = useState(null);
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
  const [eventConfig, setEventConfig] = useState(null);

  // Fetch Data
  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        search,
        checkedIn: checkedInFilter,
        emailSent: emailSentFilter,
        track: trackFilter,
        ticketType: ticketFilter,
      };

      const response = await api.registrants.list(params);
      setRegistrants(response.data || []);
      setPagination(response.pagination || {});
      setStats(response.stats || {});
    } catch (err) {
      onShowToast({
        type: 'error',
        title: 'Data Fetch Error',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, search, checkedInFilter, emailSentFilter, trackFilter, ticketFilter, onShowToast]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Load Event Config
  useEffect(() => {
    api.event.getConfig().then((res) => setEventConfig(res.data)).catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  const handleExportCSV = () => {
    sounds.playClick();
    window.location.href = api.registrants.exportCSVUrl();
  };

  // Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = (visibleIds) => {
    setSelectedIds((prev) => {
      const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => prev.includes(id));
      if (isAllSelected) {
        return prev.filter((id) => !visibleIds.includes(id));
      }
      return Array.from(new Set([...prev, ...visibleIds]));
    });
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Compute selected registrant objects
  const selectedRegistrantsList = registrants.filter((r) =>
    selectedIds.includes(r.uniqueId || r._id)
  );

  const currentUser = api.auth.getUser();
  const username = currentUser?.username?.toLowerCase() || '';
  const email = currentUser?.email?.toLowerCase() || '';
  const name = currentUser?.name || '';
  const isLeadOperations = username === 'adityarenake' || email === 'tigeradi1504@gmail.com' || name.toLowerCase().includes('aditya');
  
  let adminDisplayName = name;
  let roleTitle = 'OPERATIONS ADMIN';
  if (isLeadOperations) {
    adminDisplayName = 'Aditya Renake';
    roleTitle = 'LEAD OPERATIONS • SUPER ADMIN';
  } else if (username === 'sohamchitnis' || name.toLowerCase().includes('soham')) {
    adminDisplayName = 'Soham Chitnis';
    roleTitle = 'OPERATIONS ADMIN';
  } else if (username === 'haritirawal' || name.toLowerCase().includes('hariti')) {
    adminDisplayName = 'Hariti Rawal';
    roleTitle = 'OPERATIONS ADMIN';
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      
      {/* Header Title & Top Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' }}>Operations Control Room</h1>
            <span className="badge badge-emerald">HACKSERIES 2026</span>
            <span className="badge badge-dyp">ACES • DIT PUNE</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Live Google Forms Sync • Dr. D. Y. Patil Institute of Technology (DYPDPU) • Express Gate Check-In (2000+ Scale)
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {onNavigateToScanner && (
            <button className="btn btn-cyan btn-sm" onClick={onNavigateToScanner}>
              <QrCode size={14} /> Open Gate Scanner
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={() => setShowWebhookGuide(true)}>
            <FileSpreadsheet size={15} color="#22c55e" /> Google Sheet Webhook Script
          </button>

          {/* Bulk Email button with selected counter badge */}
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => {
              sounds.playClick();
              setShowBulkEmail(true);
            }}
            style={{
              background: selectedIds.length > 0 ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={14} /> 
            <span>{selectedIds.length > 0 ? `Email Selected (${selectedIds.length})` : 'Bulk Email Passes'}</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={() => setShowEmailTemplate(true)}>
            <Sliders size={14} /> Email Template
          </button>

          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>

          <button className="btn btn-ghost btn-sm" onClick={() => fetchData(pagination.page)} title="Refresh Data">
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Personalized Admin Greeting Banner with Special Access Button */}
      <div style={{
        background: isLeadOperations 
          ? 'linear-gradient(90deg, rgba(209, 165, 80, 0.14) 0%, rgba(178, 43, 47, 0.1) 50%, rgba(6, 8, 14, 0.85) 100%)' 
          : 'linear-gradient(90deg, rgba(34, 211, 238, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: isLeadOperations ? '1px solid rgba(209, 165, 80, 0.4)' : '1px solid rgba(34, 211, 238, 0.25)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: isLeadOperations ? '0 8px 30px rgba(209, 165, 80, 0.15)' : '0 6px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isLeadOperations 
              ? 'linear-gradient(135deg, #f7d070 0%, #d1a550 100%)' 
              : 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: isLeadOperations ? '0 0 16px rgba(247, 208, 112, 0.5)' : '0 0 12px rgba(34, 197, 94, 0.4)'
          }}>
            {isLeadOperations ? <Crown size={22} strokeWidth={2.5} /> : <ShieldCheck size={22} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff' }}>
                Welcome back, {adminDisplayName}! 👋
              </span>
              <span className={isLeadOperations ? 'badge badge-gold' : 'badge badge-cyan'} style={{ fontSize: '10px', padding: '3px 8px' }}>
                {roleTitle}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isLeadOperations 
                ? '⚡ Lead Operations Sovereign Access • Live Broadcasts, Instant VIP Pass Issuer & Full Backup' 
                : '🛡️ Operations Admin Console • Attendee Gate Check-In & Verification Authority'}
            </div>
          </div>
        </div>

        {/* Special Access button for Lead Operations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={isLeadOperations ? 'btn btn-gold btn-sm' : 'btn btn-secondary btn-sm'}
            onClick={() => {
              sounds.playClick();
              setShowSuperAdminModal(true);
            }}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isLeadOperations ? '0 0 14px rgba(209, 165, 80, 0.4)' : undefined
            }}
          >
            <Crown size={14} />
            <span>{isLeadOperations ? '👑 Special Access Command' : '👑 Operations Tools'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard
          title="Total Registrations"
          value={stats.totalRegistrants}
          subtitle="Real-time Google Form intake"
          icon={Users}
          color="emerald"
        />

        <StatCard
          title="Gate Checked-In"
          value={`${stats.checkedInCount} / ${stats.totalRegistrants}`}
          subtitle={`${stats.checkedInPercentage}% of total attendance verified`}
          icon={CheckCircle2}
          color="cyan"
          progress={stats.checkedInPercentage}
        />

        <StatCard
          title="Passes Dispatched"
          value={stats.emailSentCount}
          subtitle="Sent via tigeradi1504@gmail.com"
          icon={Mail}
          color="violet"
        />

        <StatCard
          title="Pending Pass Delivery"
          value={stats.pendingEmailCount}
          subtitle="Hackers awaiting QR email pass"
          icon={Zap}
          color="amber"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="input-control"
              placeholder="Search Name, Email, Phone, Pass ID (e.g. HS26-), Team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
            <Search size={16} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Check-in filter */}
          <select
            className="input-control select-control"
            style={{ width: '160px' }}
            value={checkedInFilter}
            onChange={(e) => setCheckedInFilter(e.target.value)}
          >
            <option value="">Check-in: All</option>
            <option value="true">Checked In Only</option>
            <option value="false">Pending Gate Only</option>
          </select>

          {/* Email sent filter */}
          <select
            className="input-control select-control"
            style={{ width: '160px' }}
            value={emailSentFilter}
            onChange={(e) => setEmailSentFilter(e.target.value)}
          >
            <option value="">Email: All</option>
            <option value="true">Pass Emailed</option>
            <option value="false">Unsent Only</option>
          </select>

          {/* Track filter */}
          <select
            className="input-control select-control"
            style={{ width: '180px' }}
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
          >
            <option value="all">Track: All</option>
            <option value="AI & Agentic Systems">AI & Agentic Systems</option>
            <option value="Cybersecurity & Privacy">Cybersecurity & Privacy</option>
            <option value="Web3 & Decentralized">Web3 & Decentralized</option>
            <option value="Fintech & Open Finance">Fintech & Open Finance</option>
            <option value="Open Innovation">Open Innovation</option>
          </select>

          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '10px 16px' }}>
            <Filter size={14} /> Filter
          </button>
        </form>
      </div>

      {/* Registrant Data Table with Selection Controls */}
      <RegistrantTable
        registrants={registrants}
        pagination={pagination}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAllVisible={handleSelectAllVisible}
        onClearSelection={handleClearSelection}
        onOpenBulkEmail={() => setShowBulkEmail(true)}
        onPageChange={(p) => fetchData(p)}
        onRefresh={() => fetchData(pagination.page)}
        onViewPass={(reg) => setSelectedPassRegistrant(reg)}
        onShowToast={onShowToast}
      />

      {/* Modals */}
      {selectedPassRegistrant && (
        <PassPreviewModal
          registrant={selectedPassRegistrant}
          onClose={() => setSelectedPassRegistrant(null)}
          onShowToast={onShowToast}
          onRefresh={() => fetchData(pagination.page)}
        />
      )}

      {showWebhookGuide && (
        <WebhookGuideModal
          onClose={() => setShowWebhookGuide(false)}
          onShowToast={onShowToast}
          onRefresh={() => fetchData(pagination.page)}
        />
      )}

      {showEmailTemplate && (
        <EmailTemplateModal
          config={eventConfig}
          onClose={() => setShowEmailTemplate(false)}
          onShowToast={onShowToast}
          onSaveConfig={() => api.event.getConfig().then((res) => setEventConfig(res.data))}
        />
      )}

      {showBulkEmail && (
        <BulkEmailModal
          pendingCount={stats.pendingEmailCount}
          totalCount={stats.totalRegistrants}
          selectedRegistrants={selectedRegistrantsList}
          onClose={() => setShowBulkEmail(false)}
          onShowToast={onShowToast}
          onRefresh={() => fetchData(pagination.page)}
          onClearSelection={handleClearSelection}
        />
      )}

      {showSuperAdminModal && (
        <SuperAdminModal
          currentUser={currentUser}
          eventConfig={eventConfig}
          onClose={() => setShowSuperAdminModal(false)}
          onShowToast={onShowToast}
          onRefreshData={() => {
            fetchData(pagination.page);
            api.event.getConfig().then((res) => setEventConfig(res.data)).catch(() => {});
          }}
        />
      )}

    </div>
  );
};
