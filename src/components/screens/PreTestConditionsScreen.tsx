import { useState } from 'react';
import Button from '../ui/Button';

interface PreTestConditionsScreenProps {
  betaBlocker: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const CONDITIONS = [
  {
    label: 'No caffeine in the last 2 hours',
    sub: 'Coffee, tea, energy drinks, or pre-workout',
  },
  {
    label: 'No large meal in the last 2 hours',
    sub: 'A light snack is fine',
  },
  {
    label: 'No strenuous exercise in the last 24 hours',
    sub: 'Resistance training, HIIT, long runs, etc.',
  },
  {
    label: 'No current illness or acute fatigue',
    sub: 'Fever, cold, unusually poor sleep',
  },
  {
    label: 'Adequately hydrated',
    sub: 'Drink water before starting if unsure',
  },
];

export default function PreTestConditionsScreen({ betaBlocker, onContinue, onBack }: PreTestConditionsScreenProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(CONDITIONS.length).fill(false));

  const allChecked = checked.every(Boolean);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '32px 28px', flex: 1 }}>
      <span
        className="font-mono"
        style={{
          display: 'inline-block',
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--accent)',
          marginBottom: '12px',
        }}
      >
        Pre-Test Conditions
      </span>

      <h2
        className="font-serif"
        style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}
      >
        Confirm conditions
      </h2>
      <p
        className="font-mono"
        style={{ fontSize: '0.7rem', color: 'var(--text2)', marginBottom: '24px', lineHeight: 1.6 }}
      >
        These factors affect test accuracy. Confirm each before continuing.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {CONDITIONS.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              minHeight: '52px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: checked[i] ? 'var(--accent-dark)' : 'var(--surface2)',
              border: `1px solid ${checked[i] ? 'rgba(0,229,160,0.35)' : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: `2px solid ${checked[i] ? 'var(--accent)' : 'var(--border)'}`,
                background: checked[i] ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                marginTop: '2px',
              }}
            >
              {checked[i] && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#060C18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.75rem',
                  color: checked[i] ? 'var(--text)' : 'var(--text2)',
                  lineHeight: 1.5,
                  transition: 'color 0.2s',
                  display: 'block',
                }}
              >
                {item.label}
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.62rem',
                  color: 'var(--text2)',
                  lineHeight: 1.4,
                  opacity: 0.7,
                  display: 'block',
                  marginTop: '2px',
                }}
              >
                {item.sub}
              </span>
            </div>
          </button>
        ))}
      </div>

      {betaBlocker && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'var(--warn-glow)',
            border: '1px solid rgba(255,140,66,0.25)',
          }}
        >
          <p className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--warn)', lineHeight: 1.6 }}>
            Take your beta blocker at your usual time — do not skip or change your dose for this test.
          </p>
        </div>
      )}

      <div
        style={{
          padding: '12px 14px',
          borderRadius: '12px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          marginBottom: '24px',
        }}
      >
        <p className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text2)', lineHeight: 1.6 }}>
          For best comparison over time, try to test at the same time of day under similar conditions.
        </p>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button onClick={onContinue} disabled={!allChecked}>
          Continue
        </Button>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
