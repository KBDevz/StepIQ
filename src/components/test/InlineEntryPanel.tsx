import { useState, useEffect, useRef } from 'react';
import { RPE_SCALE } from '../../utils/protocol';

interface InlineEntryPanelProps {
  level: number;
  onConfirm: (hr: number, rpe: number) => void;
}

export default function InlineEntryPanel({ level, onConfirm }: InlineEntryPanelProps) {
  const [phase, setPhase] = useState<'hr' | 'rpe'>('hr');
  const [hrValue, setHrValue] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const hrNum = parseInt(hrValue, 10);
  const hrValid = !isNaN(hrNum) && hrNum >= 40 && hrNum <= 230;

  useEffect(() => {
    setPhase('hr');
    setHrValue('');
  }, [level]);

  function handleKey(key: string) {
    if (key === 'back') {
      setHrValue((v) => v.slice(0, -1));
    } else {
      setHrValue((v) => (v.length < 3 ? v + key : v));
    }
  }

  function handleHRConfirm() {
    if (hrValid) setPhase('rpe');
  }

  function handleRPESelect(rpe: number) {
    onConfirm(hrNum, rpe);
  }

  const NUM_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0'];

  return (
    <div
      ref={panelRef}
      className="inline-entry-panel animate-slideUp"
    >
      {phase === 'hr' ? (
        <>
          <div style={{ marginBottom: '6px' }}>
            <p className="font-mono" style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Level {level} Complete
            </p>
            <p className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--text2)', marginTop: '2px' }}>
              Enter the HR you recorded in the final 15 seconds
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div>
              <p className="font-mono" style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)' }}>
                Heart Rate
              </p>
              <p className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text2)', fontStyle: 'italic', marginTop: '1px' }}>
                Recorded from final 15 seconds of the level
              </p>
            </div>
            <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', minWidth: '70px', textAlign: 'right' }}>
              {hrValue || '—'}
              <span style={{ fontSize: '0.6rem', fontWeight: 400, color: 'var(--text2)', marginLeft: '4px' }}>bpm</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {NUM_KEYS.map((key) => {
              if (key === 'back') {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKey('back')}
                    style={compactBtnStyle('var(--surface2)', 'var(--text2)')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKey(key)}
                  style={compactBtnStyle('var(--surface2)', 'var(--text)')}
                >
                  {key}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleHRConfirm}
              disabled={!hrValid}
              style={{
                ...compactBtnStyle(hrValid ? 'var(--accent-glow)' : 'var(--surface2)', hrValid ? 'var(--accent)' : 'var(--text2)'),
                opacity: hrValid ? 1 : 0.4,
                cursor: hrValid ? 'pointer' : 'not-allowed',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              Next →
            </button>
          </div>

          {hrValue && !hrValid && (
            <p className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--danger)', textAlign: 'center', marginTop: '4px' }}>
              Valid range: 40-230 bpm
            </p>
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p className="font-mono" style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)' }}>
              Rate Your Effort
            </p>
            <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--accent)' }}>
              HR: {hrNum} bpm ✓
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {RPE_SCALE.map((entry) => {
              const isStop = entry.value >= 7;
              return (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => handleRPESelect(entry.value)}
                  style={{
                    height: '52px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isStop ? 'var(--warn-glow)' : 'var(--surface2)',
                    color: isStop ? 'var(--warn)' : 'var(--text)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontFamily: "'IBM Plex Mono', monospace",
                    transition: 'background 0.15s, transform 0.1s',
                  }}
                  onMouseDown={(e) => { (e.target as HTMLElement).style.transform = 'scale(0.93)'; }}
                  onMouseUp={(e) => { (e.target as HTMLElement).style.transform = ''; }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}>{entry.value}</span>
                  <span style={{ fontSize: '0.42rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px', opacity: 0.7 }}>
                    {entry.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function compactBtnStyle(bg: string, color: string): React.CSSProperties {
  return {
    height: '44px',
    borderRadius: '10px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '1.1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    background: bg,
    color: color,
    transition: 'background 0.15s, transform 0.1s',
  };
}
