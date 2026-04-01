import { useState, useEffect, useCallback, useRef } from 'react';
import type { TestState } from '../../types';
import { getLevelProtocol, LEVEL_DURATION, DEV_LEVEL_DURATION } from '../../utils/protocol';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import FormCard from '../ui/FormCard';
import BeatDots from '../test/BeatDots';
import LevelTimer from '../test/LevelTimer';
import EntrySheet from '../test/EntrySheet';
import InlineCountdown from '../test/InlineCountdown';

interface ActiveLevelScreenProps {
  state: TestState;
  logLevel: (hr: number, rpe: number) => void;
  advanceLevel: () => void;
  checkStopConditions: () => { shouldStop: boolean; reason: string };
  onTestEnd: (reason: string) => void;
}

export default function ActiveLevelScreen({
  state,
  logLevel,
  advanceLevel,
  checkStopConditions: _,
  onTestEnd,
}: ActiveLevelScreenProps) {
  const [activeBeat, setActiveBeat] = useState(-1);
  const [showSheet, setShowSheet] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [levelActive, setLevelActive] = useState(true);
  const [nextLevel, setNextLevel] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // All interval/audio state managed via refs to avoid stale closure issues
  const metronomeIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const endTimeRef = useRef(0);
  const beatCountRef = useRef(0);
  const levelCompleteRef = useRef(false);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback(
    (freq: number, vol: number, duration = 0.07) => {
      try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Audio may fail on some browsers, don't break the test
      }
    },
    [getAudioCtx],
  );

  const playCountBeep = useCallback(
    (isLast: boolean) => {
      playBeep(isLast ? 1100 : 600, isLast ? 0.6 : 0.3, 0.12);
    },
    [playBeep],
  );

  const stopMetronome = useCallback(() => {
    if (metronomeIntervalRef.current !== null) {
      clearInterval(metronomeIntervalRef.current);
      metronomeIntervalRef.current = null;
    }
    beatCountRef.current = 0;
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const handleLevelEnd = useCallback(() => {
    stopMetronome();
    stopTimer();
    setLevelActive(false);
    setActiveBeat(-1);
    setShowSheet(true);
  }, [stopMetronome, stopTimer]);

  // Keep handleLevelEnd in a ref so the timer interval always calls the latest version
  const handleLevelEndRef = useRef(handleLevelEnd);
  handleLevelEndRef.current = handleLevelEnd;

  const startMetronome = useCallback(
    (bpm: number) => {
      stopMetronome();
      beatCountRef.current = 0;
      const interval = 60000 / bpm;

      const tick = () => {
        const beat = beatCountRef.current % 4;
        const isAccent = beat === 0;
        playBeep(isAccent ? 880 : 660, isAccent ? 0.5 : 0.3);
        setActiveBeat(beat);
        beatCountRef.current++;
      };

      tick(); // first beat immediately
      metronomeIntervalRef.current = window.setInterval(tick, interval);
    },
    [playBeep, stopMetronome],
  );

  const startTimer = useCallback(
    (seconds: number) => {
      stopTimer();
      levelCompleteRef.current = false;
      setTotalTime(seconds);
      setRemaining(seconds);
      endTimeRef.current = Date.now() + seconds * 1000;

      timerIntervalRef.current = window.setInterval(() => {
        const left = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0 && !levelCompleteRef.current) {
          levelCompleteRef.current = true;
          handleLevelEndRef.current();
        }
      }, 200);
    },
    [stopTimer],
  );

  const startLevel = useCallback(
    (level: number) => {
      const p = getLevelProtocol(level);
      const dur = state.devMode ? DEV_LEVEL_DURATION : LEVEL_DURATION;
      setLevelActive(true);
      setShowSheet(false);
      setShowCountdown(false);
      startTimer(dur);
      startMetronome(p.bpm);
    },
    [state.devMode, startTimer, startMetronome],
  );

  // Keep startLevel in a ref so callbacks always access latest
  const startLevelRef = useRef(startLevel);
  startLevelRef.current = startLevel;

  // Start level 1 on mount
  useEffect(() => {
    startLevelRef.current(state.currentLevel);
    return () => {
      // Cleanup all intervals
      if (metronomeIntervalRef.current !== null) clearInterval(metronomeIntervalRef.current);
      if (timerIntervalRef.current !== null) clearInterval(timerIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proto = getLevelProtocol(state.currentLevel);
  const progress = totalTime > 0 ? remaining / totalTime : 1;

  const handleEntryConfirm = useCallback(
    (hr: number, rpe: number) => {
      logLevel(hr, rpe);
      setShowSheet(false);

      setTimeout(() => {
        if (rpe >= 7) {
          onTestEnd(`RPE ${rpe} reached stop zone`);
          return;
        }
        if (hr >= state.stopHR && state.data.length + 1 >= 3) {
          onTestEnd(`HR ${hr} bpm exceeded 85% max HR (${state.stopHR} bpm)`);
          return;
        }
        if (state.currentLevel >= 5) {
          onTestEnd('All 5 levels completed');
          return;
        }

        const next = state.currentLevel + 1;
        advanceLevel();
        setNextLevel(next);
        setShowCountdown(true);
      }, 50);
    },
    [logLevel, state.stopHR, state.data.length, state.currentLevel, advanceLevel, onTestEnd],
  );

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    startLevelRef.current(nextLevel);
  }, [nextLevel]);

  const handleEndEarly = useCallback(() => {
    stopMetronome();
    stopTimer();
    onTestEnd('Test ended early by user');
  }, [stopMetronome, stopTimer, onTestEnd]);

  const lastHR = state.data.length > 0 ? state.data[state.data.length - 1].hr : null;

  return (
    <div className="flex flex-col items-center px-5 py-6 min-h-screen relative">
      <Badge>Level {state.currentLevel} of 5</Badge>

      <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mt-4">Level</p>
      <p className="font-serif text-7xl text-[#EEF2FF] my-2">{state.currentLevel}</p>
      <p className="font-mono text-sm text-[#5A7090] mb-4">
        {proto.spm} steps/min · {proto.bpm} BPM
      </p>

      <BeatDots activeBeat={levelActive ? activeBeat : -1} />

      <div className="w-full mt-6 mb-6">
        <LevelTimer remaining={remaining} progress={progress} />
      </div>

      <FormCard className="w-full mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-1">Stop HR</p>
            <p className="font-mono text-lg text-[#FF8C42]">{state.stopHR} <span className="text-xs">bpm</span></p>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-1">Last HR</p>
            <p className="font-mono text-lg text-[#EEF2FF]">
              {lastHR ? <>{lastHR} <span className="text-xs text-[#5A7090]">bpm</span></> : '—'}
            </p>
          </div>
        </div>
      </FormCard>

      <Button variant="ghost" onClick={handleEndEarly}>
        End Test Early
      </Button>

      {showSheet && (
        <EntrySheet level={state.currentLevel} onConfirm={handleEntryConfirm} />
      )}

      {showCountdown && (
        <InlineCountdown
          level={nextLevel}
          onComplete={handleCountdownComplete}
          playCountBeep={playCountBeep}
        />
      )}
    </div>
  );
}
