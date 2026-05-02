import type { ReportData } from '../../types/report';

export default function MeasureProgress({ data }: { data: ReportData }) {
  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 8 · Progress Tracking</p>
      <h2 className="report-headline">Measure Your Progress</h2>

      <p className="report-body">
        Retest every 8 weeks using the same Chester Step Test protocol. Consistent testing conditions
        (time of day, hydration, rest) produce the most reliable comparison.
      </p>

      <div className="report-card report-card--accent" style={{ marginTop: '24px', textAlign: 'center' }}>
        <p className="report-label" style={{ color: 'var(--accent)', marginBottom: '12px' }}>
          Retest Date
        </p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1,
        }}>
          {data.retestDate}
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--text2)',
          marginTop: '10px',
          lineHeight: 1.5,
        }}>
          8 weeks from your test on {data.testDate}
        </p>
      </div>

      <div className="report-divider" />

      <h3 className="report-subhead">What to Track Weekly</h3>

      <ul className="report-bullets">
        <li>
          <span className="report-bold">Resting heart rate.</span> Measure first thing in the morning
          before getting up. A downward trend (even 2-3 bpm over 8 weeks) is a reliable signal of
          improved cardiovascular fitness.
        </li>
        <li>
          <span className="report-bold">Subjective effort at Zone 2 pace.</span> Does the same
          heart rate feel easier week over week? That's your cardiovascular system becoming more
          efficient.
        </li>
        <li>
          <span className="report-bold">Recovery time.</span> How quickly does your heart rate
          return to baseline after a hard effort? Faster recovery = better fitness.
        </li>
        <li>
          <span className="report-bold">Session consistency.</span> Track completed sessions per
          week. 80% adherence to the protocol is the minimum for meaningful progress.
        </li>
      </ul>

      <div className="report-divider" />

      <h3 className="report-subhead">Expected Trajectory</h3>

      <div className="report-card" style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <p className="report-label" style={{ marginBottom: '6px' }}>Week 0 (Now)</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text2)', lineHeight: 1 }}>
              {data.vo2Max.toFixed(1)}
            </p>
          </div>
          <div style={{ color: 'var(--accent)', fontSize: '1.4rem' }}>→</div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <p className="report-label" style={{ marginBottom: '6px' }}>Week 8 Target</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
              {(data.vo2Max < 30 ? data.vo2Max + 6 : data.vo2Max < 50 ? data.vo2Max + 4.7 : data.vo2Max < 60 ? data.vo2Max + 3 : data.vo2Max + 2).toFixed(1)}
            </p>
          </div>
          <div style={{ color: 'var(--text3)', fontSize: '1.4rem' }}>→</div>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <p className="report-label" style={{ marginBottom: '6px' }}>6-Month Potential</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text3)', lineHeight: 1 }}>
              {(data.vo2Max + (data.vo2Max < 35 ? 12 : data.vo2Max < 50 ? 8 : 5)).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <p className="report-body" style={{ marginTop: '16px', fontStyle: 'italic', fontSize: '0.85rem' }}>
        These projections assume 80%+ adherence to the protocol and adequate recovery. Individual
        response varies based on genetics, training history, and lifestyle factors.
      </p>

      <span className="report-page-num">8 / 9</span>
    </div>
  );
}
