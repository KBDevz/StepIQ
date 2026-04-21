import { useState, useEffect, useRef } from 'react';

interface StepGuideProps {
  bpm: number;
}

const BEATS = [
  { call: 'Left Up', pill: 'Left Up', leftUp: true, rightUp: false },
  { call: 'Right Up', pill: 'Right Up', leftUp: true, rightUp: true },
  { call: 'Left Down', pill: 'Left Down', leftUp: false, rightUp: true },
  { call: 'Right Down', pill: 'Right Down', leftUp: false, rightUp: false },
] as const;

const PILLS = ['Left Up', 'Right Up', 'Left Down', 'Right Down'];

export default function StepGuide({ bpm }: StepGuideProps) {
  const [beat, setBeat] = useState(0);
  const [flash, setFlash] = useState(false);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    const ms = 60000 / bpm;
    setBeat(0);
    setFlash(true);

    intervalRef.current = window.setInterval(() => {
      setBeat((b) => (b + 1) % 4);
      setFlash(true);
      setTimeout(() => setFlash(false), 120);
    }, ms);

    const flashTimeout = setTimeout(() => setFlash(false), 120);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(flashTimeout);
    };
  }, [bpm]);

  const current = BEATS[beat];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '360px',
        background: 'var(--surface)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '16px 20px',
      }}
    >
      <p
        className="font-mono"
        style={{
          fontSize: '10px',
          color: 'var(--text3)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          textAlign: 'center',
          marginBottom: '10px',
        }}
      >
        Step Pattern
      </p>

      <div style={{ position: 'relative', height: '72px', margin: '0 auto 10px', width: '140px' }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '10px',
            width: '80px',
            height: '24px',
            borderRadius: '6px',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
          }}
        >
          <span
            className="font-mono"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Step
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, height: '1px', background: 'var(--border)' }} />

        <div
          className="font-mono"
          style={{
            position: 'absolute',
            transition: 'all 120ms ease-out',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            width: 20,
            height: 32,
            left: 38,
            bottom: current.leftUp ? 38 : 10,
            backgroundColor: current.leftUp ? 'var(--accent)' : 'var(--surface2)',
            border: `1px solid ${current.leftUp ? 'var(--accent)' : 'var(--border)'}`,
            color: current.leftUp ? '#060C18' : 'var(--text2)',
            boxShadow: current.leftUp ? '0 0 10px rgba(0,229,160,0.4)' : 'none',
          }}
        >
          L
        </div>

        <div
          className="font-mono"
          style={{
            position: 'absolute',
            transition: 'all 120ms ease-out',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 700,
            width: 20,
            height: 32,
            right: 38,
            bottom: current.rightUp ? 38 : 10,
            backgroundColor: current.rightUp ? 'var(--accent)' : 'var(--surface2)',
            border: `1px solid ${current.rightUp ? 'var(--accent)' : 'var(--border)'}`,
            color: current.rightUp ? '#060C18' : 'var(--text2)',
            boxShadow: current.rightUp ? '0 0 10px rgba(0,229,160,0.4)' : 'none',
          }}
        >
          R
        </div>
      </div>

      <p
        className="font-serif"
        style={{
          fontSize: '1.125rem',
          color: 'var(--accent)',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '10px',
          transition: 'opacity 100ms',
          opacity: flash ? 0.5 : 1,
        }}
      >
        {current.call}
      </p>

      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '8px' }}>
        {PILLS.map((pill, i) => (
          <span
            key={pill}
            className="font-mono"
            style={{
              padding: '2px 6px',
              borderRadius: '6px',
              fontSize: '9px',
              transition: 'all 100ms',
              ...(i === beat
                ? {
                    background: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(0,229,160,0.4)',
                  }
                : {
                    background: 'var(--surface2)',
                    color: 'var(--text3)',
                    border: '1px solid transparent',
                  }),
            }}
          >
            {pill}
          </span>
        ))}
      </div>

      <p
        className="font-mono"
        style={{
          fontSize: '9px',
          color: 'var(--text3)',
          textAlign: 'center',
        }}
      >
        Step to each beat — one full cycle = 4 beats
      </p>
    </div>
  );
}
