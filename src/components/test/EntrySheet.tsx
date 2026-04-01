import { useState } from 'react';
import Button from '../ui/Button';
import HRKeypad from './HRKeypad';
import RpeChart from './RpeChart';

interface EntrySheetProps {
  level: number;
  onConfirm: (hr: number, rpe: number) => void;
}

export default function EntrySheet({ level, onConfirm }: EntrySheetProps) {
  const [phase, setPhase] = useState<'hr' | 'rpe'>('hr');
  const [hrValue, setHrValue] = useState('');
  const [rpeValue, setRpeValue] = useState<number | null>(null);

  const hrNum = parseInt(hrValue, 10);
  const hrValid = !isNaN(hrNum) && hrNum >= 40 && hrNum <= 230;

  return (
    <div className="entry-sheet-overlay">
      {/* Backdrop */}
      <div className="entry-sheet-backdrop" />

      {/* Sheet */}
      <div
        className="entry-sheet-panel animate-slideUp"
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-1 rounded-full bg-[#1C2F4A]" />
        </div>

        {/* Header */}
        <div className="mb-6">
          <h3 className="font-serif text-2xl text-[#EEF2FF]">Level {level} Complete</h3>
          <p className="font-mono text-sm text-[#5A7090] mt-2">
            {phase === 'hr'
              ? 'Keep your heart rate monitor in view'
              : `HR ${hrNum} bpm logged — now select your effort level`}
          </p>
        </div>

        {phase === 'hr' ? (
          <>
            <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-1">
              Heart Rate (bpm)
            </p>
            <p className="font-mono text-[#5A7090] mb-3" style={{ fontSize: '0.62rem' }}>
              Read from your monitor or count for 6 seconds × 10
            </p>
            <div className="text-center mb-5">
              <span className="font-mono text-6xl text-[#EEF2FF] tabular-nums">
                {hrValue || '—'}
              </span>
            </div>

            <HRKeypad
              value={hrValue}
              onChange={setHrValue}
              showConfirm={false}
            />

            {hrValue && !hrValid && (
              <p className="mt-3 font-mono text-xs text-[#FF4444] text-center">Valid range: 40-230 bpm</p>
            )}

            <div className="mt-6">
              <Button onClick={() => setPhase('rpe')} disabled={!hrValid}>
                Next — Rate Effort
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-1">
              Rate of Perceived Exertion
            </p>
            <p className="font-mono text-sm text-[#5A7090] mb-5">
              How hard did that feel? Select the number that best matches your effort.
            </p>

            <RpeChart selected={rpeValue} onSelect={setRpeValue} />

            <div className="mt-6">
              <Button
                onClick={() => rpeValue !== null && onConfirm(hrNum, rpeValue)}
                disabled={rpeValue === null}
              >
                {rpeValue !== null ? `Confirm RPE ${rpeValue}` : 'Select RPE'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
