import type { TestState } from '../../types';
import Button from '../ui/Button';

interface InstructionsScreenProps {
  state: TestState;
  onBegin: () => void;
  onBack: () => void;
}

const LEVEL_PILLS = [
  { label: 'L1', rate: '15/min' },
  { label: 'L2', rate: '20/min' },
  { label: 'L3', rate: '25/min' },
  { label: 'L4', rate: '30/min' },
  { label: 'L5', rate: '35/min' },
];

const ICONS = {
  prepare: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  step: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
    </svg>
  ),
  pattern: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  form: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  levels: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  stop: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

export default function InstructionsScreen({ state, onBegin, onBack }: InstructionsScreenProps) {
  const cards = [
    { icon: ICONS.prepare, label: 'Prepare', desc: 'No caffeine, food, or hard exercise for 2 hours prior.' },
    { icon: ICONS.step, label: 'The Step', desc: '30cm (12in) fitness step platform. Home stairs are too short.' },
    { icon: ICONS.pattern, label: 'The Pattern', desc: 'Up, up, down, down — one cycle per 4 beats. If fatigued, you may alternate your lead foot between cycles.' },
    { icon: ICONS.form, label: 'Good Form', desc: "Stand upright, fully extend legs, don't talk during levels." },
    { icon: ICONS.levels, label: 'The Levels', desc: '5 levels × 2 minutes, increasing pace. Most complete 3–4.' },
    { icon: ICONS.stop, label: 'When to Stop', desc: `Stop immediately if dizzy, breathless, or unwell. The test ends when you reach both 80% of your max HR (${state.stopHR} bpm for you) and RPE 8 or above. Completing at least 3 levels gives the most accurate result — if you feel fine past 80% HR, keep going.` },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Fixed header */}
      <div style={{ flexShrink: 0, padding: '24px 24px 0' }}>
        <span
          className="font-mono"
          style={{
            display: 'inline-block',
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'var(--accent)',
            marginBottom: '8px',
          }}
        >
          Protocol
        </span>

        <h2
          className="font-serif"
          style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}
        >
          Chester Step Test
        </h2>
        <p
          className="font-mono"
          style={{ fontSize: '0.68rem', color: 'var(--text2)', marginBottom: '12px' }}
        >
          5 Levels · 2 min each
        </p>

        {/* Level pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {LEVEL_PILLS.map((pill) => (
            <span
              key={pill.label}
              className="font-mono"
              style={{
                fontSize: '0.58rem',
                color: 'var(--accent)',
                background: 'var(--accent-dark)',
                border: '1px solid rgba(0,229,160,0.2)',
                borderRadius: '20px',
                padding: '3px 10px',
              }}
            >
              {pill.label} · {pill.rate}
            </span>
          ))}
        </div>

        {state.betaBlocker && (
          <div
            style={{
              marginBottom: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'var(--warn-glow)',
              border: '1px solid rgba(255,140,66,0.25)',
            }}
          >
            <p className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--warn)', lineHeight: 1.5 }}>
              Beta blocker active — Londeree formula, stop HR {state.stopHR} bpm
            </p>
          </div>
        )}
      </div>

      {/* Scrollable cards */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '1px' }}>{card.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '2px',
              }}>
                {card.label}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                color: 'var(--text2)',
                lineHeight: 1.5,
              }}>
                {card.desc}
              </p>
            </div>
          </div>
        ))}
        {/* Spacer so last card isn't flush against buttons */}
        <div style={{ height: '8px', flexShrink: 0 }} />
      </div>

      {/* Fixed buttons */}
      <div style={{
        flexShrink: 0,
        padding: '12px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        <Button onClick={onBegin}>Continue</Button>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
