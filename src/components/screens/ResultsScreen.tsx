import { useState, useCallback, useRef, useEffect } from 'react';
import type { TestState, AIReport } from '../../types';
import { calcVO2Max, classify, getThresholds, CLASSIFICATION_NAMES } from '../../utils/scoring';
import { buildReportPrompt } from '../../utils/reportPrompt';
import NavBar from '../ui/NavBar';
import RegressionChart from '../results/RegressionChart';
import AIReportPanel from '../results/AIReportPanel';
import APIKeyModal from '../results/APIKeyModal';

interface ResultsScreenProps {
  state: TestState;
  stopReason: string;
  onNewTest: () => void;
}

/* ── Lead Capture Card ── */
function LeadCaptureCard({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  smsOptIn,
  setSmsOptIn,
  onSubmit,
  onSkip,
  loading,
}: {
  firstName: string;
  setFirstName: (s: string) => void;
  lastName: string;
  setLastName: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  phone: string;
  setPhone: (s: string) => void;
  smsOptIn: boolean;
  setSmsOptIn: (b: boolean) => void;
  onSubmit: () => void;
  onSkip: () => void;
  loading: boolean;
}) {
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
      console.log('Lead captured:', { firstName, lastName, email, phone, smsOptIn });
      onSubmit();
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
    <div
      className="results-lead-card"
      style={{
        position: 'sticky',
        top: '100px',
        background: 'linear-gradient(145deg, #0D2238 0%, #0D1829 100%)',
        border: '1px solid rgba(0,229,160,0.25)',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,160,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Top accent gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #00E5A0, transparent)', borderRadius: '20px 20px 0 0' }} />

      {/* Badge */}
      <span className="font-mono uppercase" style={{ display: 'inline-block', fontSize: '0.58rem', letterSpacing: '0.14em', color: '#00E5A0', background: 'rgba(0,229,160,0.1)', padding: '5px 12px', borderRadius: '20px', marginBottom: '16px' }}>
        Your Personalized Report
      </span>

      <h2 className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '8px' }}>
        Get Your Full AI Report
      </h2>

      <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', lineHeight: 1.7, marginBottom: '24px' }}>
        Enter your details below to receive your personalized VO₂ assessment, clinical observations, and an 8-week cardiovascular training protocol.
      </p>

      {/* What's included */}
      <div style={{ marginBottom: '28px' }}>
        {['AI analysis of your test data', 'Personalized 8-week training protocol', 'Your next VO₂ target and timeline'].map((item) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-mono" style={{ fontSize: '0.7rem', color: '#C4D4E8' }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: 'rgba(28,47,74,0.8)', margin: '24px 0' }} />

      {/* Name fields side by side */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: '' })); }}
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

      {/* Email */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
          placeholder="Email address"
          style={inputStyle('email')}
          onFocus={(e) => { e.target.style.borderColor = '#00E5A0'; e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.email ? '#FF4444' : '#1C2F4A'; e.target.style.boxShadow = 'none'; }}
        />
        {errors.email && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.email}</p>}
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '4px' }}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
          placeholder="Mobile number (optional)"
          style={inputStyle('phone')}
          onFocus={(e) => { e.target.style.borderColor = '#00E5A0'; e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.phone ? '#FF4444' : '#1C2F4A'; e.target.style.boxShadow = 'none'; }}
        />
        {errors.phone && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.phone}</p>}
      </div>

      {/* SMS opt-in toggle */}
      <div style={{ background: 'rgba(6,12,24,0.5)', border: '1px solid #1C2F4A', borderRadius: '10px', padding: '12px 14px', marginTop: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ marginRight: '12px' }}>
          <p className="font-mono" style={{ fontSize: '0.75rem', color: '#EEF2FF' }}>Test reminders via text</p>
          <p className="font-mono" style={{ fontSize: '0.62rem', color: '#5A7090', marginTop: '2px' }}>We'll remind you to retest every 8 weeks. No spam, ever.</p>
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
        disabled={loading}
        className="font-mono uppercase"
        style={{
          width: '100%', padding: '16px',
          background: loading ? 'rgba(0,229,160,0.4)' : '#00E5A0',
          color: '#060C18', fontSize: '0.8rem', fontWeight: 700,
          letterSpacing: '0.12em', borderRadius: '10px', border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 40px rgba(0,229,160,0.3)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { if (!loading) { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 0 60px rgba(0,229,160,0.45)'; } }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 0 40px rgba(0,229,160,0.3)'; }}
      >
        {loading ? 'Generating...' : 'Generate My Report →'}
      </button>

      <p className="font-mono" style={{ fontSize: '0.6rem', color: '#5A7090', textAlign: 'center', marginTop: '12px' }}>
        No spam. Your data stays private.
      </p>

      <button
        type="button"
        onClick={onSkip}
        className="font-mono"
        style={{ display: 'block', margin: '8px auto 0', fontSize: '0.65rem', color: '#5A7090', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s' }}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#00E5A0'; (e.target as HTMLElement).style.textDecoration = 'underline'; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#5A7090'; (e.target as HTMLElement).style.textDecoration = 'none'; }}
      >
        View report without saving →
      </button>
    </div>
  );
}

/* ── Success State (with generating / ready / error states) ── */
function LeadSuccessState({
  firstName,
  email,
  loading,
  report,
  reportError,
  onViewReport,
}: {
  firstName: string;
  email: string;
  loading: boolean;
  report: AIReport | null;
  reportError: string | null;
  onViewReport: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const estimatedSeconds = 15;

  useEffect(() => {
    if (!loading) { setElapsed(0); return; }
    setElapsed(0);
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const remaining = Math.max(0, estimatedSeconds - elapsed);

  return (
    <div
      style={{
        position: 'sticky', top: '100px',
        background: 'linear-gradient(145deg, #0D2238 0%, #0D1829 100%)',
        border: `1px solid ${report ? 'rgba(0,229,160,0.4)' : reportError ? 'rgba(255,68,68,0.3)' : 'rgba(0,229,160,0.25)'}`,
        borderRadius: '20px', padding: '40px 36px', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        transition: 'border-color 0.3s',
      }}
    >
      {/* ── Generating state ── */}
      {loading && !report && (
        <>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>

          <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Generating your report{firstName ? `, ${firstName}` : ''}...
          </h3>

          <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', lineHeight: 1.7, marginBottom: '24px' }}>
            Our AI is analyzing your test data and building a personalized fitness protocol.
          </p>

          {/* Waveform animation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', height: '40px', marginBottom: '20px' }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '3px',
                  borderRadius: '2px',
                  background: '#00E5A0',
                  animation: `waveform 1.2s ease-in-out ${i * 0.06}s infinite`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          {/* Countdown */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ width: '100%', maxWidth: '200px', height: '4px', background: '#152238', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: '#00E5A0', borderRadius: '2px',
                width: `${Math.min(100, (elapsed / estimatedSeconds) * 100)}%`,
                transition: 'width 1s linear',
              }} />
            </div>
            <span className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', whiteSpace: 'nowrap' }}>
              {remaining > 0 ? `~${remaining}s` : 'Almost done...'}
            </span>
          </div>
        </>
      )}

      {/* ── Report ready state ── */}
      {report && !loading && (
        <>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Your report is ready{firstName ? `, ${firstName}` : ''}!
          </h3>
          <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', lineHeight: 1.7, marginBottom: '24px' }}>
            Your personalized AI fitness report has been generated.{email ? ` A copy will be sent to ${email}.` : ''}
          </p>

          <button
            onClick={onViewReport}
            className="font-mono uppercase"
            style={{
              width: '100%', padding: '16px',
              background: '#00E5A0', color: '#060C18',
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em',
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              boxShadow: '0 0 40px rgba(0,229,160,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 0 60px rgba(0,229,160,0.45)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 0 40px rgba(0,229,160,0.3)'; }}
          >
            View My Report ↓
          </button>
        </>
      )}

      {/* ── Error state ── */}
      {reportError && !loading && !report && (
        <>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Something went wrong
          </h3>
          <p className="font-mono" style={{ fontSize: '0.72rem', color: '#FF4444', lineHeight: 1.7 }}>
            {reportError}
          </p>
        </>
      )}

      {/* ── Idle / waiting state (captured but not yet generating) ── */}
      {!loading && !report && !reportError && (
        <>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            You're all set{firstName ? `, ${firstName}` : ''}!
          </h3>
          <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', lineHeight: 1.7 }}>
            Your report will begin generating shortly.
          </p>
        </>
      )}
    </div>
  );
}

/* ── Main Results Screen ── */
export default function ResultsScreen({ state, stopReason, onNewTest }: ResultsScreenProps) {
  const [firstName, setFirstName] = useState(state.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(state.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_ANTHROPIC_API_KEY || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const vo2Max = calcVO2Max(state.data, state.maxHR);
  const classification = classify(vo2Max, state.age, state.sex);
  const vo2Display = Math.round(vo2Max * 10) / 10;
  const hrFormula = state.betaBlocker ? 'Adjusted (Londeree)' : 'Standard (220-age)';

  // Scroll to report when user clicks "View My Report"
  useEffect(() => {
    if (showReport && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showReport]);

  const generateReport = useCallback(
    async (key: string) => {
      setLoading(true);
      setReportError(null);
      setShowKeyModal(false);

      try {
        const prompt = buildReportPrompt(state, vo2Max, classification, stopReason);
        const models = ['claude-sonnet-4-6', 'claude-sonnet-4-5-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-5-sonnet-latest'];
        let res: Response | null = null;
        let lastError = '';

        for (const model of models) {
          res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': key,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({ model, max_tokens: 1800, messages: [{ role: 'user', content: prompt }] }),
          });

          if (res.status === 401 || res.status === 403) {
            setApiKey('');
            setKeyError('Invalid API key. Please try again.');
            setShowKeyModal(true);
            setLoading(false);
            return;
          }
          if (res.ok) break;
          if (res.status === 404) { lastError = `Model ${model} not available`; continue; }
          const errBody = await res.text();
          throw new Error(`API error ${res.status}: ${errBody.slice(0, 200)}`);
        }

        if (!res || !res.ok) throw new Error(lastError || 'No available model found');
        const body = await res.json();
        const text = body.content?.[0]?.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        const parsed: AIReport = JSON.parse(jsonMatch[0]);
        setReport(parsed);
        setApiKey(key);
      } catch (err: any) {
        setReportError(err.message || 'Failed to generate report');
      } finally {
        setLoading(false);
      }
    },
    [state, vo2Max, classification, stopReason],
  );

  const handleGenerateClick = useCallback(() => {
    if (apiKey) generateReport(apiKey);
    else setShowKeyModal(true);
  }, [apiKey, generateReport]);

  const handleLeadSubmit = () => {
    setLeadCaptured(true);
    handleGenerateClick();
  };

  const handleSkip = () => {
    setLeadCaptured(true);
    handleGenerateClick();
  };

  // Card style shared across data cards
  const cardStyle: React.CSSProperties = {
    background: '#0D1829',
    border: '1px solid #1C2F4A',
    borderRadius: '14px',
    padding: '20px',
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.58rem',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: '#5A7090',
    marginBottom: '14px',
  };

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(28,47,74,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(28,47,74,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(6,12,24,0) 30%, rgba(6,12,24,0.6) 60%, #060C18 100%)' }} />

      <NavBar
        onStart={onNewTest}
        onHowItWorks={() => {}}
        onLogoClick={onNewTest}
      />

      <div className="relative z-10" style={{ paddingTop: '72px' }}>
        <div className="results-layout" style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* ── LEFT COLUMN ── */}
          <div className="results-left">
            {/* VO2 Score Hero */}
            <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
              {/* Colored glow */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '280px', height: '280px', borderRadius: '50%', background: `radial-gradient(circle, ${classification.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />

              <p style={sectionLabel}>Estimated VO₂ Max</p>
              <p className="font-serif" style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', fontWeight: 700, color: classification.color, lineHeight: 1, position: 'relative' }}>
                {vo2Display}
              </p>
              <p className="font-mono" style={{ fontSize: '0.7rem', color: '#5A7090', marginTop: '4px' }}>
                ml · kg⁻¹ · min⁻¹
              </p>
              <span className="font-mono uppercase" style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: classification.color, background: classification.bgColor, border: `1px solid ${classification.color}30`, padding: '8px 24px', borderRadius: '24px' }}>
                {classification.name}
              </span>

              {/* Fitness Classification Scale */}
              {(() => {
                const thresholds = getThresholds(state.age, state.sex);
                const scaleColors = ['#FF4444', '#FF8C42', '#FFD166', '#06D6A0', '#00E5A0'];
                const activeIdx = CLASSIFICATION_NAMES.indexOf(classification.name as typeof CLASSIFICATION_NAMES[number]);

                return (
                  <div style={{ marginTop: '24px', width: '100%', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                    {/* Scale bar */}
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden' }}>
                      {CLASSIFICATION_NAMES.map((name, i) => (
                        <div
                          key={name}
                          style={{
                            flex: 1,
                            height: i === activeIdx ? '10px' : '6px',
                            background: i === activeIdx ? scaleColors[i] : `${scaleColors[i]}30`,
                            transition: 'all 0.3s',
                            borderRadius: '4px',
                            boxShadow: i === activeIdx ? `0 0 12px ${scaleColors[i]}50` : 'none',
                            alignSelf: 'center',
                          }}
                        />
                      ))}
                    </div>

                    {/* Labels */}
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {CLASSIFICATION_NAMES.map((name, i) => (
                        <div
                          key={name}
                          style={{
                            flex: 1,
                            textAlign: 'center',
                          }}
                        >
                          <p className="font-mono" style={{
                            fontSize: '0.55rem',
                            fontWeight: i === activeIdx ? 700 : 400,
                            color: i === activeIdx ? scaleColors[i] : '#5A7090',
                            lineHeight: 1.3,
                            transition: 'all 0.3s',
                          }}>
                            {name}
                          </p>
                          <p className="font-mono" style={{
                            fontSize: '0.5rem',
                            color: i === activeIdx ? `${scaleColors[i]}AA` : '#3A506A',
                            marginTop: '2px',
                          }}>
                            {i === 0 ? `<${thresholds[0]}` :
                             i === 4 ? `≥${thresholds[3]}` :
                             `${thresholds[i - 1]}–${thresholds[i] - 1}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Lead capture on mobile (above chart) */}
            <div className="results-mobile-lead">
              {!leadCaptured ? (
                <LeadCaptureCard
                  firstName={firstName} setFirstName={setFirstName}
                  lastName={lastName} setLastName={setLastName}
                  email={email} setEmail={setEmail}
                  phone={phone} setPhone={setPhone}
                  smsOptIn={smsOptIn} setSmsOptIn={setSmsOptIn}
                  onSubmit={handleLeadSubmit} onSkip={handleSkip}
                  loading={loading}
                />
              ) : (
                <LeadSuccessState firstName={firstName} email={email} loading={loading} report={report} reportError={reportError} onViewReport={() => setShowReport(true)} />
              )}
            </div>

            {/* Regression Chart */}
            <div style={{ ...cardStyle, marginBottom: '20px' }}>
              <p style={sectionLabel}>HR vs VO₂ · Linear Regression</p>
              <div className="results-chart-container">
                <RegressionChart data={state.data} maxHR={state.maxHR} vo2Max={vo2Max} />
              </div>
            </div>

            {/* Warning */}
            {state.data.length < 3 && (
              <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.25)' }}>
                <p className="font-mono" style={{ fontSize: '0.72rem', color: '#FF8C42', lineHeight: 1.6 }}>
                  Warning: Fewer than 3 levels completed. Results should be interpreted with caution.
                </p>
              </div>
            )}

            {/* Level Data Table */}
            <div style={{ ...cardStyle, marginBottom: '20px' }}>
              <p style={sectionLabel}>Level Data</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ color: '#5A7090' }}>
                    <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #1C2F4A', fontWeight: 500 }}>Level</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #1C2F4A', fontWeight: 500 }}>HR (bpm)</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #1C2F4A', fontWeight: 500 }}>RPE</th>
                    <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #1C2F4A', fontWeight: 500 }}>VO₂ est.</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.map((d, i) => (
                    <tr key={d.level} style={{ background: i % 2 === 1 ? 'rgba(10,18,32,0.5)' : 'transparent' }}>
                      <td style={{ padding: '10px 0', color: '#EEF2FF' }}>{d.level}</td>
                      <td style={{ textAlign: 'right', padding: '10px 0', color: '#EEF2FF' }}>{d.hr}</td>
                      <td style={{ textAlign: 'right', padding: '10px 0', color: d.rpe >= 7 ? '#FF8C42' : '#EEF2FF' }}>{d.rpe}</td>
                      <td style={{ textAlign: 'right', padding: '10px 0', color: '#EEF2FF' }}>{d.vo2Estimate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stats Grid */}
            <div className="results-stats-grid" style={{ marginBottom: '20px' }}>
              {[
                { label: 'Max HR (pred.)', value: `${state.maxHR}`, unit: 'bpm' },
                { label: 'Levels Done', value: `${state.data.length}`, unit: 'of 5' },
                { label: 'Age', value: `${state.age}`, unit: '' },
                { label: 'HR Formula', value: hrFormula, unit: '', small: true },
                ...(state.restingHR !== null ? [{ label: 'Resting HR', value: `${state.restingHR}`, unit: 'bpm' }] : []),
              ].map((stat) => (
                <div key={stat.label} style={{ ...cardStyle, padding: '16px' }}>
                  <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5A7090', marginBottom: '6px' }}>{stat.label}</p>
                  <p style={{ fontFamily: stat.small ? 'IBM Plex Mono, monospace' : 'Libre Baskerville, serif', fontSize: stat.small ? '0.8rem' : '1.4rem', fontWeight: 700, color: stat.label === 'HR Formula' && state.betaBlocker ? '#FF8C42' : '#EEF2FF' }}>
                    {stat.value}
                    {stat.unit && <span className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', marginLeft: '4px', fontWeight: 400 }}>{stat.unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Report (only shown after user clicks "View My Report") */}
            <div ref={reportRef}>
              {showReport && reportError && (
                <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)' }}>
                  <p className="font-mono" style={{ fontSize: '0.72rem', color: '#FF4444' }}>{reportError}</p>
                </div>
              )}

              {showReport && report && (
                <AIReportPanel report={report} vo2Max={vo2Max} classification={classification} />
              )}
            </div>

            {/* New test button */}
            <div style={{ marginTop: '32px', marginBottom: '48px' }}>
              <button
                onClick={onNewTest}
                className="font-mono"
                style={{
                  width: '100%', padding: '14px',
                  background: 'transparent', color: '#5A7090',
                  border: '1px solid #1C2F4A', borderRadius: '10px',
                  fontSize: '0.8rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = '#5A7090'; (e.target as HTMLElement).style.color = '#EEF2FF'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = '#1C2F4A'; (e.target as HTMLElement).style.color = '#5A7090'; }}
              >
                Take New Test
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN (desktop only) ── */}
          <div className="results-right">
            {!leadCaptured ? (
              <LeadCaptureCard
                firstName={firstName} setFirstName={setFirstName}
                lastName={lastName} setLastName={setLastName}
                email={email} setEmail={setEmail}
                phone={phone} setPhone={setPhone}
                smsOptIn={smsOptIn} setSmsOptIn={setSmsOptIn}
                onSubmit={handleLeadSubmit} onSkip={handleSkip}
                loading={loading}
              />
            ) : (
              <LeadSuccessState firstName={firstName} email={email} loading={loading} report={report} reportError={reportError} onViewReport={() => setShowReport(true)} />
            )}
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <APIKeyModal
          onSubmit={(key) => { setKeyError(null); generateReport(key); }}
          onClose={() => setShowKeyModal(false)}
          error={keyError}
        />
      )}

      <style>{`
        .results-layout {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 60px;
          padding: 48px 64px;
        }
        .results-left { min-width: 0; }
        .results-right { position: relative; }
        .results-mobile-lead { display: none; }
        .results-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .results-chart-container .w-full { border: none; border-radius: 0; padding: 0; background: transparent; backdrop-filter: none; }

        /* Override RegressionChart's wrapper */
        .results-chart-container > div {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          backdrop-filter: none !important;
        }
        .results-chart-container .recharts-responsive-container {
          height: 320px !important;
        }

        /* Lead card pulse on mobile */
        @keyframes leadPulse {
          0%, 100% { border-color: rgba(0,229,160,0.25); }
          50% { border-color: rgba(0,229,160,0.5); }
        }

        @keyframes waveform {
          0%, 100% { height: 4px; opacity: 0.3; }
          50% { height: 28px; opacity: 0.8; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .results-layout {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 48px 48px;
            max-width: 640px;
          }
          .results-right { display: none; }
          .results-mobile-lead { display: block; margin-bottom: 28px; }
          .results-lead-card { position: static !important; }
          .results-chart-container .recharts-responsive-container {
            height: 240px !important;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .results-layout {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 24px 24px 48px;
          }
          .results-right { display: none; }
          .results-mobile-lead {
            display: block;
            margin-bottom: 24px;
          }
          .results-mobile-lead .results-lead-card {
            position: static !important;
            animation: leadPulse 2s ease-in-out infinite;
          }
          .results-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .results-chart-container .recharts-responsive-container {
            height: 220px !important;
          }
        }
      `}</style>
    </div>
  );
}
