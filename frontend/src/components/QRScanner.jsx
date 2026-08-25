import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Search, 
  RefreshCw,
  User,
  Users,
  Building2
} from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';

export const QRScanner = ({ onScanComplete, onShowToast }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const html5QrCodeRef = useRef(null);
  const scannerContainerId = 'hackseries-qr-reader';

  // Fetch available cameras
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back camera if available
          const backCam = devices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
          setSelectedCamera(backCam ? backCam.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.warn('Could not enumerate cameras:', err);
      });

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!selectedCamera) {
      onShowToast({ type: 'error', title: 'Camera Error', message: 'No camera device selected or available.' });
      return;
    }

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }

      setIsScanning(true);
      setScanResult(null);

      await html5QrCodeRef.current.start(
        selectedCamera,
        {
          fps: 15,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          // On QR scanned
          if (!isProcessing) {
            handleProcessScan(decodedText);
          }
        },
        (errorMessage) => {
          // Frame parse error (ignore continuous scan ticks)
        }
      );
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setIsScanning(false);
      onShowToast({
        type: 'error',
        title: 'Scanner Failed',
        message: 'Could not access camera. Please check permissions.',
      });
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  // Process Scanned QR or Manual Input
  const handleProcessScan = async (codeString) => {
    if (!codeString || isProcessing) return;
    setIsProcessing(true);

    try {
      const user = api.auth.getUser();
      const staffName = user ? user.name : 'Gate Scanner';

      const response = await api.checkin.scan({
        qrPayload: codeString,
        scannedBy: staffName,
      });

      if (response.status === 'SUCCESS') {
        sounds.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#22c55e', '#06b6d4', '#4ade80'],
        });
        setScanResult({
          type: 'success',
          title: 'ACCESS GRANTED ✅',
          message: response.message,
          attendee: response.registrant,
        });
      } else if (response.status === 'ALREADY_CHECKED_IN') {
        sounds.playWarning();
        setScanResult({
          type: 'warning',
          title: 'ALREADY CHECKED IN ⚠️',
          message: response.message,
          attendee: response.registrant,
          checkedInAt: response.checkedInAt,
          checkedInBy: response.checkedInBy,
        });
      }

      if (onScanComplete) onScanComplete(response);
    } catch (err) {
      sounds.playError();
      const isForged = err.message.toLowerCase().includes('forger') || err.message.toLowerCase().includes('signature');
      setScanResult({
        type: 'error',
        isForged,
        title: isForged ? '🚫 SECURITY ALERT: FORGED QR CODE' : 'INVALID PASS ❌',
        message: err.message || 'Pass ID not found in HackSeries database.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleProcessScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      
      {/* Top Banner Anti-Forgery Verification */}
      <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '12px', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="#22c55e" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#22c55e', letterSpacing: '0.5px' }}>ZERO-FORGERY QR VERIFICATION ACTIVE</div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>HMAC-SHA256 Cryptographic Pass Integrity Engine</div>
          </div>
        </div>
        <span className="badge badge-emerald">GATE READY</span>
      </div>

      {/* Camera Selection & Controls */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <select
            className="input-control select-control"
            style={{ flex: 1, minWidth: '200px' }}
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            disabled={isScanning}
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                📷 {c.label || `Camera ${c.id}`}
              </option>
            ))}
          </select>

          {isScanning ? (
            <button className="btn btn-danger" onClick={stopScanner}>
              <CameraOff size={16} /> Stop Camera
            </button>
          ) : (
            <button className="btn btn-primary" onClick={startScanner}>
              <Camera size={16} /> Start Camera Scanner
            </button>
          )}
        </div>

        {/* Viewfinder with Laser */}
        <div className="scanner-viewport" style={{ minHeight: isScanning ? '320px' : '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div id={scannerContainerId} style={{ width: '100%' }}></div>
          
          {isScanning && <div className="scanner-laser"></div>}

          {!isScanning && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)' }}>
              <Camera size={44} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Camera Viewfinder Standby</div>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Click "Start Camera Scanner" or use manual ID entry below</p>
            </div>
          )}
        </div>

        {/* Manual ID Input Fallback */}
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <input
            type="text"
            className="input-control"
            placeholder="Type Pass ID (e.g. HS26-8A3F1B) or Attendee Email..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)' }}
          />
          <button type="submit" className="btn btn-cyan" disabled={!manualCode.trim() || isProcessing}>
            <Search size={15} /> Check In
          </button>
        </form>
      </div>

      {/* Real-time Scan Result Pop-up Card */}
      {scanResult && (
        <div
          className="glass-card"
          style={{
            padding: '24px',
            border: `2px solid ${
              scanResult.type === 'success'
                ? '#22c55e'
                : scanResult.type === 'warning'
                ? '#f59e0b'
                : '#ef4444'
            }`,
            background:
              scanResult.type === 'success'
                ? 'rgba(34, 197, 94, 0.08)'
                : scanResult.type === 'warning'
                ? 'rgba(245, 158, 11, 0.08)'
                : 'rgba(239, 68, 68, 0.08)',
            marginBottom: '24px',
            animation: 'scaleUp 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            {scanResult.type === 'success' && <CheckCircle2 size={32} color="#22c55e" />}
            {scanResult.type === 'warning' && <AlertTriangle size={32} color="#f59e0b" />}
            {scanResult.type === 'error' && (scanResult.isForged ? <ShieldAlert size={32} color="#ef4444" /> : <AlertTriangle size={32} color="#ef4444" />)}

            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '900',
                  color:
                    scanResult.type === 'success'
                      ? '#22c55e'
                      : scanResult.type === 'warning'
                      ? '#f59e0b'
                      : '#ef4444',
                }}
              >
                {scanResult.title}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{scanResult.message}</div>
            </div>
          </div>

          {scanResult.attendee && (
            <div style={{ background: '#0b0f19', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                    {scanResult.attendee.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{scanResult.attendee.email}</div>
                  {scanResult.attendee.phone && <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{scanResult.attendee.phone}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-emerald">{scanResult.attendee.ticketType}</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#22c55e', fontWeight: '700', marginTop: '4px' }}>
                    {scanResult.attendee.uniqueId}
                  </div>
                </div>
              </div>

              {(scanResult.attendee.teamName || scanResult.attendee.track) && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '12px' }}>
                  {scanResult.attendee.teamName && (
                    <div style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} /> Team: <strong>{scanResult.attendee.teamName}</strong>
                    </div>
                  )}
                  {scanResult.attendee.track && (
                    <div style={{ color: 'var(--text-muted)' }}>
                      Track: <strong>{scanResult.attendee.track}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
