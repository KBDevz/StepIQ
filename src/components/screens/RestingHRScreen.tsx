import { useState } from 'react';
import Button from '../ui/Button';
import HRKeypad from '../test/HRKeypad';

interface RestingHRScreenProps {
  onConfirm: (hr: number) => void;
  onSkip: () => void;
}

export default function RestingHRScreen({ onConfirm, onSkip }: RestingHRScreenProps) {
  const [value, setValue] = useState('');
  const num = parseInt(value, 10);
  const valid = !isNaN(num) && num >= 30 && num <= 120;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 28px 28px' }}>
      {/* Eyebrow */}
      <span
        className="font-mono"
        style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#00E5A0', marginBottom: '8px' }}
      >
        Before You Begin
      </span>

      <h2 className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
        Resting Heart Rate
      </h2>
      <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', textAlign: 'center', maxWidth: '300px', lineHeight: 1.6, marginBottom: '24px' }}>
        Sit quietly for 1 minute, then enter your resting beats per minute. This provides context for your results.
      </p>

      {/* HR display */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <span className="font-mono" style={{ fontSize: '3rem', fontWeight: 700, color: '#EEF2FF', fontVariantNumeric: 'tabular-nums' }}>
          {value || '—'}
        </span>
        <p className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', marginTop: '2px' }}>bpm</p>
      </div>

      <HRKeypad
        value={value}
        onChange={setValue}
        onConfirm={() => valid && onConfirm(num)}
        confirmDisabled={!valid}
      />

      {value && !valid && (
        <p className="font-mono" style={{ fontSize: '0.65rem', color: '#FF4444', marginTop: '10px' }}>Valid range: 30–120 bpm</p>
      )}

      <div style={{ width: '100%', marginTop: '20px' }}>
        <Button variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </div>
  );
}
