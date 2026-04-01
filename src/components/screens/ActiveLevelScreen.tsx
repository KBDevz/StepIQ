import { useState, useEffect, useCallback } from 'react';
import type { TestState } from '../../types';
import { getLevelProtocol, LEVEL_DURATION, DEV_LEVEL_DURATION } from '../../utils/protocol';
import { useMetronome } from '../../hooks/useMetronome';
import { useLevelTimer } from '../../hooks/useLevelTimer';
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

  const metronome = useMetronome();

  const handleLevelComplete = useCallback(() => {
    setLevelActive(false);
    metronome.stop();
    setActiveBeat(-1);
    setShowSheet(true);
  }, [metronome]);

  const timer = useLevelTimer(handleLevelComplete);

  const proto = getLevelProtocol(state.currentLevel);

  // Start level
  const startLevel = useCallback(
    (level: number) => {
      const p = getLevelProtocol(level);
      const dur = state.devMode ? DEV_LEVEL_DURATION : LEVEL_DURATION;
      setLevelActive(true);
      setShowSheet(false);
      setShowCountdown(false);
      timer.start(dur);
      metronome.start(p.bpm, (beat) => {
        setActiveBeat(beat);
      });
    },
    [metronome, timer, state.devMode],
  );

  // Start level 1 on mount
  useEffect(() => {
    startLevel(state.currentLevel);
    return () => {
      metronome.stop();
      timer.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEntryConfirm = useCallback(
    (hr: number, rpe: number) => {
      logLevel(hr, rpe);
      setShowSheet(false);

      // Use setTimeout to allow state to settle after logLevel
      setTimeout(() => {
        // Check stop conditions — we need to check manually here since state may not have updated yet
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

        // Continue to next level
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
    startLevel(nextLevel);
  }, [nextLevel, startLevel]);

  const handleEndEarly = useCallback(() => {
    metronome.stop();
    timer.stop();
    onTestEnd('Test ended early by user');
  }, [metronome, timer, onTestEnd]);

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
        <LevelTimer remaining={timer.remaining} progress={timer.progress} />
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

      {/* Entry sheet overlay */}
      {showSheet && (
        <EntrySheet level={state.currentLevel} onConfirm={handleEntryConfirm} />
      )}

      {/* Inline 3-2-1 countdown overlay */}
      {showCountdown && (
        <InlineCountdown
          level={nextLevel}
          onComplete={handleCountdownComplete}
          playCountBeep={metronome.playCountBeep}
        />
      )}
    </div>
  );
}
