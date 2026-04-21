import { useState, useEffect, useRef } from 'react';
import type { TestState, HRCaptureMethod } from '../../types';
import { getLevelProtocol, LEVEL_DURATION, DEV_LEVEL_DURATION } from '../../utils/protocol';
import { onBeat, speakHRAlert, cancelSpeech } from '../../utils/voiceCoach';
import BeatDots from '../test/BeatDots';
import StepCues from '../test/StepCues';
import LevelTimer from '../test/LevelTimer';
import InlineEntryPanel from '../test/InlineEntryPanel';
import InlineCountdown from '../test/InlineCountdown';

interface ActiveLevelScreenProps {
  state: TestState;
  playBeep: (freq: number, vol: number, duration?: number) => void;
  playCountBeep: (isLast: boolean) => void;
  logLevel: (hr: number, rpe: number, hrSource?: HRCaptureMethod) => void;
  advanceLevel: () => void;
  checkStopConditions: () => { shouldStop: boolean; reason: string };
  onTestEnd: (reason: string) => void;
  fetchWearableHR?: () => Promise<{ hr: number; source: 'wearable' } | null>;
}

export default function ActiveLevelScreen({
  state,
  playBeep,
  playCountBeep,
  logLevel,
  advanceLevel,
  onTestEnd,
  fetchWearableHR,
}: ActiveLevelScreenProps) {
  const [activeBeat, setActiveBeat] = useState(-1);
  const [showEntry, setShowEntry] = useState(false);
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
  const playBeepRef = useRef(playBeep);
  playBeepRef.current = playBeep;
  const playCountBeepRef = useRef(playCountBeep);
  playCountBeepRef.current = playCountBeep;

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
    setShowEntry(false);
    setShowCountdown(false);
    setHrAlert(false);
    hrAlertFired.current = false;
    setTotalTime(dur);
    setRemaining(dur);

    levelStartBeat.current = beatCount.current;
    const msPerBeat = 60000 / p.bpm;

    const BEAT_TONES: [number, number][] = [
      [880, 0.5],
      [880, 0.4],
      [560, 0.45],
      [560, 0.35],
    ];
    const toneDur = Math.min(0.08, msPerBeat * 0.00015);

    const tick = () => {
      const beat = beatCount.current % 4;
      const [freq, vol] = BEAT_TONES[beat];
      playBeepRef.current(freq, vol, toneDur);
      setActiveBeat(beat);

      // Voice coaching only on level 1
      if (currentLevelRef.current === 1) {
        const beatsSinceStart = beatCount.current - levelStartBeat.current;
        onBeat(beatsSinceStart, currentLevelRef.current);
      }

      beatCount.current++;
    };

    tick();
    metronomeId.current = window.setInterval(tick, msPerBeat);

    endTime.current = Date.now() + dur * 1000;
    timerId.current = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endTime.current - Date.now()) / 1000));
      setRemaining(left);

      // At 10 seconds: show HR alert + open inline entry panel
      if (left <= 10 && left > 0 && !hrAlertFired.current) {
        hrAlertFired.current = true;
        setHrAlert(true);
        setShowEntry(true);
        speakHRAlert();
      }

      if (left <= 0) {
        stopTimer();
        setLevelActive(false);
        setHrAlert(false);
        // Entry panel stays open — metronome keeps running
      }
    }, 100);
  }

  const startLevelRef = useRef(startLevel);
  startLevelRef.current = startLevel;

  useEffect(() => {
    startLevel(state.currentLevel);
    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proto = getLevelProtocol(state.currentLevel);
  const progress = totalTime > 0 ? remaining / totalTime : 1;

  function handleEntryConfirm(hr: number, rpe: number, hrSource?: HRCaptureMethod) {
    cancelSpeech();

    logLevel(hr, rpe, hrSource);
    setShowEntry(false);
    setHrAlert(false);

    if (rpe >= 7) {
      stopMetronome();
      setActiveBeat(-1);
      onTestEnd(`RPE ${rpe} reached stop zone`);
      return;
    }
    if (hr >= state.stopHR && state.data.length + 1 >= 3) {
      stopMetronome();
      setActiveBeat(-1);
      onTestEnd(`HR ${hr} bpm exceeded 85% max HR (${state.stopHR} bpm)`);
      return;
    }
    if (state.currentLevel >= 5) {
      stopMetronome();
      setActiveBeat(-1);
      onTestEnd('All 5 levels completed');
      return;
    }

    // Immediate transition to next level
    const next = state.currentLevel + 1;
    stopMetronome();
    setActiveBeat(-1);
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

      {/* ZONE 1 — Top bar with End Test button */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', height: '52px', flexShrink: 0,
      }}>
        <span
          className="font-mono"
          style={{
            fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--accent)', background: 'var(--accent-glow)',
            border: '1px solid rgba(0,229,160,0.3)', borderRadius: '20px',
            padding: '4px 12px', fontWeight: 600,
          }}
        >
          Level {state.currentLevel} of 5
        </span>
        {!showEntry && (
          <button
            onClick={handleEndEarly}
            className="font-mono"
            style={{
              fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--danger)', background: 'rgba(255,68,68,0.1)',
              border: '1px solid rgba(255,68,68,0.3)', borderRadius: '20px',
              padding: '4px 12px', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(255,68,68,0.2)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'rgba(255,68,68,0.1)'; }}
          >
            End Test
          </button>
        )}
      </div>

      {/* Info line below top bar */}
      {!showEntry && (
        <div style={{ textAlign: 'center', padding: '0 24px', flexShrink: 0 }}>
          <p className="font-mono" style={{
            fontSize: '0.55rem', color: 'var(--text2)', letterSpacing: '0.05em',
          }}>
            {state.currentLevel < 3
              ? 'Complete at least 3 levels for the most accurate score'
              : `${proto.spm} spm · ${proto.bpm} BPM`}
          </p>
        </div>
      )}

      {/* ZONE 2 — Level number (shifts up when entry panel visible) */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 1, minHeight: 0,
        transform: showEntry ? 'translateY(-20px)' : 'none',
        transition: 'transform 0.3s ease',
      }}>
        <span className="font-serif" style={{
          fontSize: '9rem', lineHeight: 1, color: 'var(--text)', fontWeight: 700,
        }}>
          {state.currentLevel}
        </span>
      </div>

      {/* ZONE 3 — Step cue indicator */}
      <div style={{
        padding: '0 24px', flexShrink: 0,
        transform: showEntry ? 'translateY(-20px)' : 'none',
        transition: 'transform 0.3s ease',
      }}>
        <StepCues activeBeat={activeBeat} />
      </div>

      {/* ZONE 4 — Beat dots */}
      <div style={{
        flexShrink: 0,
        transform: showEntry ? 'translateY(-20px)' : 'none',
        transition: 'transform 0.3s ease',
      }}>
        <BeatDots activeBeat={activeBeat} />
      </div>

      {/* ZONE 5 — Timer + progress */}
      <div style={{ padding: '0 24px', flexShrink: 0 }}>
        <LevelTimer remaining={remaining} progress={progress} alert={hrAlert} />
      </div>

      {/* ZONE 6/7 — HR alert text OR info card OR inline entry panel */}
      <div style={{ padding: '12px 24px', flexShrink: 0, minHeight: '60px' }}>
        {showEntry ? (
          <InlineEntryPanel
            level={state.currentLevel}
            onConfirm={handleEntryConfirm}
            fetchWearableHR={fetchWearableHR}
          />
        ) : hrAlert && levelActive ? (
          <p
            className="font-mono"
            style={{
              fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em',
              color: 'var(--warn)', textAlign: 'center',
              animation: 'hrAlertPulse 0.8s ease-in-out infinite',
            }}
          >
            Check your heart rate now — record it before the level ends
          </p>
        ) : (
          <div style={{
            background: 'var(--surface)', border: '1px solid #1C2F4A', borderRadius: '10px',
            padding: '12px 16px', display: 'flex',
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)', marginBottom: '4px' }}>Stop HR</p>
              <p className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--warn)' }}>
                {state.stopHR} <span style={{ fontSize: '0.6rem', fontWeight: 400, color: 'var(--text2)' }}>bpm</span>
              </p>
            </div>
            <div style={{ width: '1px', background: 'var(--border)', margin: '0 12px' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)', marginBottom: '4px' }}>Last HR</p>
              <p className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>
                {lastHR ? <>{lastHR} <span style={{ fontSize: '0.6rem', fontWeight: 400, color: 'var(--text2)' }}>bpm</span></> : '—'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: '16px', flexShrink: 0 }} />

      {/* Overlays */}
      {showCountdown && (
        <InlineCountdown
          level={nextLevel}
          onComplete={handleCountdownComplete}
          playCountBeep={playCountBeepRef.current}
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
