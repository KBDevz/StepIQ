import { useState, useEffect, useRef } from 'react';
import { getLevelProtocol } from '../../utils/protocol';

interface InlineCountdownProps {
  level: number;
  onComplete: () => void;
  playCountBeep: (isLast: boolean) => void;
}

export default function InlineCountdown({ level, onComplete, playCountBeep }: InlineCountdownProps) {
  const [count, setCount] = useState(3);
  const proto = getLevelProtocol(level);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    setCount(3);
    playCountBeep(false);

    const interval = setInterval(() => {
      setCount((c) => {
        const next = c - 1;
        if (next <= 0) {
          clearInterval(interval);
          if (!completedRef.current) {
            completedRef.current = true;
            setTimeout(onComplete, 0);
          }
          return 0;
        }
        playCountBeep(next <= 1);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [level, onComplete, playCountBeep]);

  return (
    <div className="fixed inset-0 z-50 bg-[#060C18]/90 backdrop-blur-sm flex flex-col items-center justify-center">
      <p className="font-mono text-sm text-[#5A7090] uppercase tracking-wider mb-2">
        Level {level} — {proto.spm} steps/min · {proto.bpm} BPM
      </p>
      <span
        className="font-serif text-[100px] leading-none text-[#EEF2FF] tabular-nums animate-pulse"
      >
        {count || 'GO'}
      </span>
    </div>
  );
}
