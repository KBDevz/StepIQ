import { useState, useEffect, useRef } from 'react';
import { getLevelProtocol } from '../../utils/protocol';

interface InlineCountdownProps {
  level: number;
  onComplete: () => void;
  playCountBeep: (isLast: boolean) => void;
}

export default function InlineCountdown({ level, onComplete, playCountBeep }: InlineCountdownProps) {
  const [count, setCount] = useState(3);
  const [showGo, setShowGo] = useState(false);
  const proto = getLevelProtocol(level);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const playCountBeepRef = useRef(playCountBeep);
  playCountBeepRef.current = playCountBeep;

  useEffect(() => {
    setCount(3);
    setShowGo(false);
    let done = false;
    playCountBeepRef.current(false);

    const interval = setInterval(() => {
      setCount((c) => {
        const next = c - 1;
        if (next <= 0) {
          clearInterval(interval);
          setShowGo(true);
          playCountBeepRef.current(true);
          setTimeout(() => {
            if (!done) {
              done = true;
              onCompleteRef.current();
            }
          }, 400);
          return 0;
        }
        playCountBeepRef.current(next <= 1);
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      done = true;
    };
  }, [level]);

  return (
    <div className="inline-countdown-overlay">
      <p
        className="font-mono"
        style={{
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--text2)',
          marginBottom: '8px',
        }}
      >
        Level {level} Starting
      </p>
      <p
        className="font-mono"
        style={{
          fontSize: '0.75rem',
          color: 'var(--text2)',
          marginBottom: '24px',
        }}
      >
        {proto.spm} steps/min · {proto.bpm} BPM
      </p>
      <span
        className="font-serif"
        style={{
          fontSize: '8rem',
          lineHeight: 1,
          fontWeight: 700,
          color: showGo ? 'var(--text)' : 'var(--accent)',
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 0.15s',
        }}
      >
        {showGo ? 'GO' : count}
      </span>
    </div>
  );
}
