import { useState } from 'react';
import type { ClassificationResult } from '../../types';

interface Moment5Props {
  classification: ClassificationResult;
  age: number;
  onSubmit: (data: { firstName: string; lastName: string; email: string; phone: string; smsOptIn: boolean }) => void;
  onSkip: () => void;
  defaultFirstName?: string;
  defaultLastName?: string;
  loading?: boolean;
  authError?: string | null;
  onSignInInstead?: () => void;
}

function getSubtext(classification: ClassificationResult, age: number): string {
  switch (classification.name) {
    case 'Excellent':
    case 'Good':
      return 'Built for someone at your level — interval protocols and threshold work to push you even higher.';
    case 'Average':
      return `Built specifically for a ${classification.name} score at age ${age} — this is your roadmap to Good.`;
    default:
      return 'Built for exactly where you are — safe, progressive, and designed to move you up one full category in 8 weeks.';
  }
}

export default function Moment5({ classification, age, onSubmit, onSkip, defaultFirstName, defaultLastName, loading, authError, onSignInInstead }: Moment5Props) {
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
    if (smsOptIn && !phone.trim()) errs.phone = 'Mobile number required for SMS';
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
    border: `1px solid ${errors[field || ''] ? '#FF4444' : 'var(--border)'}`,
    borderRadius: '10px',
    padding: '12px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '80px 24px 40px',
      position: 'relative',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Subtle glow */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,184,162,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Top label */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text2)',
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        One More Thing
      </p>

      {/* Headline */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.8rem',
        fontWeight: 700,
        color: 'var(--text)',
        textAlign: 'center',
        marginBottom: '8px',
      }}>
        Your 8-week plan is ready
      </h2>

      {/* Dynamic subtext */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.88rem',
        color: 'var(--text2)',
        textAlign: 'center',
        maxWidth: '300px',
        margin: '0 auto',
        lineHeight: 1.5,
        marginBottom: '24px',
      }}>
        {getSubtext(classification, age)}
      </p>

      {/* Locked items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {[
          '8-Week Training Protocol',
          'Personalized Weekly Plan',
          'Your Next VO₂ Target',
        ].map((item) => (
          <div key={item} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: 'var(--surface)',
            borderRadius: '10px',
            border: '1px solid var(--border)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--text)',
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />

      {/* Form fields */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })); }}
            placeholder="First name"
            style={inputStyle('firstName')}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={(e) => { e.target.style.borderColor = errors.firstName ? '#FF4444' : 'var(--border)'; }}
          />
          {errors.firstName && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#FF4444', marginTop: '3px' }}>{errors.firstName}</p>}
        </div>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            style={inputStyle()}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
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
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.email ? '#FF4444' : 'var(--border)'; }}
        />
        {errors.email && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#FF4444', marginTop: '3px' }}>{errors.email}</p>}
        {authError && (
          <div style={{ marginTop: '4px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#FF4444' }}>{authError}</p>
            {onSignInInstead && (
              <span
                onClick={onSignInInstead}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--accent)', cursor: 'pointer', display: 'inline-block', marginTop: '2px' }}
              >
                Sign in instead &rarr;
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '4px' }}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
          placeholder="Mobile number (optional)"
          style={inputStyle('phone')}
          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlur={(e) => { e.target.style.borderColor = errors.phone ? '#FF4444' : 'var(--border)'; }}
        />
        {errors.phone && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#FF4444', marginTop: '3px' }}>{errors.phone}</p>}
      </div>

      {/* SMS toggle */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '10px 12px',
        marginTop: '4px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ marginRight: '10px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text)' }}>Test reminders via text</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text2)', marginTop: '2px' }}>Retest every 8 weeks. No spam.</p>
        </div>
        <button
          type="button"
          onClick={() => setSmsOptIn(!smsOptIn)}
          style={{
            position: 'relative',
            width: '44px',
            height: '26px',
            borderRadius: '13px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
            flexShrink: 0,
            background: smsOptIn ? 'var(--accent)' : 'var(--border)',
          }}
        >
          <span style={{
            position: 'absolute',
            top: '3px',
            left: smsOptIn ? '22px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--bg)',
          background: loading ? 'rgba(0,184,162,0.5)' : 'var(--accent)',
          border: 'none',
          borderRadius: '10px',
          padding: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: 'var(--shadow-accent)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
      >
        {loading ? 'Generating...' : 'Unlock My Full Report →'}
      </button>

      {/* Skip link */}
      <button
        type="button"
        onClick={onSkip}
        style={{
          display: 'block',
          margin: '12px auto 0',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text2)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
      >
        View report without saving &rarr;
      </button>
    </div>
  );
}
