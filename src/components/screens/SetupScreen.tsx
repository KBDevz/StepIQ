import { useState, useRef, useCallback } from 'react';
import type { TestState } from '../../types';
import NavBar from '../ui/NavBar';
import WearableCard from '../ui/WearableCard';

interface JunctionProps {
  connected: boolean;
  provider: string | null;
  loading: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

interface SetupScreenProps {
  state: TestState;
  updateSetup: (fields: Partial<Pick<TestState, 'name' | 'age' | 'sex' | 'betaBlocker'>>) => void;
  toggleDevMode: () => void;
  onBegin: () => void;
  onLogoClick: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
  junctionProps?: JunctionProps;
  isLoggedIn?: boolean;
}

/* ── Progress Steps ── */
function ProgressSteps() {
  const steps = ['Setup', 'Test', 'Results'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px' }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px', height: '28px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700,
                ...(i === 0
                  ? { background: 'var(--accent)', color: '#060C18' }
                  : { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)' }),
              }}
            >
              {i + 1}
            </div>
            <span
              className="font-mono"
              style={{
                fontSize: '0.65rem', letterSpacing: '0.06em',
                color: i === 0 ? 'var(--accent)' : 'var(--text2)',
                fontWeight: i === 0 ? 600 : 400,
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: '32px', height: '1px', background: 'var(--border)', margin: '0 12px' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Reassurance Points ── */
function ReassurancePoints() {
  const points = [
    'Takes under 30 seconds to complete',
    'Only age and sex required for scoring',
    'No account or payment needed',
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {points.map((point) => (
        <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--accent)' }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text2)', lineHeight: 1.5 }}>
            {point}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── The Form ── */
function SetupForm({
  state, updateSetup, toggleDevMode, onBegin, ageStr, setAgeStr, junctionProps, isLoggedIn, onSignIn,
}: {
  state: TestState;
  updateSetup: SetupScreenProps['updateSetup'];
  toggleDevMode: () => void;
  onBegin: () => void;
  ageStr: string;
  setAgeStr: (s: string) => void;
  junctionProps?: JunctionProps;
  isLoggedIn?: boolean;
  onSignIn?: () => void;
}) {
  const pressTimer = useRef<number | null>(null);
  const ageValid = state.age >= 13 && state.age <= 80;

  const handleLongPressStart = useCallback(() => {
    pressTimer.current = window.setTimeout(() => { toggleDevMode(); }, 600);
  }, [toggleDevMode]);

  const handleLongPressEnd = useCallback(() => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  }, []);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '14px 16px',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.9rem',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.62rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--text2)',
    marginBottom: '6px',
  };

  return (
    <div>
      {/* Eyebrow */}
      <p
        className="font-mono uppercase"
        style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: '8px' }}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
      >
        Quick Setup
      </p>

      {/* Title */}
      <h1 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.2 }}>
        Tell us about yourself
      </h1>

      {/* Subtitle */}
      <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '28px' }}>
        Your age and sex allow us to calculate your predicted maximum heart rate and classify your results against clinical norms.
      </p>

      {state.devMode && (
        <div style={{ marginBottom: '20px', padding: '8px 14px', borderRadius: '20px', background: 'rgba(255,140,66,0.1)', border: '1px solid rgba(255,140,66,0.3)', display: 'inline-block' }}>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: '#FF8C42' }}>Dev Mode Active — 10s levels</span>
        </div>
      )}

      {/* Name field */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Name <span style={{ color: 'var(--text2)', fontWeight: 400, textTransform: 'none' as const, letterSpacing: 0 }}>(optional)</span>
        </label>
        <input
          type="text"
          value={state.name}
          onChange={(e) => updateSetup({ name: e.target.value })}
          placeholder="Enter your name"
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
        />
      </div>

      {/* Age field */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Age <span style={{ color: 'var(--danger)', fontSize: '0.55rem' }}>*</span>
        </label>
        <input
          type="number"
          inputMode="numeric"
          value={ageStr}
          onChange={(e) => {
            setAgeStr(e.target.value);
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n)) updateSetup({ age: n });
          }}
          min={13}
          max={80}
          placeholder="e.g. 35"
          style={{
            ...inputStyle,
            borderColor: ageStr && !ageValid ? 'var(--danger)' : 'var(--border)',
          }}
          onFocus={(e) => { e.target.style.borderColor = ageStr && !ageValid ? 'var(--danger)' : 'var(--accent)'; }}
          onBlur={(e) => { e.target.style.borderColor = ageStr && !ageValid ? 'var(--danger)' : 'var(--border)'; }}
        />
        {ageStr && !ageValid && (
          <p className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--danger)', marginTop: '6px' }}>Age must be between 13 and 80</p>
        )}
      </div>

      {/* Biological Sex */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Biological Sex <span style={{ color: 'var(--danger)', fontSize: '0.55rem' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['male', 'female'] as const).map((sex) => (
            <button
              key={sex}
              type="button"
              onClick={() => updateSetup({ sex })}
              className="font-mono capitalize"
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: state.sex === sex ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: state.sex === sex ? 'var(--accent-glow)' : 'var(--surface2)',
                color: state.sex === sex ? 'var(--accent)' : 'var(--text2)',
                fontWeight: state.sex === sex ? 600 : 400,
              }}
            >
              {sex}
            </button>
          ))}
        </div>
      </div>

      {/* Beta blocker / HR medication toggle */}
      <div
        style={{
          background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '10px',
          padding: '14px 16px', marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '16px' }}>
            <p className="font-mono" style={{ fontSize: '0.8rem', color: state.betaBlocker ? 'var(--warn)' : 'var(--text)' }}>
              Beta blocker or HR medication
            </p>
            <p className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text2)', marginTop: '4px', lineHeight: 1.5 }}>
              Toggle if you take beta blockers or heart rate medication
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateSetup({ betaBlocker: !state.betaBlocker })}
            style={{
              position: 'relative', width: '48px', height: '28px', borderRadius: '14px',
              border: 'none', cursor: 'pointer', transition: 'background 0.2s',
              background: state.betaBlocker ? 'var(--warn)' : 'var(--border)',
              flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute', top: '4px',
              left: state.betaBlocker ? '24px' : '4px',
              width: '20px', height: '20px', borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s',
            }} />
          </button>
        </div>
        {state.betaBlocker && (
          <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '8px', background: 'var(--warn-glow)', border: '1px solid rgba(245,165,36,0.2)' }}>
            <p className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--warn)' }}>
              Max HR: 164 - (0.7 x {state.age}) = {state.maxHR} bpm
            </p>
          </div>
        )}
      </div>

      {/* Wearable connection */}
      {junctionProps && (
        <div style={{ marginBottom: '20px' }}>
          <WearableCard
            connected={junctionProps.connected}
            provider={junctionProps.provider}
            loading={junctionProps.loading}
            error={junctionProps.error}
            isLoggedIn={!!isLoggedIn}
            onConnect={junctionProps.onConnect}
            onDisconnect={junctionProps.onDisconnect}
            onSignIn={onSignIn ?? (() => {})}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={onBegin}
        disabled={!ageValid}
        className="font-mono uppercase"
        style={{
          width: '100%',
          padding: '16px',
          marginTop: '28px',
          background: ageValid ? 'var(--accent)' : 'var(--accent-dark)',
          color: '#060C18',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          borderRadius: '10px',
          border: 'none',
          cursor: ageValid ? 'pointer' : 'not-allowed',
          boxShadow: ageValid ? 'var(--shadow-accent)' : 'none',
          transition: 'all 0.2s',
          opacity: ageValid ? 1 : 0.4,
        }}
      >
        Continue →
      </button>

      <p className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text2)', textAlign: 'center', marginTop: '12px' }}>
        Your data stays on your device and is never stored
      </p>
    </div>
  );
}

/* ── Main SetupScreen ── */
export default function SetupScreen({ state, updateSetup, toggleDevMode, onBegin, onLogoClick, onHowItWorks, authNavProps, junctionProps, isLoggedIn }: SetupScreenProps) {
  const [ageStr, setAgeStr] = useState(String(state.age));
  const devPressTimer = useRef<number | null>(null);

  const handleDevPressStart = useCallback(() => {
    devPressTimer.current = window.setTimeout(() => { toggleDevMode(); }, 600);
  }, [toggleDevMode]);

  const handleDevPressEnd = useCallback(() => {
    if (devPressTimer.current) { clearTimeout(devPressTimer.current); devPressTimer.current = null; }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', position: 'relative', overflow: 'hidden' }} className="setup-page-enter">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none setup-vignette" />

      <NavBar onStart={onBegin} onHowItWorks={onHowItWorks} onLogoClick={onLogoClick} {...authNavProps} />

      {/* ── Desktop: two-column layout ── */}
      <div className="setup-layout relative z-10" style={{ minHeight: '100vh', paddingTop: '72px' }}>

        {/* Left column — branding (desktop only) */}
        <div className="setup-left-col">
          <div style={{ maxWidth: '400px' }}>
            {/* Logo — long press to toggle dev mode */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', cursor: 'default', userSelect: 'none' }}
              onMouseDown={handleDevPressStart}
              onMouseUp={handleDevPressEnd}
              onMouseLeave={handleDevPressEnd}
              onTouchStart={handleDevPressStart}
              onTouchEnd={handleDevPressEnd}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-glow)', border: '1px solid rgba(0,184,162,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent)' }}>
                  <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--text)' }}>StepIQ</span>
            </div>
            <p className="font-mono uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.16em', color: 'var(--text2)', marginBottom: '48px' }}>
              Chester Step Test · VO₂ Max Assessment
            </p>

            <ProgressSteps />
            <ReassurancePoints />
          </div>
        </div>

        {/* Right column — form */}
        <div className="setup-right-col">
          {/* Form card (desktop gets card styling, mobile is flat) */}
          <div className="setup-form-card">
            {/* Top accent line */}
            <div className="setup-accent-line" />
            <SetupForm
              state={state}
              updateSetup={updateSetup}
              toggleDevMode={toggleDevMode}
              onBegin={onBegin}
              ageStr={ageStr}
              setAgeStr={setAgeStr}
              junctionProps={junctionProps}
              isLoggedIn={isLoggedIn}
              onSignIn={authNavProps?.onSignIn}
            />
          </div>
        </div>
      </div>

      <style>{`
        /* Entry animation */
        .setup-page-enter {
          animation: setupFadeIn 0.4s ease-out;
        }
        @keyframes setupFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Desktop layout */
        .setup-layout {
          display: grid;
          grid-template-columns: 55% 45%;
        }
        .setup-left-col {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 64px;
        }
        .setup-right-col {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 64px;
          background: var(--surface);
        }
        .setup-form-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          overflow: hidden;
        }
        .setup-accent-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), transparent);
          border-radius: 16px 16px 0 0;
        }
        .setup-vignette {
          background: radial-gradient(ellipse at center, transparent 30%, rgba(15, 14, 19, 0.6) 60%, var(--bg) 100%);
        }
        :root[data-theme="light"] .setup-vignette,
        .theme-light .setup-vignette {
          background: radial-gradient(ellipse at center, transparent 30%, rgba(248, 246, 242, 0.3) 60%, var(--bg) 100%);
        }

        /* Tablet (768–1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .setup-layout {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .setup-left-col {
            display: none;
          }
          .setup-right-col {
            width: 100%;
            padding: 40px 48px;
            background: transparent;
            justify-content: center;
          }
          .setup-form-card {
            max-width: 480px;
          }
        }

        /* Mobile (< 768px) */
        @media (max-width: 767px) {
          .setup-layout {
            display: flex;
            flex-direction: column;
          }
          .setup-left-col {
            display: none;
          }
          .setup-right-col {
            width: 100%;
            padding: 32px 28px;
            background: transparent;
          }
          .setup-form-card {
            background: transparent;
            border: none;
            border-radius: 0;
            padding: 0;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
          .setup-accent-line {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
