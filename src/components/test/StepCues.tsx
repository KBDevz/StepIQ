interface StepCuesProps {
  activeBeat: number;
}

const CUES = [
  { arrow: '↑', label: 'L UP' },
  { arrow: '↑', label: 'R UP' },
  { arrow: '↓', label: 'L DOWN' },
  { arrow: '↓', label: 'R DOWN' },
] as const;

export default function StepCues({ activeBeat }: StepCuesProps) {
  return (
    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
      {CUES.map((cue, i) => {
        const active = activeBeat === i;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: '72px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              background: active ? 'var(--accent-glow)' : 'transparent',
              border: active ? '1px solid rgba(0,229,160,0.5)' : '1px solid transparent',
              transform: active ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.08s ease-out',
            }}
          >
            <span
              style={{
                fontSize: active ? '28px' : '20px',
                lineHeight: 1,
                color: active ? 'var(--accent)' : 'var(--border)',
                filter: active ? 'drop-shadow(0 0 8px rgba(0,229,160,0.5))' : 'none',
                fontWeight: 700,
                transition: 'all 0.08s ease-out',
              }}
            >
              {cue.arrow}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: active ? '0.6rem' : '0.55rem',
                fontWeight: active ? 700 : 400,
                textTransform: 'uppercase',
                color: active ? 'var(--accent)' : 'var(--border)',
                letterSpacing: '0.06em',
                marginTop: '6px',
                transition: 'all 0.08s ease-out',
              }}
            >
              {cue.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
