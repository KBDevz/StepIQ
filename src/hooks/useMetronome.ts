import { useRef, useCallback, useEffect } from 'react';

export function useMetronome() {
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const beatRef = useRef(0);
  const onBeatRef = useRef<((beat: number) => void) | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playBeep = useCallback(
    (freq: number, vol: number, duration = 0.07) => {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    },
    [getCtx],
  );

  const start = useCallback(
    (bpm: number, onBeat?: (beat: number) => void) => {
      // Stop any existing interval
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      beatRef.current = 0;
      onBeatRef.current = onBeat ?? null;

      const interval = 60000 / bpm;

      const tick = () => {
        const beat = beatRef.current % 4;
        const isAccent = beat === 0;
        playBeep(isAccent ? 880 : 660, isAccent ? 0.5 : 0.3);
        onBeatRef.current?.(beat);
        beatRef.current++;
      };

      // Fire first beat immediately
      tick();
      intervalRef.current = window.setInterval(tick, interval);
    },
    [playBeep],
  );

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    beatRef.current = 0;
  }, []);

  const playCountBeep = useCallback(
    (isLast: boolean) => {
      playBeep(isLast ? 1100 : 600, isLast ? 0.6 : 0.3, 0.12);
    },
    [playBeep],
  );

  // Ensure AudioContext is resumed on user interaction
  const resumeAudio = useCallback(() => {
    getCtx();
  }, [getCtx]);

  useEffect(() => {
    return () => {
      stop();
      ctxRef.current?.close();
    };
  }, [stop]);

  return { start, stop, playBeep, playCountBeep, resumeAudio };
}
