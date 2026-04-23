import type { LevelResult } from '../../types';
import RegressionChart from '../results/RegressionChart';

interface Moment3Props {
  data: LevelResult[];
  maxHR: number;
  vo2Max: number;
  onContinue: () => void;
}

export default function Moment3({ data, maxHR, vo2Max, onContinue }: Moment3Props) {
  const minHR = Math.min(...data.map(d => d.hr));
  const maxDataHR = Math.max(...data.map(d => d.hr));
  const minRPE = Math.min(...data.map(d => d.rpe));
  const maxRPE = Math.max(...data.map(d => d.rpe));

  const pills = [
    `${data.length} levels`,
    `${minHR}–${maxDataHR} bpm`,
    `${minRPE}–${maxRPE} RPE`,
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '80px 24px 120px',
      position: 'relative',
    }}>
      {/* Top label */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text2)',
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        How We Got There
      </p>

      {/* Headline */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.6rem',
        fontWeight: 700,
        color: 'var(--text)',
        textAlign: 'center',
        marginBottom: '8px',
      }}>
        Your heart rate told us everything
      </h2>

      {/* Subtext */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        color: 'var(--text2)',
        textAlign: 'center',
        marginBottom: '24px',
        lineHeight: 1.5,
      }}>
        {data.length} data points. One regression line. One honest picture of your fitness.
      </p>

      {/* Chart */}
      <div className="moment3-chart" style={{ flex: 1, minHeight: 0 }}>
        <RegressionChart data={data} maxHR={maxHR} vo2Max={vo2Max} />
      </div>

      {/* Data summary pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        justifyContent: 'center',
        marginTop: '16px',
      }}>
        {pills.map((pill) => (
          <span
            key={pill}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'var(--accent)',
              background: 'var(--accent-dark)',
              border: '1px solid rgba(0,184,162,0.2)',
              borderRadius: '20px',
              padding: '3px 10px',
            }}
          >
            {pill}
          </span>
        ))}
      </div>

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

      <style>{`
        .moment3-chart .w-full {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          backdrop-filter: none !important;
        }
        .moment3-chart > div {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}
