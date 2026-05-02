import type { ReportData } from '../../types/report';

export default function CoverPage({ data }: { data: ReportData }) {
  return (
    <div className="report-page report-cover">
      <div>
        <p className="report-eyebrow">StepIQ · VO₂ Max Assessment</p>

        <p className="report-cover-score">{data.vo2Max.toFixed(1)}</p>
        <p className="report-cover-unit">ml · kg⁻¹ · min⁻¹</p>

        <div>
          <span className="report-cover-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {data.classification}
          </span>
        </div>

        <div style={{ marginTop: '48px' }}>
          <div className="report-stat-grid" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="report-stat-tile">
              <div className="value">{data.fitnessAge}</div>
              <div className="label">Fitness Age</div>
            </div>
            <div className="report-stat-tile">
              <div className="value">Top {100 - data.percentile}%</div>
              <div className="label">{data.ageBandLabel}</div>
            </div>
            <div className="report-stat-tile">
              <div className="value">+{data.deltaFromAverage.toFixed(1)}</div>
              <div className="label">Above Average</div>
            </div>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text3)',
          marginTop: '48px',
          letterSpacing: '0.06em',
        }}>
          Tested {data.testDate} · Chester Step Test Protocol
        </p>
      </div>

      <span className="report-page-num">1 / 9</span>
    </div>
  );
}
