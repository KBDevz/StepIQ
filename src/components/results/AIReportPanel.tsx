import { useState, useEffect, useRef } from 'react';
import type { AIReport, ClassificationResult } from '../../types';
import FormCard from '../ui/FormCard';

interface AIReportPanelProps {
  report: AIReport;
  vo2Max: number;
  classification: ClassificationResult;
  hasSubmittedContact: boolean;
  onContactSubmit: (data: { firstName: string; lastName: string; email: string; phone: string; smsOptIn: boolean }) => void;
  defaultFirstName?: string;
  defaultLastName?: string;
}

/* ── Report Gate Card ── */
function ReportGateCard({
  onSubmit,
  defaultFirstName,
  defaultLastName,
}: {
  onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string; smsOptIn: boolean }) => void;
  defaultFirstName?: string;
  defaultLastName?: string;
}) {
  const [firstName, setFirstName] = useState(defaultFirstName || '');
  const [lastName, setLastName] = useState(defaultLastName || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email';
    if (smsOptIn && !phone.trim()) errs.phone = 'Please add a mobile number to enable reminders';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ firstName, lastName, email, phone, smsOptIn });
    }
  };

  const inputStyle = (field?: string): React.CSSProperties => ({
    width: '100%',
    background: 'rgba(6,12,24,0.8)',
    border: `1px solid ${errors[field || ''] ? '#FF4444' : '#1C2F4A'}`,
    borderRadius: '10px',
    padding: '13px 16px',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.85rem',
    color: '#EEF2FF',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  return (
    <div className="report-gate-card" style={{
      background: 'linear-gradient(145deg, #0D2238 0%, #0D1829 100%)',
      border: '1px solid rgba(0,229,160,0.3)',
      borderRadius: '16px',
      padding: '28px 24px',
      boxShadow: '0 0 40px rgba(0,229,160,0.08)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, #00E5A0, transparent)', borderRadius: '2px 2px 0 0' }} />

      {/* Lock icon */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Headline */}
      <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '8px' }}>
        Unlock Your Full Report
      </h3>

      {/* Subtext */}
      <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', textAlign: 'center', lineHeight: 1.7, marginBottom: '20px' }}>
        Your 8-week training protocol and next VO2 target are ready. Enter your details to access the complete report — free.
      </p>

      {/* Locked items */}
      <div style={{ marginBottom: '20px' }}>
        {[
          '8-Week Cardiovascular Training Protocol',
          'Personalized Weekly Exercise Prescription',
          'Your Next VO2 Target + Timeline',
        ].map((item) => (
          <div key={item} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(6,12,24,0.5)', borderRadius: '8px',
            padding: '10px 12px', marginBottom: '6px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#C4D4E8' }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(28,47,74,0.6)', margin: '20px 0' }} />

      {/* Inline form */}
      <div className="report-gate-name-row" style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })); }}
            placeholder="First name"
            style={inputStyle('firstName')}
            onFocus={(e) => { e.target.style.borderColor = '#00E5A0'; e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.firstName ? '#FF4444' : '#1C2F4A'; e.target.style.boxShadow = 'none'; }}
          />
          {errors.firstName && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.firstName}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            style={inputStyle()}
            onFocus={(e) => { e.target.style.borderColor = '#00E5A0'; e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#1C2F4A'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
          placeholder="Email address"
          style={inputStyle('email')}
          onFocus={(e) => { e.target.style.borderColor = '#00E5A0'; e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.email ? '#FF4444' : '#1C2F4A'; e.target.style.boxShadow = 'none'; }}
        />
        {errors.email && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.email}</p>}
      </div>

      <div style={{ marginBottom: '4px' }}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
          placeholder="Mobile number (optional)"
          style={inputStyle('phone')}
          onFocus={(e) => { e.target.style.borderColor = '#00E5A0'; e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.phone ? '#FF4444' : '#1C2F4A'; e.target.style.boxShadow = 'none'; }}
        />
        {errors.phone && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.phone}</p>}
      </div>

      {/* SMS toggle */}
      <div style={{ background: 'rgba(6,12,24,0.5)', border: '1px solid #1C2F4A', borderRadius: '10px', padding: '12px 14px', marginTop: '4px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ marginRight: '12px' }}>
          <p className="font-mono" style={{ fontSize: '0.75rem', color: '#EEF2FF' }}>Retest reminders via text</p>
          <p className="font-mono" style={{ fontSize: '0.62rem', color: '#5A7090', marginTop: '2px' }}>We'll remind you to retest every 8 weeks.</p>
        </div>
        <button
          type="button"
          onClick={() => setSmsOptIn(!smsOptIn)}
          style={{
            position: 'relative', width: '44px', height: '26px', borderRadius: '13px',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
            background: smsOptIn ? '#00E5A0' : '#1C2F4A',
          }}
        >
          <span style={{ position: 'absolute', top: '3px', left: smsOptIn ? '22px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="font-mono uppercase"
        style={{
          width: '100%', padding: '16px',
          background: '#00E5A0', color: '#060C18',
          fontSize: '0.78rem', fontWeight: 700,
          letterSpacing: '0.12em', borderRadius: '10px', border: 'none',
          cursor: 'pointer', boxShadow: '0 0 30px rgba(0,229,160,0.3)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 0 50px rgba(0,229,160,0.45)'; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(0,229,160,0.3)'; }}
      >
        Access Full Report →
      </button>

      <p className="font-mono" style={{ fontSize: '0.6rem', color: '#5A7090', textAlign: 'center', marginTop: '12px' }}>
        Free forever. No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}

/* ── Success Toast ── */
function SuccessToast({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', top: visible ? '16px' : '-60px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.4)',
      borderRadius: '10px', padding: '10px 24px', zIndex: 100,
      transition: 'top 0.4s cubic-bezier(0.32,0.72,0,1)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    }}>
      <p className="font-mono" style={{ fontSize: '0.72rem', color: '#00E5A0', fontWeight: 600, whiteSpace: 'nowrap' }}>
        Report unlocked — full access granted
      </p>
    </div>
  );
}

export default function AIReportPanel({
  report,
  vo2Max,
  classification,
  hasSubmittedContact,
  onContactSubmit,
  defaultFirstName,
  defaultLastName,
}: AIReportPanelProps) {
  const [unlocked, setUnlocked] = useState(hasSubmittedContact);
  const [gateVisible, setGateVisible] = useState(!hasSubmittedContact);
  const [showToast, setShowToast] = useState(false);
  const [revealSections, setRevealSections] = useState(hasSubmittedContact);
  const protocolRef = useRef<HTMLDivElement>(null);

  // Sync with parent
  useEffect(() => {
    if (hasSubmittedContact && !unlocked) {
      setUnlocked(true);
      setGateVisible(false);
      setRevealSections(true);
    }
  }, [hasSubmittedContact, unlocked]);

  const handleGateSubmit = (data: { firstName: string; lastName: string; email: string; phone: string; smsOptIn: boolean }) => {
    console.log('Report gate lead captured:', data);
    onContactSubmit(data);
    setUnlocked(true);

    // Animate gate out, sections in
    setGateVisible(false);
    setShowToast(true);
    setTimeout(() => {
      setRevealSections(true);
      // Scroll to protocol section
      setTimeout(() => {
        protocolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }, 350);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <>
      <SuccessToast visible={showToast} />

      <div className="space-y-4 mt-4 animate-fadeIn">
        {/* 1. Score header — always shown */}
        <FormCard>
          <div className="flex items-center gap-3">
            <span className="font-mono text-3xl font-bold" style={{ color: classification.color }}>
              {Math.round(vo2Max * 10) / 10}
            </span>
            <div>
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold"
                style={{ color: classification.color, backgroundColor: classification.bgColor }}
              >
                {classification.name}
              </span>
              <p className="font-mono text-xs text-[#5A7090] mt-0.5">ml/kg/min</p>
            </div>
          </div>
        </FormCard>

        {/* 2. Score meaning — always shown */}
        <FormCard>
          <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-2">
            What Your Score Means
          </p>
          <p className="font-mono text-sm text-[#EEF2FF]/80 leading-relaxed">
            {report.score_meaning}
          </p>
        </FormCard>

        {/* 3. Key Observations — first 2 shown, rest gated */}
        <FormCard>
          <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-3">
            Key Observations
          </p>
          <ul className="space-y-2.5">
            {/* Always show first 2 */}
            {report.observations.slice(0, 2).map((obs, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00E5A0] mt-1.5" />
                <p className="font-mono text-sm text-[#EEF2FF]/80 leading-relaxed">{obs}</p>
              </li>
            ))}
          </ul>

          {/* Fade zone for gated observations */}
          {!unlocked && report.observations.length > 2 && (
            <div style={{ position: 'relative', overflow: 'hidden', height: '120px', marginTop: '10px' }}>
              <ul className="space-y-2.5" style={{ opacity: 0.4 }}>
                {report.observations.slice(2).map((obs, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00E5A0] mt-1.5" />
                    <p className="font-mono text-sm text-[#EEF2FF]/80 leading-relaxed">{obs}</p>
                  </li>
                ))}
              </ul>
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(6,12,24,0.7) 40%, rgba(6,12,24,0.95) 75%, #060C18 100%)',
              }} />
            </div>
          )}

          {/* Unlocked: show remaining observations normally */}
          {unlocked && report.observations.length > 2 && (
            <ul className="space-y-2.5" style={{
              marginTop: '10px',
              animation: revealSections && !hasSubmittedContact ? 'reportReveal 0.5s ease-out 0.1s both' : undefined,
            }}>
              {report.observations.slice(2).map((obs, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00E5A0] mt-1.5" />
                  <p className="font-mono text-sm text-[#EEF2FF]/80 leading-relaxed">{obs}</p>
                </li>
              ))}
            </ul>
          )}
        </FormCard>

        {/* GATE CARD — shown when not unlocked */}
        {!unlocked && (
          <div style={{
            opacity: gateVisible ? 1 : 0,
            transform: gateVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}>
            <ReportGateCard
              onSubmit={handleGateSubmit}
              defaultFirstName={defaultFirstName}
              defaultLastName={defaultLastName}
            />
          </div>
        )}

        {/* 4. 8-Week Protocol — gated */}
        {unlocked && (
          <div ref={protocolRef} style={{
            animation: revealSections && !hasSubmittedContact ? 'reportReveal 0.5s ease-out 0.2s both' : undefined,
          }}>
            <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-3 px-1">
              8-Week Improvement Protocol
            </p>
            <div className="space-y-3">
              {report.protocol.map((week) => (
                <FormCard key={week.weeks}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-sm text-[#EEF2FF] font-semibold">{week.weeks}</span>
                    <span className="px-2 py-0.5 rounded bg-[#00E5A0]/10 border border-[#00E5A0]/20 font-mono text-[10px] text-[#00E5A0] uppercase">
                      {week.phase}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[
                      ['Exercise', week.exercise],
                      ['Duration', week.duration],
                      ['Intensity', week.intensity],
                      ['Frequency', week.frequency],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">{label}</p>
                        <p className="font-mono text-xs text-[#EEF2FF]/80 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-xs text-[#5A7090] italic">{week.focus}</p>
                </FormCard>
              ))}
            </div>
          </div>
        )}

        {/* 5. Next target — gated */}
        {unlocked && (
          <div style={{
            animation: revealSections && !hasSubmittedContact ? 'reportReveal 0.5s ease-out 0.3s both' : undefined,
          }}>
            <FormCard>
              <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-3">
                Next Test Target
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-mono text-3xl text-[#00E5A0] font-bold">
                  {report.next_target.vo2_target}
                </span>
                <span className="font-mono text-xs text-[#5A7090]">ml/kg/min</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <p className="font-mono text-[10px] text-[#5A7090] uppercase">Target</p>
                  <p className="font-mono text-xs text-[#EEF2FF]">{report.next_target.classification}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-[#5A7090] uppercase">Improvement</p>
                  <p className="font-mono text-xs text-[#EEF2FF]">+{report.next_target.improvement_needed}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-[#5A7090] uppercase">Timeframe</p>
                  <p className="font-mono text-xs text-[#EEF2FF]">{report.next_target.timeframe}</p>
                </div>
              </div>
              <p className="font-mono text-sm text-[#EEF2FF]/80 italic">{report.next_target.closing}</p>
            </FormCard>
          </div>
        )}
      </div>

      <style>{`
        @keyframes reportReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .report-gate-card {
            margin: 0 !important;
            animation: reportGatePulse 2s ease-in-out infinite;
          }
          .report-gate-name-row {
            flex-direction: column !important;
          }
        }
        @keyframes reportGatePulse {
          0%, 100% { border-color: rgba(0,229,160,0.2); }
          50% { border-color: rgba(0,229,160,0.5); }
        }
      `}</style>
    </>
  );
}
