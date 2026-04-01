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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 28px', minHeight: '100%' }}>
      {/* Top content — vertically centered */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {/* Eyebrow */}
        <span
          className="font-mono"
          style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#00E5A0', marginBottom: '10px' }}
        >
          Before You Begin
        </span>

        <h2 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Resting Heart Rate
        </h2>
        <p className="font-mono" style={{ fontSize: '0.75rem', color: '#5A7090', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6, marginBottom: '28px' }}>
          Sit quietly for 1 minute, then enter your resting beats per minute from your heart rate monitor.
        </p>

        {/* HR display */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <span className="font-mono" style={{ fontSize: '4.5rem', fontWeight: 700, color: '#EEF2FF', fontVariantNumeric: 'tabular-nums' }}>
            {value || '—'}
          </span>
          <p className="font-mono" style={{ fontSize: '0.7rem', color: '#5A7090', marginTop: '4px' }}>bpm</p>
        </div>

        <HRKeypad
          value={value}
          onChange={setValue}
          showConfirm={false}
        />

        {value && !valid && (
          <p className="font-mono" style={{ fontSize: '0.65rem', color: '#FF4444', marginTop: '12px' }}>Valid range: 30–120 bpm</p>
        )}
      </div>

      {/* Bottom buttons — pinned to bottom */}
      <div style={{ width: '100%', paddingTop: '20px', paddingBottom: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button onClick={() => valid && onConfirm(num)} disabled={!valid}>
          Confirm
        </Button>
        <Button variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </div>
  );
}
