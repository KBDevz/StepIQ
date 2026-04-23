import { useState, useEffect, useRef } from 'react';
import type { ClassificationResult } from '../../types';

interface Moment1Props {
  vo2Max: number;
  classification: ClassificationResult;
  onContinue: () => void;
}

const MOTIVATIONAL: Record<string, string> = {
  'Excellent': "That's elite. Seriously impressive.",
  'Good': 'Strong number. You should be proud.',
  'Average': 'Solid baseline. This is exactly where change begins.',
  'Below Average': "This is your starting line. And starting lines are exciting.",
  'Poor': 'Now you know. Knowing is the most important first step.',
};

function useCountUp(target: number, duration: number) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const startTime = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target * 10) / 10);

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setDone(true);
      }
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return { value, done };
}

export default function Moment1({ vo2Max, classification, onContinue }: Moment1Props) {
  const vo2Display = Math.round(vo2Max * 10) / 10;
  const { value: countValue, done: countDone } = useCountUp(vo2Display, 1500);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (countDone) {
      const t = setTimeout(() => setShowBadge(true), 100);
      return () => clearTimeout(t);
    }
  }, [countDone]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '40px 32px',
      position: 'relative',
    }}>
      {/* Colored glow behind number */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${classification.color}12 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Top label */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text2)',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        Your VO&#x2082; Max Estimate &middot; &plusmn;8-10% Accuracy
      </p>

      {/* Score number */}
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '8rem',
        fontWeight: 700,
        color: classification.color,
        lineHeight: 1,
        textAlign: 'center',
        position: 'relative',
      }}>
        {countValue.toFixed(1)}
      </p>

      {/* Unit */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        color: 'var(--text2)',
        marginTop: '8px',
      }}>
        ml &middot; kg&#x207B;&#xB9; &middot; min&#x207B;&#xB9;
      </p>

      {/* Classification badge */}
      <div style={{
        marginTop: '20px',
        opacity: showBadge ? 1 : 0,
        transform: showBadge ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.5s ease-out',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: classification.color,
          background: classification.bgColor,
          border: `1px solid ${classification.color}30`,
          padding: '10px 28px',
          borderRadius: '30px',
          display: 'inline-block',
        }}>
          {classification.name}
        </span>
      </div>

      {/* Motivational line */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        fontStyle: 'italic',
        color: 'var(--text2)',
        marginTop: '16px',
        maxWidth: '280px',
        textAlign: 'center',
        lineHeight: 1.5,
        opacity: showBadge ? 1 : 0,
        transform: showBadge ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.5s ease-out 0.2s',
      }}>
        {MOTIVATIONAL[classification.name]}
      </p>

      {/* Continue button */}
      <button
        onClick={onContinue}
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '32px',
          right: '32px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--bg)',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '10px',
          padding: '15px 24px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-accent)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
      >
        Continue &rarr;
      </button>
    </div>
  );
}
