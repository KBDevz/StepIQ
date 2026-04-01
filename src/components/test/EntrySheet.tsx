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
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#060C18]/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-[460px] bg-[#0D1829] border-t border-[#1C2F4A] rounded-t-3xl px-5 pt-3 pb-8 animate-slideUp max-h-[85vh] overflow-y-auto"
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-[#1C2F4A]" />
        </div>

        {/* Header */}
        <div className="mb-5">
          <h3 className="font-serif text-xl text-[#EEF2FF]">Level {level} Complete</h3>
          <p className="font-mono text-xs text-[#5A7090] mt-1">
            {phase === 'hr'
              ? 'Enter your heart rate'
              : `HR ${hrNum} bpm logged — now select your effort level`}
          </p>
        </div>

        {phase === 'hr' ? (
          <>
            <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-2">
              Heart Rate (bpm)
            </p>
            <div className="text-center mb-4">
              <span className="font-mono text-5xl text-[#EEF2FF] tabular-nums">
                {hrValue || '—'}
              </span>
            </div>

            <HRKeypad
              value={hrValue}
              onChange={setHrValue}
            />

            {hrValue && !hrValid && (
              <p className="mt-2 font-mono text-xs text-[#FF4444] text-center">Valid range: 40-230 bpm</p>
            )}

            <div className="mt-5">
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
            <p className="font-mono text-xs text-[#5A7090] mb-4">
              How hard did that feel? Select the number that best matches your effort.
            </p>

            <RpeChart selected={rpeValue} onSelect={setRpeValue} />

            <div className="mt-5">
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
