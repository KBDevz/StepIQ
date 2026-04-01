import { useState } from 'react';

interface SetPasswordPageProps {
  onUpdatePassword: (password: string) => Promise<{ error: string | null }>;
  onComplete: () => void;
}

export default function SetPasswordPage({ onUpdatePassword, onComplete }: SetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    const result = await onUpdatePassword(password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(28,47,74,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(28,47,74,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(6,12,24,0) 30%, rgba(6,12,24,0.6) 60%, #060C18 100%)' }} />

      <div className="relative z-10 flex items-center justify-center min-h-screen" style={{ padding: '24px' }}>
        <div
          className="animate-fadeIn"
          style={{
            width: '100%', maxWidth: '420px',
            background: 'linear-gradient(145deg, #0D2238 0%, #0D1829 100%)',
            border: '1px solid rgba(0,229,160,0.25)',
            borderRadius: '20px', padding: '40px 36px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #00E5A0, transparent)' }} />

          {/* Logo */}
          <div className="flex items-center gap-3" style={{ marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,229,160,0.12)', border: '1px solid rgba(0,229,160,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-serif" style={{ fontSize: '1.4rem', color: '#fff' }}>StepIQ</span>
          </div>

          {success ? (
            <>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,229,160,0.15)', border: '1px solid rgba(0,229,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '8px' }}>
                Password set!
              </h2>
              <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', textAlign: 'center', lineHeight: 1.7 }}>
                Redirecting to your dashboard...
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                Set Your Password
              </h2>
              <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', lineHeight: 1.7, marginBottom: '24px' }}>
                Your cardiovascular fitness results are saved and ready. Set a password to access your StepIQ dashboard anytime.
              </p>

              {error && (
                <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
                  <p className="font-mono" style={{ fontSize: '0.7rem', color: '#FF4444' }}>{error}</p>
                </div>
              )}

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Choose a password (min 8 chars)"
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                  style={{
                    width: '100%',
                    background: 'rgba(6,12,24,0.8)',
                    border: `1px solid ${error ? '#FF4444' : '#1C2F4A'}`,
                    borderRadius: '10px',
                    padding: '13px 48px 13px 16px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.85rem',
                    color: '#EEF2FF',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#00E5A0'; e.target.style.boxShadow = '0 0 0 2px rgba(0,229,160,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = error ? '#FF4444' : '#1C2F4A'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#5A7090',
                    fontSize: '0.65rem', fontFamily: 'IBM Plex Mono, monospace',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

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
                  boxShadow: '0 0 30px rgba(0,229,160,0.3)',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? 'Setting password...' : 'Set Password & Continue'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
