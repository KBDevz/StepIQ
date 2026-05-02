import type { ReportData } from '../../types/report';

export default function YourTestData({ data }: { data: ReportData }) {
  const levels = [
    { level: 1, hr: data.hrLevel1, rpe: data.rpeLevel1, spm: 15, bpm: 60 },
    { level: 2, hr: data.hrLevel2, rpe: data.rpeLevel2, spm: 20, bpm: 80 },
    { level: 3, hr: data.hrLevel3, rpe: data.rpeLevel3, spm: 25, bpm: 100 },
    { level: 4, hr: data.hrLevel4, rpe: data.rpeLevel4, spm: 30, bpm: 120 },
  ];

  const chartH = 200;
  const chartW = 300;
  const hrMin = 80;
  const hrMax = data.hrMaxEstimated + 10;

  const hrPoints = levels.map((l, i) => {
    const x = 30 + (i / (levels.length - 1)) * (chartW - 60);
    const y = chartH - 30 - ((l.hr - hrMin) / (hrMax - hrMin)) * (chartH - 50);
    return { x, y, ...l };
  });

  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 3 · Test Data</p>
      <h2 className="report-headline">Your Test Data</h2>

      <p className="report-body">
        The Chester Step Test measures your heart rate response across progressively harder stepping
        levels. We use linear regression on your HR-to-VO₂ relationship to extrapolate your maximum
        oxygen uptake.
      </p>

      <div className="report-card" style={{ marginTop: '20px' }}>
        <table className="report-data-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Level</th>
              <th>Cadence</th>
              <th>HR (bpm)</th>
              <th>RPE</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.level}>
                <td>Level {l.level}</td>
                <td>{l.spm} spm / {l.bpm} BPM</td>
                <td>{l.hr}</td>
                <td style={{ color: l.rpe >= 7 ? 'var(--warn)' : undefined }}>{l.rpe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="report-divider" />

      <h3 className="report-subhead">HR vs. Intensity</h3>
      <p className="report-body" style={{ marginBottom: '16px' }}>
        The line below shows the linear relationship between your heart rate and exercise intensity.
        The projected max HR ({data.hrMaxEstimated} bpm) is where we estimate your VO₂ ceiling.
      </p>

      <div className="report-card">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height={chartH}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => {
            const y = chartH - 30 - p * (chartH - 50);
            return <line key={p} x1="30" y1={y} x2={chartW - 10} y2={y} stroke="var(--border)" strokeWidth="0.5" />;
          })}

          {/* Regression line */}
          {hrPoints.length >= 2 && (
            <line
              x1={hrPoints[0].x}
              y1={hrPoints[0].y}
              x2={chartW - 30}
              y2={chartH - 30 - ((data.hrMaxEstimated - hrMin) / (hrMax - hrMin)) * (chartH - 50)}
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.5"
            />
          )}

          {/* Data line */}
          <polyline
            points={hrPoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
          />

          {/* Data points */}
          {hrPoints.map((p) => (
            <g key={p.level}>
              <circle cx={p.x} cy={p.y} r="4" fill="var(--accent)" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="var(--text2)" fontSize="9" fontFamily="var(--font-mono)">
                {p.hr}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {hrPoints.map((p) => (
            <text key={`lbl-${p.level}`} x={p.x} y={chartH - 8} textAnchor="middle" fill="var(--text3)" fontSize="8" fontFamily="var(--font-mono)">
              L{p.level}
            </text>
          ))}
        </svg>
      </div>

      <div className="report-stat-grid" style={{ marginTop: '20px' }}>
        <div className="report-stat-tile">
          <div className="value">{data.vo2Max.toFixed(1)}</div>
          <div className="label">VO₂ Max</div>
        </div>
        <div className="report-stat-tile">
          <div className="value">{data.hrMaxEstimated}</div>
          <div className="label">Est. Max HR</div>
        </div>
        <div className="report-stat-tile">
          <div className="value">{levels.length}</div>
          <div className="label">Levels Done</div>
        </div>
      </div>

      <span className="report-page-num">3 / 9</span>
    </div>
  );
}
