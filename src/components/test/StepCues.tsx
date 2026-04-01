interface StepCuesProps {
  activeBeat: number; // 0-3, -1 for none
}

const CUES = [
  { arrow: '↑', label: 'L UP' },
  { arrow: '↑', label: 'R UP' },
  { arrow: '↓', label: 'L DOWN' },
  { arrow: '↓', label: 'R DOWN' },
] as const;

export default function StepCues({ activeBeat }: StepCuesProps) {
  return (
    <div style={{ width: '100%', marginBottom: '8px' }}>
      {/* 4 directional cues */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
        {CUES.map((cue, i) => {
          const active = activeBeat === i;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 4px',
                borderRadius: '12px',
                background: active ? 'rgba(0,229,160,0.12)' : 'transparent',
                border: active ? '1px solid rgba(0,229,160,0.4)' : '1px solid transparent',
                transition: 'all 0.08s ease-out',
                transform: active ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <span
                style={{
                  fontSize: active ? '28px' : '20px',
                  lineHeight: 1,
                  color: active ? '#00E5A0' : '#1C2F4A',
                  filter: active ? 'drop-shadow(0 0 8px rgba(0,229,160,0.5))' : 'none',
                  transition: 'all 0.08s ease-out',
                  fontWeight: 700,
                }}
              >
                {cue.arrow}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.6rem',
                  fontWeight: active ? 700 : 400,
                  color: active ? '#00E5A0' : '#1C2F4A',
                  letterSpacing: '0.06em',
                  marginTop: '4px',
                  transition: 'all 0.08s ease-out',
                }}
              >
                {cue.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mini foot diagram */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '8px' }}>
        {/* Left foot */}
        <div
          style={{
            width: '18px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            fontWeight: 700,
            transition: 'all 0.12s ease-out',
            // Up on beats 0 and 1, down on 2 and 3
            transform: (activeBeat === 0 || activeBeat === 1) ? 'translateY(-6px)' : 'translateY(0)',
            background: (activeBeat === 0 || activeBeat === 1) ? '#00E5A0' : '#152238',
            border: (activeBeat === 0 || activeBeat === 1) ? '1px solid #00E5A0' : '1px solid #1C2F4A',
            color: (activeBeat === 0 || activeBeat === 1) ? '#060C18' : '#5A7090',
            boxShadow: (activeBeat === 0 || activeBeat === 1) ? '0 0 8px rgba(0,229,160,0.4)' : 'none',
          }}
        >
          L
        </div>
        {/* Right foot */}
        <div
          style={{
            width: '18px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            fontWeight: 700,
            transition: 'all 0.12s ease-out',
            // Up on beats 1 and 2, down on 3 and 0
            transform: (activeBeat === 1 || activeBeat === 2) ? 'translateY(-6px)' : 'translateY(0)',
            background: (activeBeat === 1 || activeBeat === 2) ? '#00E5A0' : '#152238',
            border: (activeBeat === 1 || activeBeat === 2) ? '1px solid #00E5A0' : '1px solid #1C2F4A',
            color: (activeBeat === 1 || activeBeat === 2) ? '#060C18' : '#5A7090',
            boxShadow: (activeBeat === 1 || activeBeat === 2) ? '0 0 8px rgba(0,229,160,0.4)' : 'none',
          }}
        >
          R
        </div>
      </div>
    </div>
  );
}
