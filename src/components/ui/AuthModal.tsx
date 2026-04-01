import { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onSignUp: (params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobile?: string;
    smsOptIn?: boolean;
  }) => Promise<{ error: string | null }>;
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  onResetPassword: (email: string) => Promise<{ error: string | null }>;
  initialMode?: 'signin' | 'signup';
  initialEmail?: string;
}

export default function AuthModal({
  onClose,
  onSignUp,
  onSignIn,
  onResetPassword,
  initialMode = 'signin',
  initialEmail = '',
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [welcomeBack, setWelcomeBack] = useState(false);

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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#00E5A0';
    e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field?: string) => {
    e.target.style.borderColor = errors[field || ''] ? '#FF4444' : '#1C2F4A';
    e.target.style.boxShadow = 'none';
  };

  const validateSignUp = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'Required';
    if (!email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email';
    if (!password.trim()) errs.password = 'Required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    if (smsOptIn && !mobile.trim()) errs.mobile = 'Required for SMS reminders';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSignIn = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Required';
    if (!password.trim()) errs.password = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateSignUp()) return;
    setLoading(true);
    setErrors({});
    const result = await onSignUp({
      email, password, firstName, lastName,
      mobile: mobile || undefined,
      smsOptIn,
    });
    setLoading(false);
    if (result.error) {
      const msg = result.error.toLowerCase();
      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('already exists')) {
        // Switch to sign-in with the email pre-filled
        setErrors({ emailHint: 'An account with this email already exists.' });
        setWelcomeBack(true);
        setMode('signin');
        setPassword('');
      } else {
        setErrors({ form: result.error });
      }
    } else {
      onClose();
    }
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;
    setLoading(true);
    setErrors({});
    const result = await onSignIn(email, password);
    setLoading(false);
    if (result.error) {
      setErrors({ form: result.error });
    } else {
      onClose();
    }
  };

  const handleForgot = async () => {
    if (!email.trim()) { setErrors({ email: 'Enter your email' }); return; }
    setLoading(true);
    setErrors({});
    const result = await onResetPassword(email);
    setLoading(false);
    if (result.error) {
      setErrors({ form: result.error });
    } else {
      setSuccess('Check your email for a password reset link');
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(6,12,24,0.85)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fadeIn"
        style={{
          width: '100%', maxWidth: '420px', margin: '0 24px',
          background: 'linear-gradient(145deg, #0D2238 0%, #0D1829 100%)',
          border: '1px solid rgba(0,229,160,0.25)',
          borderRadius: '20px', padding: '36px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #00E5A0, transparent)' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#5A7090', fontSize: '1.2rem', lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Header */}
        <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          {mode === 'signup' ? 'Create Account' : mode === 'signin' ? 'Welcome Back' : 'Reset Password'}
        </h2>
        <p className="font-mono" style={{ fontSize: '0.72rem', color: mode === 'signin' && welcomeBack ? '#00E5A0' : '#5A7090', lineHeight: 1.7, marginBottom: '24px' }}>
          {mode === 'signup'
            ? 'Sign up to save your results and track progress over time.'
            : mode === 'signin'
              ? (welcomeBack ? 'Welcome back — sign in to access your results' : 'Sign in to access your saved results.')
              : 'Enter your email to receive a password reset link.'}
        </p>

        {errors.form && (
          <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
            <p className="font-mono" style={{ fontSize: '0.7rem', color: '#FF4444' }}>{errors.form}</p>
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
            <p className="font-mono" style={{ fontSize: '0.7rem', color: '#00E5A0' }}>{success}</p>
          </div>
        )}

        {/* ── Sign Up Form ── */}
        {mode === 'signup' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <input type="text" value={firstName} onChange={e => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })); }} placeholder="First name" style={inputStyle('firstName')} onFocus={handleFocus} onBlur={e => handleBlur(e, 'firstName')} />
                {errors.firstName && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.firstName}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" style={inputStyle()} onFocus={handleFocus} onBlur={e => handleBlur(e)} />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} placeholder="Email address" style={inputStyle('email')} onFocus={handleFocus} onBlur={e => handleBlur(e, 'email')} />
              {errors.email && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} placeholder="Password" style={inputStyle('password')} onFocus={handleFocus} onBlur={e => handleBlur(e, 'password')} />
              {errors.password && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <div style={{ marginBottom: '4px' }}>
              <input type="tel" value={mobile} onChange={e => { setMobile(e.target.value); setErrors(p => ({ ...p, mobile: '' })); }} placeholder="Mobile number (optional)" style={inputStyle('mobile')} onFocus={handleFocus} onBlur={e => handleBlur(e, 'mobile')} />
              {errors.mobile && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.mobile}</p>}
            </div>

            {/* SMS toggle */}
            <div style={{ background: 'rgba(6,12,24,0.5)', border: '1px solid #1C2F4A', borderRadius: '10px', padding: '12px 14px', marginTop: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ marginRight: '12px' }}>
                <p className="font-mono" style={{ fontSize: '0.75rem', color: '#EEF2FF' }}>Retest reminders via text</p>
                <p className="font-mono" style={{ fontSize: '0.62rem', color: '#5A7090', marginTop: '2px' }}>We'll remind you to retest every 8 weeks.</p>
              </div>
              <button
                type="button"
                onClick={() => setSmsOptIn(!smsOptIn)}
                style={{ position: 'relative', width: '44px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0, background: smsOptIn ? '#00E5A0' : '#1C2F4A' }}
              >
                <span style={{ position: 'absolute', top: '3px', left: smsOptIn ? '22px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
              </button>
            </div>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="font-mono uppercase"
              style={{
                width: '100%', padding: '16px',
                background: loading ? 'rgba(0,229,160,0.4)' : '#00E5A0',
                color: '#060C18', fontSize: '0.8rem', fontWeight: 700,
                letterSpacing: '0.12em', borderRadius: '10px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 30px rgba(0,229,160,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="font-mono" style={{ fontSize: '0.7rem', color: '#5A7090', textAlign: 'center', marginTop: '16px' }}>
              Already have an account?{' '}
              <span onClick={() => { setMode('signin'); setErrors({}); setSuccess(''); }} style={{ color: '#00E5A0', cursor: 'pointer' }}>
                Sign in
              </span>
            </p>
            <p className="font-mono" style={{ fontSize: '0.65rem', textAlign: 'center', marginTop: '8px' }}>
              <span
                onClick={() => { setMode('forgot'); setErrors({}); setSuccess(''); }}
                style={{ color: '#5A7090', cursor: 'pointer', transition: 'color 0.2s, text-decoration 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#00E5A0'; (e.target as HTMLElement).style.textDecoration = 'underline'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5A7090'; (e.target as HTMLElement).style.textDecoration = 'none'; }}
              >
                Forgot your password?
              </span>
            </p>
          </>
        )}

        {/* ── Sign In Form ── */}
        {mode === 'signin' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '', emailHint: '' })); setWelcomeBack(false); }} placeholder="Email address" style={inputStyle('email')} onFocus={handleFocus} onBlur={e => handleBlur(e, 'email')} />
              {errors.email && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.email}</p>}
              {errors.emailHint && <p className="font-mono" style={{ fontSize: '0.7rem', color: '#FF8C42', marginTop: '4px' }}>{errors.emailHint}</p>}
            </div>

            <div style={{ marginBottom: '8px' }}>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }} placeholder="Password" style={inputStyle('password')} onFocus={handleFocus} onBlur={e => handleBlur(e, 'password')} />
              {errors.password && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <span
                onClick={() => { setMode('forgot'); setErrors({}); setSuccess(''); setWelcomeBack(false); }}
                className="font-mono"
                style={{ fontSize: '0.65rem', color: '#5A7090', cursor: 'pointer', transition: 'color 0.2s, text-decoration 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#00E5A0'; (e.target as HTMLElement).style.textDecoration = 'underline'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5A7090'; (e.target as HTMLElement).style.textDecoration = 'none'; }}
              >
                Forgot password?
              </span>
            </div>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className="font-mono uppercase"
              style={{
                width: '100%', padding: '16px',
                background: loading ? 'rgba(0,229,160,0.4)' : '#00E5A0',
                color: '#060C18', fontSize: '0.8rem', fontWeight: 700,
                letterSpacing: '0.12em', borderRadius: '10px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 30px rgba(0,229,160,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="font-mono" style={{ fontSize: '0.7rem', color: '#5A7090', textAlign: 'center', marginTop: '16px' }}>
              Don't have an account?{' '}
              <span onClick={() => { setMode('signup'); setErrors({}); setSuccess(''); }} style={{ color: '#00E5A0', cursor: 'pointer' }}>
                Sign up
              </span>
            </p>
          </>
        )}

        {/* ── Forgot Password Form ── */}
        {mode === 'forgot' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} placeholder="Email address" style={inputStyle('email')} onFocus={handleFocus} onBlur={e => handleBlur(e, 'email')} />
              {errors.email && <p className="font-mono" style={{ fontSize: '0.6rem', color: '#FF4444', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            <button
              onClick={handleForgot}
              disabled={loading}
              className="font-mono uppercase"
              style={{
                width: '100%', padding: '16px',
                background: loading ? 'rgba(0,229,160,0.4)' : '#00E5A0',
                color: '#060C18', fontSize: '0.8rem', fontWeight: 700,
                letterSpacing: '0.12em', borderRadius: '10px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 30px rgba(0,229,160,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="font-mono" style={{ fontSize: '0.7rem', color: '#5A7090', textAlign: 'center', marginTop: '16px' }}>
              <span onClick={() => { setMode('signin'); setErrors({}); setSuccess(''); }} style={{ color: '#00E5A0', cursor: 'pointer' }}>
                Back to sign in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
