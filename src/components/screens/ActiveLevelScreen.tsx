import { useState, useEffect, useRef } from 'react';
import type { TestState } from '../../types';
import { getLevelProtocol, LEVEL_DURATION, DEV_LEVEL_DURATION } from '../../utils/protocol';
import { onBeat, speakHRAlert, cancelSpeech } from '../../utils/voiceCoach';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import FormCard from '../ui/FormCard';
import BeatDots from '../test/BeatDots';
import StepCues from '../test/StepCues';
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

// Audio helper — lives outside React render cycle
function createAudioEngine() {
  let ctx: AudioContext | null = null;

  function getCtx(): AudioContext {
    if (!ctx || ctx.state === 'closed') {
      ctx = new AudioContext();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function beep(freq: number, vol: number, dur = 0.07) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + dur);
    } catch {
      // swallow audio errors
    }
  }

  function countBeep(isLast: boolean) {
    beep(isLast ? 1100 : 600, isLast ? 0.6 : 0.3, 0.12);
  }

  function close() {
    ctx?.close();
    ctx = null;
  }

  return { beep, countBeep, close };
}

export default function ActiveLevelScreen({
  state,
  logLevel,
  advanceLevel,
  onTestEnd,
}: ActiveLevelScreenProps) {
  const [activeBeat, setActiveBeat] = useState(-1);
  const [showSheet, setShowSheet] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [levelActive, setLevelActive] = useState(true);
  const [nextLevel, setNextLevel] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [hrAlert, setHrAlert] = useState(false);
  const hrAlertFired = useRef(false);

  // Refs for intervals — never go stale
  const metronomeId = useRef<number>(0);
  const timerId = useRef<number>(0);
  const endTime = useRef(0);
  const beatCount = useRef(0);
  const levelStartBeat = useRef(0);
  const currentLevelRef = useRef(state.currentLevel);
  const audioRef = useRef<ReturnType<typeof createAudioEngine> | null>(null);

  // Get or create audio engine
  function audio() {
    if (!audioRef.current) audioRef.current = createAudioEngine();
    return audioRef.current;
  }

  function stopMetronome() {
    clearInterval(metronomeId.current);
    metronomeId.current = 0;
  }

  function stopTimer() {
    clearInterval(timerId.current);
    timerId.current = 0;
  }

  function stopAll() {
    stopMetronome();
    stopTimer();
    cancelSpeech();
  }

  function startLevel(level: number) {
    const p = getLevelProtocol(level);
    const dur = state.devMode ? DEV_LEVEL_DURATION : LEVEL_DURATION;

    // Stop any running intervals
    stopAll();

    // Reset UI state
    currentLevelRef.current = level;
    setLevelActive(true);
    setShowSheet(false);
    setShowCountdown(false);
    setHrAlert(false);
    hrAlertFired.current = false;
    setTotalTime(dur);
    setRemaining(dur);

    // -- Metronome --
    levelStartBeat.current = beatCount.current;
    const msPerBeat = 60000 / p.bpm;

    const tick = () => {
      const beat = beatCount.current % 4;
      const isAccent = beat === 0;
      audio().beep(isAccent ? 880 : 660, isAccent ? 0.5 : 0.3);
      setActiveBeat(beat);

      // Voice coaching for first 4 cycles
      const beatsSinceStart = beatCount.current - levelStartBeat.current;
      onBeat(beatsSinceStart, currentLevelRef.current);

      beatCount.current++;
    };

    tick(); // first beat immediate
    metronomeId.current = window.setInterval(tick, msPerBeat);

    // -- Timer --
    endTime.current = Date.now() + dur * 1000;
    timerId.current = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endTime.current - Date.now()) / 1000));
      setRemaining(left);

      // HR alert at 10 seconds remaining
      if (left <= 10 && left > 0 && !hrAlertFired.current) {
        hrAlertFired.current = true;
        setHrAlert(true);
        speakHRAlert();
      }

      if (left <= 0) {
        // Level complete — stop timer but keep metronome running
        stopTimer();
        setLevelActive(false);
        setHrAlert(false);
        setShowSheet(true);
        // Metronome keeps running! Do NOT stop it here.
      }
    }, 100);
  }

  // Expose startLevel via ref so InlineCountdown callback can access latest
  const startLevelRef = useRef(startLevel);
  startLevelRef.current = startLevel;

  // Start level 1 on mount
  useEffect(() => {
    startLevel(state.currentLevel);
    return () => {
      stopAll();
      audioRef.current?.close();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proto = getLevelProtocol(state.currentLevel);
  const progress = totalTime > 0 ? remaining / totalTime : 1;

  function handleEntryConfirm(hr: number, rpe: number) {
    // NOW stop the metronome (after HR/RPE entry)
    stopMetronome();
    cancelSpeech();
    setActiveBeat(-1);

    logLevel(hr, rpe);
    setShowSheet(false);

    // Check stop conditions
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
  }

  function handleCountdownComplete() {
    setShowCountdown(false);
    startLevelRef.current(nextLevel);
  }

  function handleEndEarly() {
    stopAll();
    onTestEnd('Test ended early by user');
  }

  const lastHR = state.data.length > 0 ? state.data[state.data.length - 1].hr : null;

  return (
    <div className="flex flex-col items-center px-6 relative" style={{ flex: 1 }}>
      {/* Top spacer */}
      <div style={{ flex: 1 }} />

      {/* Centered content */}
      <Badge>Level {state.currentLevel} of 5</Badge>

      <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mt-6">Level</p>
      <p className="font-serif text-[100px] leading-none text-[#EEF2FF] my-2">{state.currentLevel}</p>
      <p className="font-mono text-sm text-[#5A7090] mb-4">
        {proto.spm} steps/min · {proto.bpm} BPM
      </p>

      <BeatDots activeBeat={activeBeat} />

      {/* Step direction cues — synced to metronome */}
      <div className="w-full mt-4 mb-4">
        <StepCues activeBeat={activeBeat} />
      </div>

      <div className="w-full mb-6">
        <LevelTimer remaining={remaining} progress={progress} alert={hrAlert} />
      </div>

      {/* HR alert message — only while level timer is running */}
      {hrAlert && levelActive && (
        <p
          className="font-mono uppercase"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            color: '#FF8C42',
            textAlign: 'center',
            marginBottom: '12px',
            animation: 'hrAlertPulse 0.8s ease-in-out infinite',
          }}
        >
          Check your heart rate now
        </p>
      )}

      {/* Bottom spacer */}
      <div style={{ flex: 0.2 }} />

      {/* Bottom section */}
      <div className="w-full" style={{ paddingBottom: '24px' }}>
        <FormCard className="w-full mb-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-1">Stop HR</p>
              <p className="font-mono text-2xl text-[#FF8C42]">{state.stopHR} <span className="text-xs">bpm</span></p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-1">Last HR</p>
              <p className="font-mono text-2xl text-[#EEF2FF]">
                {lastHR ? <>{lastHR} <span className="text-xs text-[#5A7090]">bpm</span></> : '—'}
              </p>
            </div>
          </div>
        </FormCard>

        <Button variant="ghost" onClick={handleEndEarly}>
          End Test Early
        </Button>
      </div>

      {showSheet && (
        <EntrySheet level={state.currentLevel} onConfirm={handleEntryConfirm} />
      )}

      {showCountdown && (
        <InlineCountdown
          level={nextLevel}
          onComplete={handleCountdownComplete}
          playCountBeep={audio().countBeep}
        />
      )}

      <style>{`
        @keyframes hrAlertPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
