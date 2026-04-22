import { useRef, useCallback, useEffect } from 'react';

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume();
  }
  return sharedCtx;
}

function beep(freq: number, vol: number, duration: number) {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = 'sine';

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.01);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  } catch (e) {
    console.error('Beep failed:', e);
  }
}

function unlockAudio() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.001);
  ctx.resume();
}

const SCHEDULE_AHEAD = 0.1;
const LOOKAHEAD_MS = 25;

const BEAT_TONES: [number, number][] = [
  [880, 0.5],
  [880, 0.4],
  [560, 0.45],
  [560, 0.35],
];

export function useMetronome() {
  const schedulerRef = useRef<number | null>(null);
  const nextBeatTimeRef = useRef(0);
  const beatIndexRef = useRef(0);
  const bpmRef = useRef(60);
  const runningRef = useRef(false);
  const onBeatRef = useRef<((beat: number) => void) | null>(null);

  const scheduler = useCallback(() => {
    if (!runningRef.current) return;
    const ctx = getCtx();
    while (nextBeatTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD) {
      const pos = beatIndexRef.current % 4;
      const [freq, vol] = BEAT_TONES[pos];
      beep(freq, vol, 0.08);
      // Fire callback asynchronously so speech synthesis can't block the scheduler
      const beatPos = pos;
      setTimeout(() => onBeatRef.current?.(beatPos), 0);
      nextBeatTimeRef.current += 60.0 / bpmRef.current;
      beatIndexRef.current++;
    }
    schedulerRef.current = window.setTimeout(scheduler, LOOKAHEAD_MS);
  }, []);

  const start = useCallback(
    (bpm: number, onBeat?: (beat: number) => void) => {
      // Re-unlock audio synchronously in case context suspended since last gesture
      unlockAudio();

      if (runningRef.current) {
        if (schedulerRef.current !== null) clearTimeout(schedulerRef.current);
        schedulerRef.current = null;
      }
      bpmRef.current = bpm;
      runningRef.current = true;
      beatIndexRef.current = 0;
      onBeatRef.current = onBeat ?? null;

      const ctx = getCtx();
      nextBeatTimeRef.current = ctx.currentTime + 0.05;
      scheduler();
    },
    [scheduler],
  );

  const stop = useCallback(() => {
    runningRef.current = false;
    if (schedulerRef.current !== null) {
      clearTimeout(schedulerRef.current);
      schedulerRef.current = null;
    }
    beatIndexRef.current = 0;
  }, []);

  const playBeep = useCallback(
    (freq: number, vol: number, duration = 0.08) => {
      beep(freq, vol, duration);
    },
    [],
  );

  const playCountBeep = useCallback(
    (isLast: boolean) => {
      beep(isLast ? 1100 : 600, isLast ? 0.6 : 0.3, 0.12);
    },
    [],
  );

  const resumeAudio = useCallback(() => {
    unlockAudio();
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, playBeep, playCountBeep, resumeAudio };
}
