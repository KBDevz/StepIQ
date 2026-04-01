import { useState, useEffect, useRef } from 'react';
import Badge from '../ui/Badge';
import { getLevelProtocol } from '../../utils/protocol';

interface PreLevelScreenProps {
  level: number;
  countdownSeconds: number;
  onComplete: () => void;
  playCountBeep: (isLast: boolean) => void;
}

export default function PreLevelScreen({ level, countdownSeconds, onComplete, playCountBeep }: PreLevelScreenProps) {
  const [count, setCount] = useState(countdownSeconds);
  const proto = getLevelProtocol(level);

  // Use refs to avoid the effect depending on callback identity
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const playCountBeepRef = useRef(playCountBeep);
  playCountBeepRef.current = playCountBeep;

  useEffect(() => {
    setCount(countdownSeconds);
    let done = false;

    const interval = setInterval(() => {
      setCount((c) => {
        const next = c - 1;
        if (next <= 0) {
          clearInterval(interval);
          if (!done) {
            done = true;
            setTimeout(() => onCompleteRef.current(), 0);
          }
          return 0;
        }
        playCountBeepRef.current(next <= 1);
        return next;
      });
    }, 1000);

    playCountBeepRef.current(countdownSeconds <= 1);

    return () => {
      clearInterval(interval);
      done = true;
    };
  }, [countdownSeconds]);

  return (
    <div className="flex flex-col items-center justify-center px-5 min-h-screen">
      <Badge>Level {level} of 5</Badge>

      <p className="font-mono text-sm text-[#5A7090] mt-6 mb-2">
        {proto.spm} steps/min — {proto.bpm} BPM
      </p>

      <div className="relative my-8">
        <span
          className="font-serif text-[120px] leading-none text-[#EEF2FF] tabular-nums transition-transform duration-200"
          style={{ transform: `scale(${count <= 3 ? 1.1 : 1})` }}
        >
          {count}
        </span>
      </div>

      <p className="font-mono text-xs text-[#5A7090]">Get ready...</p>
    </div>
  );
}
