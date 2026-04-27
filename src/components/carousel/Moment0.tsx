import { useEffect } from 'react';

interface Moment0Props {
  onAdvance: () => void;
}

export default function Moment0({ onAdvance }: Moment0Props) {
  useEffect(() => {
    const timer = setTimeout(onAdvance, 1500);
    return () => clearTimeout(timer);
  }, [onAdvance]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(0,184,162,0.06) 0%, transparent 60%)',
      }} />

      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '32px' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: 'loadingRingSpin 2s linear infinite' }}>
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="80 226"
            style={{ animation: 'loadingRingPulse 1.5s ease-in-out infinite' }}
          />
        </svg>
      </div>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.82rem',
        letterSpacing: '0.06em',
        color: 'var(--text2)',
        textAlign: 'center',
        animation: 'loadingTextPulse 1.5s ease-in-out infinite',
      }}>
        Calculating your VO&#x2082; max...
      </p>

      <style>{`
        @keyframes loadingRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loadingRingPulse {
          0%, 100% { opacity: 0.6; stroke-dasharray: 60 226; }
          50% { opacity: 1; stroke-dasharray: 120 226; }
        }
        @keyframes loadingTextPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
