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

export default function InstructionsScreen({ state, onBegin, onBack }: InstructionsScreenProps) {
  const betaBlockerFormula = state.betaBlocker
    ? `Your predicted max HR is calculated using the Londeree formula: 164 − (0.7 × ${state.age}) = ${state.maxHR} bpm. Stop HR (85%): ${state.stopHR} bpm`
    : null;

  const instructions = [
    {
      title: 'The Step',
      text: 'Use a step at your selected height. For best accuracy, 30cm (12 inches) is recommended. Standard home stairs are typically 7–9 inches and are not suitable — a fitness step platform works perfectly.',
    },
    {
      title: 'The Pattern',
      text: 'Step to the beat: Left up, Right up, Left down, Right down. One full cycle = 4 beats. Maintain upright posture and avoid talking during stages.',
    },
    {
      title: 'The Levels',
      text: 'Most individuals will not complete all 5 levels — this is normal and expected.',
      hasPills: true,
    },
    {
      title: 'Recording Your Data',
      text: 'During the final 15 seconds of each level the app will alert you to check your heart rate. Record it from your monitor. Then select your RPE (effort level) before the next level begins.',
    },
    {
      title: 'Stop Conditions',
      text: betaBlockerFormula
        ? `The test stops automatically once at least 3 levels are completed AND either:\n· Your HR reaches 85% of your predicted max (${state.maxHR} bpm, so stop HR = ${state.stopHR} bpm)\n· Your RPE reaches 7 or above\nYou may also end the test early at any time.\n\n${betaBlockerFormula}`
        : `The test stops automatically once at least 3 levels are completed AND either:\n· Your HR reaches 85% of your predicted max (220 − ${state.age} = ${state.maxHR} bpm, so stop HR = ${state.stopHR} bpm)\n· Your RPE reaches 7 or above\nYou may also end the test early at any time.`,
    },
    {
      title: 'Safety',
      text: 'Stop immediately if you experience chest pain, dizziness, severe shortness of breath, or feel unwell. This test is submaximal — you should never reach complete exhaustion.',
    },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 28px 0',
    }}>
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
        Protocol
      </span>

      <h2
        className="font-serif"
        style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}
      >
        Chester Step Test
      </h2>
      <p
        className="font-mono"
        style={{ fontSize: '0.7rem', color: 'var(--text2)', marginBottom: '28px' }}
      >
        5 Levels, 2 min each
      </p>

      {state.betaBlocker && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'var(--warn-glow)',
            border: '1px solid rgba(255,140,66,0.25)',
          }}
        >
          <p className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--warn)', lineHeight: 1.6 }}>
            Beta blocker adjustment active — using Londeree formula for max HR calculation
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '28px' }}>
        {instructions.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', gap: '12px', padding: '12px 0' }}>
              <span
                className="font-mono"
                style={{
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-dark)',
                  border: '1px solid rgba(0,229,160,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  marginTop: '1px',
                }}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <p
                  className="font-mono"
                  style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  {item.title}
                </p>
                {item.hasPills && (
                  <>
                    <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '8px' }}>
                      5 levels, 2 minutes each, increasing in pace:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      {LEVEL_PILLS.map((pill) => (
                        <span
                          key={pill.label}
                          className="font-mono"
                          style={{
                            fontSize: '0.6rem',
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
                  </>
                )}
                <p
                  className="font-mono"
                  style={{ fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.6, whiteSpace: 'pre-line' }}
                >
                  {item.text}
                </p>
              </div>
            </div>
            {i < instructions.length - 1 && (
              <div style={{ height: '1px', background: 'var(--border)', marginLeft: '36px', opacity: 0.5 }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '40px' }}>
        <Button onClick={onBegin}>Continue</Button>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
