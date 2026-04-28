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

function beep(freq: number, vol: number, duration: number, when: number) {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(vol, when + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, when + duration);

    osc.start(when);
    osc.stop(when + duration + 0.01);
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

export function getSharedAudioContext(): AudioContext {
  return getCtx();
}

export function useMetronome() {
  const schedulerRef = useRef<number | null>(null);
  const nextBeatTimeRef = useRef(0);
  const beatIndexRef = useRef(0);
  const bpmRef = useRef(60);
  const runningRef = useRef(false);
  const onBeatRef = useRef<((beat: number) => void) | null>(null);
  const audioSuspendedRef = useRef(false);

  const scheduler = useCallback(() => {
    if (!runningRef.current) return;
    const ctx = getCtx();

    if (ctx.state === 'suspended' || ctx.state === 'interrupted' as any) {
      audioSuspendedRef.current = true;
      ctx.resume().then(() => {
        if (runningRef.current) {
          schedulerRef.current = window.setTimeout(scheduler, LOOKAHEAD_MS);
        }
      });
      return;
    }

    if (audioSuspendedRef.current) {
      audioSuspendedRef.current = false;
      nextBeatTimeRef.current = ctx.currentTime + 0.05;
    }

    while (nextBeatTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD) {
      const pos = beatIndexRef.current % 4;
      const [freq, vol] = BEAT_TONES[pos];
      beep(freq, vol, 0.08, nextBeatTimeRef.current);
      const beatPos = pos;
      setTimeout(() => onBeatRef.current?.(beatPos), 0);
      nextBeatTimeRef.current += 60.0 / bpmRef.current;
      beatIndexRef.current++;
    }
    schedulerRef.current = window.setTimeout(scheduler, LOOKAHEAD_MS);
  }, []);

  const start = useCallback(
    (bpm: number, onBeat?: (beat: number) => void) => {
      unlockAudio();

      if (runningRef.current) {
        if (schedulerRef.current !== null) clearTimeout(schedulerRef.current);
        schedulerRef.current = null;
      }
      bpmRef.current = bpm;
      runningRef.current = true;
      beatIndexRef.current = 0;
      audioSuspendedRef.current = false;
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
      const ctx = getCtx();
      beep(freq, vol, duration, ctx.currentTime);
    },
    [],
  );

  const playCountBeep = useCallback(
    (isLast: boolean) => {
      const ctx = getCtx();
      beep(isLast ? 1100 : 600, isLast ? 0.6 : 0.3, 0.12, ctx.currentTime);
    },
    [],
  );

  const resumeAudio = useCallback(() => {
    unlockAudio();
  }, []);

  useEffect(() => {
    const ctx = getCtx();
    const handleStateChange = () => {
      if (ctx.state === 'running' && audioSuspendedRef.current && runningRef.current) {
        audioSuspendedRef.current = false;
        nextBeatTimeRef.current = ctx.currentTime + 0.05;
        if (schedulerRef.current === null) {
          scheduler();
        }
      }
    };
    ctx.addEventListener('statechange', handleStateChange);
    return () => {
      stop();
      ctx.removeEventListener('statechange', handleStateChange);
    };
  }, [stop, scheduler]);

  return { start, stop, playBeep, playCountBeep, resumeAudio };
}
