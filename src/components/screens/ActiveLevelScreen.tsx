import { useState, useEffect, useRef } from 'react';
import type { TestState } from '../../types';
import { getLevelProtocol, LEVEL_DURATION, DEV_LEVEL_DURATION } from '../../utils/protocol';
import { onBeat, speakHRAlert, cancelSpeech } from '../../utils/voiceCoach';
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

  function beep(freq: number, vol: number, dur = 0.08) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
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

  const metronomeId = useRef<number>(0);
  const timerId = useRef<number>(0);
  const endTime = useRef(0);
  const beatCount = useRef(0);
  const levelStartBeat = useRef(0);
  const currentLevelRef = useRef(state.currentLevel);
  const audioRef = useRef<ReturnType<typeof createAudioEngine> | null>(null);

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

    stopAll();

    currentLevelRef.current = level;
    setLevelActive(true);
    setShowSheet(false);
    setShowCountdown(false);
    setHrAlert(false);
    hrAlertFired.current = false;
    setTotalTime(dur);
    setRemaining(dur);

    levelStartBeat.current = beatCount.current;
    const msPerBeat = 60000 / p.bpm;

    // Beat tones: UP (880Hz) / DOWN (560Hz) with slight volume variation
    const BEAT_TONES: [number, number][] = [
      [880, 0.5],   // Beat 1: Left UP  — high, loudest
      [880, 0.4],   // Beat 2: Right UP — high, slightly softer
      [560, 0.45],  // Beat 3: Left DOWN — low, medium
      [560, 0.35],  // Beat 4: Right DOWN — low, softest
    ];
    const toneDur = Math.min(0.08, msPerBeat * 0.00015);

    const tick = () => {
      const beat = beatCount.current % 4;
      const [freq, vol] = BEAT_TONES[beat];
      audio().beep(freq, vol, toneDur);
      setActiveBeat(beat);

      const beatsSinceStart = beatCount.current - levelStartBeat.current;
      onBeat(beatsSinceStart, currentLevelRef.current);

      beatCount.current++;
    };

    tick();
    metronomeId.current = window.setInterval(tick, msPerBeat);

    endTime.current = Date.now() + dur * 1000;
    timerId.current = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endTime.current - Date.now()) / 1000));
      setRemaining(left);

      if (left <= 10 && left > 0 && !hrAlertFired.current) {
        hrAlertFired.current = true;
        setHrAlert(true);
        speakHRAlert();
      }

      if (left <= 0) {
        stopTimer();
        setLevelActive(false);
        setHrAlert(false);
        setShowSheet(true);
      }
    }, 100);
  }

  const startLevelRef = useRef(startLevel);
  startLevelRef.current = startLevel;

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
    stopMetronome();
    cancelSpeech();
    setActiveBeat(-1);

    logLevel(hr, rpe);
    setShowSheet(false);

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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>

      {/* ZONE 1 — Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', height: '52px', flexShrink: 0,
      }}>
        <span
          className="font-mono"
          style={{
            fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.12em',
            color: '#00E5A0', background: 'rgba(0,229,160,0.1)',
            border: '1px solid rgba(0,229,160,0.3)', borderRadius: '20px',
            padding: '4px 12px', fontWeight: 600,
          }}
        >
          Level {state.currentLevel} of 5
        </span>
        <span className="font-mono" style={{ fontSize: '0.62rem', color: '#5A7090' }}>
          {proto.spm} spm · {proto.bpm} BPM
        </span>
      </div>

      {/* ZONE 2 — Level number (flex-grow centers it) */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 1, minHeight: 0,
      }}>
        <span className="font-serif" style={{
          fontSize: '9rem', lineHeight: 1, color: '#EEF2FF', fontWeight: 700,
        }}>
          {state.currentLevel}
        </span>
      </div>

      {/* ZONE 3 — Step cue indicator */}
      <div style={{ padding: '0 24px', flexShrink: 0 }}>
        <StepCues activeBeat={activeBeat} />
      </div>

      {/* ZONE 4 — Beat dots */}
      <div style={{ flexShrink: 0 }}>
        <BeatDots activeBeat={activeBeat} />
      </div>

      {/* ZONE 5 — Timer + progress */}
      <div style={{ padding: '0 24px', flexShrink: 0 }}>
        <LevelTimer remaining={remaining} progress={progress} alert={hrAlert} />
      </div>

      {/* ZONE 6/7 — HR alert OR info card */}
      <div style={{ padding: '12px 24px', flexShrink: 0, minHeight: '60px' }}>
        {hrAlert && levelActive ? (
          <p
            className="font-mono"
            style={{
              fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em',
              color: '#FF8C42', textAlign: 'center',
              animation: 'hrAlertPulse 0.8s ease-in-out infinite',
            }}
          >
            Check your heart rate
          </p>
        ) : (
          <div style={{
            background: '#0D1829', border: '1px solid #1C2F4A', borderRadius: '10px',
            padding: '12px 16px', display: 'flex',
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5A7090', marginBottom: '4px' }}>Stop HR</p>
              <p className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FF8C42' }}>
                {state.stopHR} <span style={{ fontSize: '0.6rem', fontWeight: 400, color: '#5A7090' }}>bpm</span>
              </p>
            </div>
            <div style={{ width: '1px', background: '#1C2F4A', margin: '0 12px' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5A7090', marginBottom: '4px' }}>Last HR</p>
              <p className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#EEF2FF' }}>
                {lastHR ? <>{lastHR} <span style={{ fontSize: '0.6rem', fontWeight: 400, color: '#5A7090' }}>bpm</span></> : '—'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ZONE 8 — End test early */}
      <div style={{ textAlign: 'center', padding: '4px 0 16px', flexShrink: 0 }}>
        <button
          onClick={handleEndEarly}
          className="font-mono"
          style={{
            display: 'inline-block', background: 'transparent', border: 'none',
            color: '#5A7090', fontSize: '0.65rem', textTransform: 'uppercase',
            letterSpacing: '0.1em', padding: '8px 16px', borderRadius: '6px',
            cursor: 'pointer', transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#C4D4E8'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#5A7090'; }}
        >
          End Test Early
        </button>
      </div>

      {/* Overlays */}
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
