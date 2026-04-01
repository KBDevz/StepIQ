import { useState } from 'react';
import Badge from '../ui/Badge';
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
    <div className="flex flex-col items-center px-5 py-8 min-h-screen">
      <Badge>Before You Begin</Badge>

      <h2 className="font-serif text-2xl text-[#EEF2FF] mt-4 mb-2">Resting Heart Rate</h2>
      <p className="font-mono text-xs text-[#5A7090] text-center mb-8 max-w-[300px] leading-relaxed">
        Sit quietly for 1 minute, then enter your resting beats per minute. This provides context for your results.
      </p>

      <div className="mb-6">
        <div className="text-center mb-1">
          <span className="font-mono text-5xl text-[#EEF2FF] tabular-nums">
            {value || '—'}
          </span>
        </div>
        <p className="font-mono text-xs text-[#5A7090] text-center">bpm</p>
      </div>

      <HRKeypad
        value={value}
        onChange={setValue}
        onConfirm={() => valid && onConfirm(num)}
        confirmDisabled={!valid}
      />

      {value && !valid && (
        <p className="mt-3 font-mono text-xs text-[#FF4444]">Valid range: 30-120 bpm</p>
      )}

      <div className="mt-auto pt-6 w-full">
        <Button variant="ghost" onClick={onSkip}>Skip</Button>
      </div>
    </div>
  );
}
