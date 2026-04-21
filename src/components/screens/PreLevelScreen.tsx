import { useState, useEffect, useRef } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import StepGuide from '../test/StepGuide';
import { getLevelProtocol } from '../../utils/protocol';
import { cancelSpeech, speakText } from '../../utils/voiceCoach';

interface PreLevelScreenProps {
  level: number;
  countdownSeconds: number;
  onComplete: () => void;
  playCountBeep: (isLast: boolean) => void;
}

function speakExplanation() {
  speakText(
    'Welcome to the Chester Step Test. ' +
    'You will step up and down to a metronome beat. The pattern is: left up, right up, left down, right down. ' +
    'Each level lasts 2 minutes, and the pace increases each level. ' +
    'During the final 15 seconds, check your heart rate and record it. ' +
    'Press the button when you are ready to begin.',
  );
}

export default function PreLevelScreen({ level, countdownSeconds, onComplete, playCountBeep }: PreLevelScreenProps) {
  const [phase, setPhase] = useState<'explain' | 'countdown'>(level === 1 ? 'explain' : 'countdown');
  const [count, setCount] = useState(countdownSeconds);
  const proto = getLevelProtocol(level);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const playCountBeepRef = useRef(playCountBeep);
  playCountBeepRef.current = playCountBeep;

  // Speak explanation on mount for level 1
  useEffect(() => {
    if (level === 1) {
      speakExplanation();
    }
    return () => cancelSpeech();
  }, [level]);

  // Countdown timer (only runs in countdown phase)
  useEffect(() => {
    if (phase !== 'countdown') return;

    setCount(countdownSeconds);
    let done = false;

    const interval = setInterval(() => {
      setCount((c) => {
        const next = c - 1;
        if (next <= 0) {
          clearInterval(interval);
          if (!done) {
            done = true;
            setTimeout(() => onCompleteRef.current(), 0);
          }
          return 0;
        }
        playCountBeepRef.current(next <= 1);
        return next;
      });
    }, 1000);

    playCountBeepRef.current(countdownSeconds <= 1);

    return () => {
      clearInterval(interval);
      done = true;
    };
  }, [phase, countdownSeconds]);

  function handleReady() {
    cancelSpeech();
    setPhase('countdown');
  }

  // For levels 2+, skip explain and go straight to countdown
  if (phase === 'countdown') {
    return (
      <div className="flex flex-col items-center px-6" style={{ flex: 1 }}>
        <div style={{ flex: 1 }} />

        <Badge>Level {level} of 5</Badge>

        <p className="font-mono text-sm text-[#5A7090] mt-6 mb-3">
          {proto.spm} steps/min — {proto.bpm} BPM
        </p>

        <div className="relative my-8">
          <span
            className="font-serif text-[140px] leading-none text-[#EEF2FF] tabular-nums transition-transform duration-200"
            style={{ transform: `scale(${count <= 3 ? 1.1 : 1})` }}
          >
            {count}
          </span>
        </div>

        <p className="font-mono text-sm text-[#5A7090] mb-8">
          {level === 1 ? 'Starting...' : 'Next level starting...'}
        </p>

        <div style={{ flex: 0.3 }} />

        <div className="w-full flex justify-center" style={{ paddingBottom: '40px' }}>
          <StepGuide bpm={proto.bpm} />
        </div>
      </div>
    );
  }

  // ── Explanation phase (Level 1 only) ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '24px 24px 32px' }}>
      {/* Top section */}
      <div style={{ textAlign: 'center', width: '100%', marginBottom: '24px', marginTop: '12px' }}>
        <Badge>Level 1 of 5</Badge>
        <h2
          className="font-serif"
          style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginTop: '16px', marginBottom: '8px' }}
        >
          How the Test Works
        </h2>
        <p className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', lineHeight: 1.5 }}>
          {proto.spm} steps/min · {proto.bpm} BPM · 2 minutes per level
        </p>
      </div>

      {/* Step animation — centered */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <StepGuide bpm={proto.bpm} />
        </div>
      </div>

      {/* Explanation bullets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', width: '100%', maxWidth: '360px' }}>
        {[
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            ),
            text: 'Step to the metronome beat: Left up, Right up, Left down, Right down.',
          },
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            ),
            text: 'The pace increases every 2 minutes. Most people complete 3\u20134 levels.',
          },
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            ),
            text: 'At 15 seconds remaining, check your heart rate and enter it when prompted.',
          },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
            <p className="font-mono" style={{ fontSize: '0.72rem', color: '#EEF2FF', lineHeight: 1.6 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Ready button */}
      <div style={{ marginTop: 'auto', width: '100%' }}>
        <Button onClick={handleReady}>I'm Ready — Start Level 1</Button>
      </div>
    </div>
  );
}
