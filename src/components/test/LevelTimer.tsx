interface LevelTimerProps {
  remaining: number;
  progress: number;
  alert?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LevelTimer({ remaining, progress, alert = false }: LevelTimerProps) {
  return (
    <div style={{ width: '100%' }}>
      <p
        className="font-mono"
        style={{
          fontSize: '5rem',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
          color: alert ? 'var(--warn)' : 'var(--text)',
          animation: alert ? 'timerPulse 0.8s ease-in-out infinite' : 'none',
          transition: 'color 0.3s',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        {formatTime(remaining)}
      </p>
      <div style={{ width: '100%', height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '2px',
            width: `${progress * 100}%`,
            background: alert ? 'var(--warn)' : 'var(--accent)',
            transition: 'width 0.5s linear, background 0.3s',
          }}
        />
      </div>
      <style>{`
        @keyframes timerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
