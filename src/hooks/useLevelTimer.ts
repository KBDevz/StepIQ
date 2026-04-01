import { useState, useRef, useCallback, useEffect } from 'react';

export function useLevelTimer(onComplete: () => void) {
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef(0);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number) => {
      clear();
      setTotal(seconds);
      setRemaining(seconds);
      endTimeRef.current = Date.now() + seconds * 1000;

      intervalRef.current = window.setInterval(() => {
        const left = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0) {
          clear();
          onComplete();
        }
      }, 200);
    },
    [clear, onComplete],
  );

  const stop = useCallback(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  const progress = total > 0 ? remaining / total : 1;

  return { remaining, progress, start, stop };
}
