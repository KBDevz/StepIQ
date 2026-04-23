import { useState, useEffect } from 'react';
import type { ClassificationResult } from '../../types';
import { CLASSIFICATION_NAMES, getThresholds } from '../../utils/scoring';

interface Moment2Props {
  classification: ClassificationResult;
  age: number;
  sex: 'male' | 'female';
  onContinue: () => void;
}

const SCALE_COLORS = ['#FF4444', '#FF8C42', '#FFD166', '#06D6A0', '#00E5A0'];

export default function Moment2({ classification, age, sex, onContinue }: Moment2Props) {
  const thresholds = getThresholds(age, sex);
  const activeIdx = CLASSIFICATION_NAMES.indexOf(classification.name as typeof CLASSIFICATION_NAMES[number]);
  const [indicatorPos, setIndicatorPos] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setIndicatorPos((activeIdx + 0.5) / CLASSIFICATION_NAMES.length * 100);
    }, 100);
    return () => clearTimeout(t);
  }, [activeIdx]);

  const nextClassification = activeIdx < 4 ? CLASSIFICATION_NAMES[activeIdx + 1] : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '80px 32px 120px',
      position: 'relative',
    }}>
      {/* Top label */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text2)',
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Where You Stand
      </p>

      {/* Headline */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.8rem',
        fontWeight: 700,
        color: 'var(--text)',
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        Here's how you rank
      </h2>

      {/* Classification scale bar */}
      <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
        {/* Indicator */}
        <div style={{ position: 'relative', height: '24px', marginBottom: '4px' }}>
          <div style={{
            position: 'absolute',
            left: `${indicatorPos}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            transition: 'left 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
            zIndex: 2,
          }} />
        </div>

        {/* Bar segments */}
        <div style={{
          display: 'flex',
          gap: '3px',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '12px',
        }}>
          {CLASSIFICATION_NAMES.map((name, i) => (
            <div
              key={name}
              style={{
                flex: 1,
                height: '12px',
                background: i === activeIdx ? SCALE_COLORS[i] : `${SCALE_COLORS[i]}40`,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {CLASSIFICATION_NAMES.map((name, i) => (
            <div key={name} style={{ flex: 1, textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: i === activeIdx ? '0.55rem' : '0.52rem',
                fontWeight: i === activeIdx ? 700 : 400,
                color: i === activeIdx ? SCALE_COLORS[i] : 'var(--text2)',
                lineHeight: 1.3,
              }}>
                {name}
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.45rem',
                color: i === activeIdx ? `${SCALE_COLORS[i]}AA` : 'var(--text3)',
                marginTop: '2px',
              }}>
                {i === 0 ? `<${thresholds[0]}` :
                 i === 4 ? `≥${thresholds[3]}` :
                 `${thresholds[i - 1]}–${thresholds[i] - 1}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Classification + percentile */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        color: 'var(--text2)',
        textAlign: 'center',
        marginTop: '24px',
      }}>
        <span style={{ color: classification.color, fontWeight: 600 }}>{classification.name}</span>
        {' '}for your age and sex
      </p>

      {/* Context statement */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.88rem',
        fontStyle: 'italic',
        color: 'var(--text2)',
        textAlign: 'center',
        maxWidth: '300px',
        margin: '12px auto 0',
        lineHeight: 1.5,
      }}>
        Every category you move up meaningfully reduces your cardiovascular risk.
      </p>

      {/* Next target teaser */}
      {nextClassification && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--accent)',
            background: 'var(--accent-dark)',
            border: '1px solid rgba(0,184,162,0.2)',
            borderRadius: '20px',
            padding: '5px 14px',
            display: 'inline-block',
          }}>
            Next target: {nextClassification}
          </span>
        </div>
      )}

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
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
      >
        Continue &rarr;
      </button>
    </div>
  );
}
