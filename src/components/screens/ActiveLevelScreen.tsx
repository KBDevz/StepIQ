import { useState, useEffect, useRef, useCallback } from 'react';
import type { TestState } from '../../types';
import { getLevelProtocol, LEVEL_DURATION, DEV_LEVEL_DURATION } from '../../utils/protocol';
import { onBeat, speakHRAlert, cancelSpeech } from '../../utils/voiceCoach';
import { getSharedAudioContext } from '../../hooks/useMetronome';
import BeatDots from '../test/BeatDots';
import StepCues from '../test/StepCues';
import LevelTimer from '../test/LevelTimer';
import InlineEntryPanel from '../test/InlineEntryPanel';
import InlineCountdown from '../test/InlineCountdown';

interface ActiveLevelScreenProps {
  state: TestState;
  startMetronome: (bpm: number, onBeat?: (beat: number) => void) => void;
  stopMetronome: () => void;
  playCountBeep: (isLast: boolean) => void;
  logLevel: (hr: number, rpe: number) => void;
  advanceLevel: () => void;
  checkStopConditions: () => { shouldStop: boolean; reason: string };
  onTestEnd: (reason: string) => void;
}

export default function ActiveLevelScreen({
  state,
  startMetronome,
  stopMetronome,
  playCountBeep,
  logLevel,
  advanceLevel,
  onTestEnd,
}: ActiveLevelScreenProps) {
  const [activeBeat, setActiveBeat] = useState(-1);
  const [showEntry, setShowEntry] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [levelActive, setLevelActive] = useState(true);
  const [nextLevel, setNextLevel] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [hrAlert, setHrAlert] = useState(false);
  const [hrAdvisory, setHrAdvisory] = useState(false);
  const [audioInterrupted, setAudioInterrupted] = useState(false);
  const hrAlertFired = useRef(false);

  const timerId = useRef<number>(0);
  const endTime = useRef(0);
  const beatCount = useRef(0);
  const levelStartBeat = useRef(0);
  const currentLevelRef = useRef(state.currentLevel);
  const playCountBeepRef = useRef(playCountBeep);
  playCountBeepRef.current = playCountBeep;
  const startMetronomeRef = useRef(startMetronome);
  startMetronomeRef.current = startMetronome;
  const stopMetronomeRef = useRef(stopMetronome);
  stopMetronomeRef.current = stopMetronome;
  const wakeLockRef = useRef<any>(null);

  // Wake Lock — keep screen on during test
  useEffect(() => {
    let lock: any = null;
    const acquire = async () => {
      try {
        if ('wakeLock' in navigator) {
          lock = await (navigator as any).wakeLock.request('screen');
          wakeLockRef.current = lock;
          lock.addEventListener('release', () => { wakeLockRef.current = null; });
        }
      } catch { /* not fatal */ }
    };
    acquire();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        acquire();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, []);

  // AudioContext interruption detection via statechange + visibility
  useEffect(() => {
    const ctx = getSharedAudioContext();
    const checkSuspended = () => {
      const s = ctx.state as string;
      if (s === 'suspended' || s === 'interrupted') {
        setAudioInterrupted(true);
      }
    };

    ctx.addEventListener('statechange', checkSuspended);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkSuspended();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      ctx.removeEventListener('statechange', checkSuspended);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handleResumeAudio = useCallback(() => {
    const ctx = getSharedAudioContext();
    ctx.resume().then(() => {
      setAudioInterrupted(false);
    });
  }, []);

  function stopTimer() {
    clearInterval(timerId.current);
    timerId.current = 0;
  }

  function stopAll() {
    stopMetronomeRef.current();
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

    startMetronomeRef.current(p.bpm, (beat: number) => {
      setActiveBeat(beat);

      if (currentLevelRef.current === 1) {
        const beatsSinceStart = beatCount.current - levelStartBeat.current;
        onBeat(beatsSinceStart, currentLevelRef.current);
      }

      beatCount.current++;
    });

    endTime.current = Date.now() + dur * 1000;
    timerId.current = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endTime.current - Date.now()) / 1000));
      setRemaining(left);

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

  function handleEntryConfirm(hr: number, rpe: number) {
    cancelSpeech();

    logLevel(hr, rpe);
    setShowEntry(false);
    setHrAlert(false);
    setHrAdvisory(false);

    if (rpe >= 8) {
      stopMetronomeRef.current();
      setActiveBeat(-1);
      onTestEnd(`RPE ${rpe} reached stop zone`);
      return;
    }

    if (state.currentLevel >= 5) {
      stopMetronomeRef.current();
      setActiveBeat(-1);
      onTestEnd('All 5 levels completed');
      return;
    }

    const next = state.currentLevel + 1;
    stopMetronomeRef.current();
    setActiveBeat(-1);
    advanceLevel();
    setNextLevel(next);
    setShowCountdown(true);

    if (hr >= state.stopHR) {
      setHrAdvisory(true);
    }
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
            hrAdvisory={hrAdvisory}
            stopHR={state.stopHR}
            onConfirm={handleEntryConfirm}
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

      {/* Audio interrupted overlay */}
      {audioInterrupted && (
        <div
          onClick={handleResumeAudio}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(6,12,24,0.92)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(0,184,162,0.15)',
            border: '2px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px',
            animation: 'resumePulse 1.5s ease-in-out infinite',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--accent)',
            marginBottom: '8px',
          }}>
            Tap to resume
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--text2)',
            textAlign: 'center',
            maxWidth: '260px',
            lineHeight: 1.5,
          }}>
            Audio was interrupted. Tap anywhere to resume the metronome.
          </p>
        </div>
      )}

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
        @keyframes resumePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,184,162,0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 4px rgba(0,184,162,0.2); }
        }
      `}</style>
    </div>
  );
}
