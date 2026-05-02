import type { ReportData } from '../../types/report';

export default function WhatThisPlanBecomes({ data }: { data: ReportData }) {
  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 9 · What's Next</p>
      <h2 className="report-headline">What This Plan Becomes</h2>

      {data.whatThisPlanBecomesV2 ? (
        <p className="report-body">{data.whatThisPlanBecomesV2}</p>
      ) : (
        <>
          <p className="report-body">
            This is your first report. It's a snapshot — one data point on what will become a trend
            line. When you retest in 8 weeks, your next report will show:
          </p>

          <ul className="report-bullets">
            <li>A side-by-side comparison of your VO₂ max scores over time</li>
            <li>Updated training zones calibrated to your improved fitness</li>
            <li>A recalculated protocol that matches your new tier</li>
            <li>Trend analysis of your resting heart rate and recovery metrics</li>
          </ul>

          <div className="report-divider" />

          <p className="report-body">
            The most effective training programs are iterative. Each test-train-retest cycle
            builds on the last, with your protocol adapting as your body does. StepIQ tracks
            the longitudinal data so each report is more precise than the one before.
          </p>
        </>
      )}

      <div className="report-callout" style={{ marginTop: '24px' }}>
        <p>
          Your body will do the work. This plan is the map. Retest on{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontStyle: 'normal' }}>
            {data.retestDate}
          </span>{' '}
          to see how far you've come.
        </p>
      </div>

      <div style={{
        marginTop: '48px',
        padding: '28px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--text3)',
          marginBottom: '12px',
        }}>
          StepIQ · Chester Step Test Protocol
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.82rem',
          color: 'var(--text2)',
          lineHeight: 1.6,
        }}>
          Validated submaximal assessment · ±8-10% accuracy vs. laboratory VO₂ test
          <br />
          Based on Sykes & Roberts (2004) · FRIEND registry norms (Kaminsky et al. 2017)
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text3)',
          marginTop: '12px',
          letterSpacing: '0.06em',
        }}>
          Report generated {data.testDate} · Token: {data.reportToken}
        </p>
      </div>

      <span className="report-page-num">9 / 9</span>
    </div>
  );
}
