import type { ReportData } from '../../types/report';

export default function WhatYourEngineCanDo({ data }: { data: ReportData }) {
  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 4 · Performance</p>
      <h2 className="report-headline">What Your Engine Can Do</h2>

      <p className="report-body">{data.translatingToSport}</p>

      <div className="report-callout">
        <p>{data.callout}</p>
      </div>

      <h3 className="report-subhead">How You Compare</h3>

      <div className="report-card" style={{ marginTop: '16px' }}>
        {(() => {
          const benchmarks = [
            { label: 'Tour de France cyclist', range: '70–85' },
            { label: 'Olympic marathoner', range: '60–75' },
            { label: 'Active 25-year-old', range: '45–50' },
            { label: 'Sedentary 50-year-old', range: '25–30' },
          ];

          const userRow = { label: 'YOU', range: data.vo2Max.toFixed(1), isUser: true };
          const sorted = [...benchmarks, userRow].sort((a, b) => {
            const aVal = 'isUser' in a ? data.vo2Max : parseFloat(a.range.split('–')[0]);
            const bVal = 'isUser' in b ? data.vo2Max : parseFloat(b.range.split('–')[0]);
            return bVal - aVal;
          });

          return sorted.map((row, i) => {
            const isUser = 'isUser' in row;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: isUser ? '14px 10px' : '10px 0',
                  margin: isUser ? '-1px -10px' : undefined,
                  background: isUser ? 'rgba(20,230,180,0.10)' : undefined,
                  border: isUser ? '1px solid var(--accent)' : undefined,
                  borderRadius: isUser ? '10px' : undefined,
                  borderBottom: !isUser && i < sorted.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: isUser ? 'var(--accent)' : 'var(--text2)',
                  fontWeight: isUser ? 700 : 400,
                }}>
                  {row.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  color: isUser ? 'var(--accent)' : 'var(--text2)',
                  fontWeight: isUser ? 700 : 500,
                }}>
                  {row.range}{isUser ? ' →' : ''}
                </span>
              </div>
            );
          });
        })()}
      </div>

      <div className="report-divider" />

      <h3 className="report-subhead">In Real Terms</h3>

      <ul className="report-bullets">
        {data.vo2Max >= 45 ? (
          <>
            <li>You can sustain vigorous activity (running, cycling, swimming) for 30+ minutes</li>
            <li>Your cardiovascular system recovers faster than average between bouts of effort</li>
            <li>You have meaningful headroom above daily-life demands — stairs, carrying groceries, chasing kids</li>
          </>
        ) : data.vo2Max >= 35 ? (
          <>
            <li>You can sustain moderate activity (brisk walking, easy cycling) for extended periods</li>
            <li>Higher-intensity bursts (running for a bus, playing sports) will feel taxing but manageable</li>
            <li>The gap between daily demands and your ceiling is narrow enough to feel at times</li>
          </>
        ) : (
          <>
            <li>Daily activities like climbing stairs or carrying heavy items may elevate your heart rate significantly</li>
            <li>Sustained moderate exercise will feel challenging but is exactly what drives improvement</li>
            <li>You have the steepest improvement curve — small, consistent effort yields the biggest returns</li>
          </>
        )}
      </ul>

      <span className="report-page-num">4 / 9</span>
    </div>
  );
}
