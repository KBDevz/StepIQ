import type { TestState } from '../../types';
import Button from '../ui/Button';

interface InstructionsScreenProps {
  state: TestState;
  onBegin: () => void;
  onBack: () => void;
}

export default function InstructionsScreen({ state, onBegin, onBack }: InstructionsScreenProps) {
  const instructions = [
    'Use a 30cm (12 inch) step. A standard stair step works.',
    'Step to the beat: Left up, Right up, Left down, Right down. One cycle per 4 beats.',
    'Each level is 2 minutes. At level end a panel slides up — enter your HR and select your RPE.',
    'Have a heart rate monitor ready — watch, chest strap, or manual pulse.',
    `Test stops at HR >= ${state.stopHR} bpm (85% max) after minimum 3 levels, or RPE >= 7.`,
    'Stop immediately if you feel chest pain, dizziness, or severe breathlessness.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '32px 28px', minHeight: '100%' }}>
      {/* Eyebrow */}
      <span
        className="font-mono"
        style={{
          display: 'inline-block',
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: '#00E5A0',
          marginBottom: '12px',
        }}
      >
        Protocol
      </span>

      <h2
        className="font-serif"
        style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}
      >
        Chester Step Test
      </h2>
      <p
        className="font-mono"
        style={{ fontSize: '0.7rem', color: '#5A7090', marginBottom: '28px' }}
      >
        5 Levels, 2 min each
      </p>

      {state.betaBlocker && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(255,140,66,0.08)',
            border: '1px solid rgba(255,140,66,0.25)',
          }}
        >
          <p className="font-mono" style={{ fontSize: '0.7rem', color: '#FF8C42', lineHeight: 1.6 }}>
            Beta blocker adjustment active — Max HR: 164 - (0.7 x {state.age}) = {state.maxHR} bpm
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '28px' }}>
        {instructions.map((text, i) => (
          <div key={i}>
            <div style={{ display: 'flex', gap: '12px', padding: '12px 0' }}>
              <span
                className="font-mono"
                style={{
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(0,229,160,0.08)',
                  border: '1px solid rgba(0,229,160,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#00E5A0',
                  marginTop: '1px',
                }}
              >
                {i + 1}
              </span>
              <p
                className="font-mono"
                style={{ fontSize: '0.78rem', color: '#EEF2FF', lineHeight: 1.6, flex: 1 }}
              >
                {text}
              </p>
            </div>
            {i < instructions.length - 1 && (
              <div style={{ height: '1px', background: '#1C2F4A', marginLeft: '36px', opacity: 0.5 }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button onClick={onBegin}>Begin Test</Button>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
