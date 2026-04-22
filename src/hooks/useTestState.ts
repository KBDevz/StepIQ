import { useState, useCallback, useMemo } from 'react';
import type { TestState, LevelResult, Screen } from '../types';
import { predictedMaxHR, stopHR } from '../utils/maxHR';
import { LEVELS } from '../utils/protocol';

const initialState: TestState = {
  name: '',
  age: 30,
  sex: 'male',
  betaBlocker: false,
  maxHR: 190,
  stopHR: 162,
  restingHR: null,
  currentLevel: 1,
  data: [],
  devMode: false,
};

export function useTestState() {
  const [state, setState] = useState<TestState>(initialState);
  const [screen, setScreen] = useState<Screen>('landing');

  const updateSetup = useCallback(
    (fields: Partial<Pick<TestState, 'name' | 'age' | 'sex' | 'betaBlocker'>>) => {
      setState((s) => {
        const next = { ...s, ...fields };
        const age = next.age;
        const bb = next.betaBlocker;
        const mhr = predictedMaxHR(age, bb);
        return { ...next, maxHR: mhr, stopHR: stopHR(mhr) };
      });
    },
    [],
  );

  const setRestingHR = useCallback((hr: number | null) => {
    setState((s) => ({ ...s, restingHR: hr }));
  }, []);

  const toggleDevMode = useCallback(() => {
    setState((s) => ({ ...s, devMode: !s.devMode }));
  }, []);

  const logLevel = useCallback((hr: number, rpe: number) => {
    setState((s) => {
      const proto = LEVELS[s.currentLevel - 1];
      const result: LevelResult = {
        level: s.currentLevel,
        hr,
        rpe,
        vo2Estimate: proto.vo2,
      };
      return {
        ...s,
        data: [...s.data, result],
      };
    });
  }, []);

  const advanceLevel = useCallback(() => {
    setState((s) => ({ ...s, currentLevel: s.currentLevel + 1 }));
  }, []);

  const checkStopConditions = useCallback((): { shouldStop: boolean; reason: string; hrAdvisory?: boolean } => {
    const lastEntry = state.data[state.data.length - 1];
    if (!lastEntry) return { shouldStop: false, reason: '' };

    // RPE >= 8: stop regardless of HR
    if (lastEntry.rpe >= 8) {
      return { shouldStop: true, reason: `RPE ${lastEntry.rpe} reached stop zone` };
    }

    // HR >= 80% max AND RPE >= 8: stop (already caught above)
    // HR >= 80% max but RPE < 8: advisory only, continue
    if (lastEntry.hr >= state.stopHR && lastEntry.rpe < 8) {
      return { shouldStop: false, reason: '', hrAdvisory: true };
    }

    // Level 5 done
    if (state.currentLevel >= 5) {
      return { shouldStop: true, reason: 'All 5 levels completed' };
    }

    return { shouldStop: false, reason: '' };
  }, [state.data, state.stopHR, state.currentLevel]);

  const resetTest = useCallback(() => {
    setState(initialState);
    setScreen('landing');
  }, []);

  const lastHR = useMemo(() => {
    if (state.data.length === 0) return null;
    return state.data[state.data.length - 1].hr;
  }, [state.data]);

  return {
    state,
    screen,
    setScreen,
    updateSetup,
    setRestingHR,
    toggleDevMode,
    logLevel,
    advanceLevel,
    checkStopConditions,
    resetTest,
    lastHR,
  };
}
