import { useState, useEffect, useRef } from 'react';

interface StepGuideProps {
  bpm: number;
}

const BEATS = [
  { call: 'Left Up', pill: 'Left Up', leftUp: true, rightUp: false },
  { call: 'Right Up', pill: 'Right Up', leftUp: true, rightUp: true },
  { call: 'Left Down', pill: 'Left Down', leftUp: false, rightUp: true },
  { call: 'Right Down', pill: 'Right Down', leftUp: false, rightUp: false },
] as const;

const PILLS = ['Left Up', 'Right Up', 'Left Down', 'Right Down'];

export default function StepGuide({ bpm }: StepGuideProps) {
  const [beat, setBeat] = useState(0);
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    const ms = 60000 / bpm;
    setBeat(0);
    setFlash(true);

    intervalRef.current = window.setInterval(() => {
      setBeat((b) => (b + 1) % 4);
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
    }, ms);

    const flashTimeout = setTimeout(() => setFlash(false), 120);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(flashTimeout);
    };
  }, [bpm]);

  const current = BEATS[beat];

  return (
    <div className="w-full max-w-[360px] bg-[#0D1829]/80 backdrop-blur-md border border-[#1C2F4A] rounded-2xl px-5 py-4">
      {/* Label */}
      <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-[0.15em] text-center mb-2.5">
        Step Pattern
      </p>

      {/* Foot diagram */}
      <div className="relative h-[72px] mx-auto w-[140px] mb-2.5">
        {/* Step platform */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[80px] h-[24px] rounded-md bg-[#152238] border border-[#1C2F4A]">
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-[#5A7090]/50 uppercase tracking-wider">
            Step
          </span>
        </div>

        {/* Floor line */}
        <div className="absolute bottom-[8px] left-0 right-0 h-[1px] bg-[#1C2F4A]" />

        {/* Left foot */}
        <div
          className="absolute transition-all duration-[120ms] ease-out rounded-lg flex items-center justify-center font-mono text-[10px] font-bold"
          style={{
            width: 20,
            height: 32,
            left: 38,
            bottom: current.leftUp ? 38 : 10,
            backgroundColor: current.leftUp ? '#00E5A0' : '#152238',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: current.leftUp ? '#00E5A0' : '#1C2F4A',
            color: current.leftUp ? '#060C18' : '#5A7090',
            boxShadow: current.leftUp ? '0 0 10px rgba(0,229,160,0.4)' : 'none',
          }}
        >
          L
        </div>

        {/* Right foot */}
        <div
          className="absolute transition-all duration-[120ms] ease-out rounded-lg flex items-center justify-center font-mono text-[10px] font-bold"
          style={{
            width: 20,
            height: 32,
            right: 38,
            bottom: current.rightUp ? 38 : 10,
            backgroundColor: current.rightUp ? '#00E5A0' : '#152238',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: current.rightUp ? '#00E5A0' : '#1C2F4A',
            color: current.rightUp ? '#060C18' : '#5A7090',
            boxShadow: current.rightUp ? '0 0 10px rgba(0,229,160,0.4)' : 'none',
          }}
        >
          R
        </div>
      </div>

      {/* Call text */}
      <p
        className="font-serif text-lg text-[#00E5A0] font-bold text-center mb-2.5 transition-opacity duration-100"
        style={{ opacity: flash ? 0.5 : 1 }}
      >
        {current.call}
      </p>

      {/* Sequence pills */}
      <div className="flex gap-1.5 justify-center mb-2">
        {PILLS.map((pill, i) => (
          <span
            key={pill}
            className={`px-1.5 py-0.5 rounded-md font-mono text-[9px] transition-all duration-100 ${
              i === beat
                ? 'bg-[#00E5A0]/20 text-[#00E5A0] border border-[#00E5A0]/40'
                : 'bg-[#152238]/50 text-[#5A7090]/60 border border-transparent'
            }`}
          >
            {pill}
          </span>
        ))}
      </div>

      {/* Hint */}
      <p className="font-mono text-[9px] text-[#5A7090]/60 text-center">
        Step to each beat — one full cycle = 4 beats
      </p>
    </div>
  );
}
