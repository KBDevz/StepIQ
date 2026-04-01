import { useState, useRef, useCallback } from 'react';
import type { TestState } from '../../types';
import Button from '../ui/Button';
import FormCard from '../ui/FormCard';

interface SetupScreenProps {
  state: TestState;
  updateSetup: (fields: Partial<Pick<TestState, 'name' | 'age' | 'sex' | 'betaBlocker'>>) => void;
  toggleDevMode: () => void;
  onBegin: () => void;
}

export default function SetupScreen({ state, updateSetup, toggleDevMode, onBegin }: SetupScreenProps) {
  const [ageStr, setAgeStr] = useState(String(state.age));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const pressTimer = useRef<number | null>(null);

  const handleLongPressStart = useCallback(() => {
    pressTimer.current = window.setTimeout(() => {
      toggleDevMode();
    }, 600);
  }, [toggleDevMode]);

  const handleLongPressEnd = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const ageValid = state.age >= 13 && state.age <= 80;

  return (
    <div className="flex flex-col items-center px-5 py-8 min-h-screen">
      {/* Logo */}
      <div
        className="flex items-center gap-3 mb-2 select-none"
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
      >
        <div className="w-10 h-10 rounded-xl bg-[#00E5A0]/15 border border-[#00E5A0]/30 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-serif text-3xl text-[#EEF2FF] tracking-tight">StepIQ</h1>
      </div>
      <p className="font-mono text-xs text-[#5A7090] mb-6 tracking-wider uppercase">
        Quick Setup
      </p>

      {state.devMode && (
        <div className="mb-4 px-3 py-1.5 rounded-full bg-[#FF8C42]/10 border border-[#FF8C42]/30">
          <span className="font-mono text-xs text-[#FF8C42]">Dev Mode Active — 10s levels</span>
        </div>
      )}

      <FormCard className="w-full mb-4">
        <input
          type="text"
          value={state.name}
          onChange={(e) => updateSetup({ name: e.target.value })}
          placeholder="Your name (optional)"
          className="w-full bg-[#152238] border border-[#1C2F4A] rounded-xl px-4 py-3 font-mono text-sm text-[#EEF2FF] placeholder-[#5A7090]/50 focus:outline-none focus:border-[#00E5A0]/50 transition-colors"
        />
      </FormCard>

      <FormCard className="w-full mb-4">
        <label className="block font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-2">
          Age <span className="text-[#FF4444]">*</span>
        </label>
        <input
          type="number"
          inputMode="numeric"
          value={ageStr}
          onChange={(e) => {
            setAgeStr(e.target.value);
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n)) updateSetup({ age: n });
          }}
          min={13}
          max={80}
          placeholder="Enter your age"
          className={`w-full bg-[#152238] border rounded-xl px-4 py-3 font-mono text-sm text-[#EEF2FF] placeholder-[#5A7090]/50 focus:outline-none transition-colors ${
            ageStr && !ageValid ? 'border-[#FF4444]/50 focus:border-[#FF4444]' : 'border-[#1C2F4A] focus:border-[#00E5A0]/50'
          }`}
        />
        {ageStr && !ageValid && (
          <p className="mt-1.5 font-mono text-xs text-[#FF4444]">Age must be between 13 and 80</p>
        )}
      </FormCard>

      <FormCard className="w-full mb-4">
        <label className="block font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-2">
          Biological Sex <span className="text-[#FF4444]">*</span>
        </label>
        <div className="flex gap-2">
          {(['male', 'female'] as const).map((sex) => (
            <button
              key={sex}
              type="button"
              onClick={() => updateSetup({ sex })}
              className={`flex-1 py-3 rounded-xl font-mono text-sm capitalize transition-all ${
                state.sex === sex
                  ? 'bg-[#00E5A0]/15 border border-[#00E5A0]/40 text-[#00E5A0]'
                  : 'bg-[#152238] border border-[#1C2F4A] text-[#5A7090] hover:border-[#5A7090]'
              }`}
            >
              {sex}
            </button>
          ))}
        </div>
      </FormCard>

      {/* Advanced options disclosure */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 mb-4 font-mono text-xs text-[#5A7090] hover:text-[#EEF2FF] transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Advanced options
      </button>

      {showAdvanced && (
        <FormCard className="w-full mb-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className={`font-mono text-sm ${state.betaBlocker ? 'text-[#FF8C42]' : 'text-[#EEF2FF]'}`}>
                Beta blocker or HR medication
              </p>
              <p className="font-mono text-xs text-[#5A7090] mt-0.5">
                Adjusts max HR formula (Londeree)
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateSetup({ betaBlocker: !state.betaBlocker })}
              className={`relative w-12 h-7 rounded-full transition-all ${
                state.betaBlocker ? 'bg-[#FF8C42]' : 'bg-[#1C2F4A]'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                  state.betaBlocker ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
          {state.betaBlocker && (
            <div className="mt-3 p-3 rounded-lg bg-[#FF8C42]/10 border border-[#FF8C42]/20">
              <p className="font-mono text-xs text-[#FF8C42]">
                Max HR: 164 - (0.7 x {state.age}) = {state.maxHR} bpm
              </p>
            </div>
          )}
        </FormCard>
      )}

      <div className="mt-auto pt-4 w-full">
        <Button onClick={onBegin} disabled={!ageValid}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
