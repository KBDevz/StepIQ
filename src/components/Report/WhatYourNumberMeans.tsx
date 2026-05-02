import type { ReportData } from '../../types/report';

function BellCurve({ percentile }: { percentile: number }) {
  const w = 320;
  const h = 120;
  const curveY = (x: number) => {
    const mu = 0.5;
    const sigma = 0.18;
    const z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z);
  };

  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = 8 + (i / 100) * 304;
    const y = h - 16 - curveY(i / 100) * 80;
    points.push(`${x},${y}`);
  }
  const fillPoints = `8,${h - 16} ${points.join(' ')} 312,${h - 16}`;
  const markerX = 8 + (percentile / 100) * 304;
  const medianX = 8 + 0.5 * 304;

  return (
    <div className="report-bell-curve">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        <defs>
          <linearGradient id="bellFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <polygon points={fillPoints} fill="url(#bellFill)" />
        <polyline points={points.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2" />

        {/* Median line */}
        <line x1={medianX} y1="16" x2={medianX} y2={h - 16} stroke="var(--text3)" strokeWidth="1" strokeDasharray="4 3" />

        {/* User marker */}
        <line x1={markerX} y1="16" x2={markerX} y2={h - 16} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx={markerX} cy={h - 16 - curveY(percentile / 100) * 80} r="5" fill="var(--accent)" />
        <circle cx={markerX} cy={h - 16 - curveY(percentile / 100) * 80} r="9" fill="var(--accent)" opacity="0.25" />
        <text x={markerX} y="12" textAnchor="middle" fill="var(--accent)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">YOU</text>

        {/* Axis labels */}
        <text x="8" y={h - 2} fill="var(--text3)" fontSize="8" fontFamily="var(--font-mono)">10TH</text>
        <text x={medianX} y={h - 2} textAnchor="middle" fill="var(--text2)" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">MEDIAN</text>
        <text x="312" y={h - 2} textAnchor="end" fill="var(--text3)" fontSize="8" fontFamily="var(--font-mono)">90TH</text>
      </svg>
    </div>
  );
}

export default function WhatYourNumberMeans({ data }: { data: ReportData }) {
  const ageDelta = data.actualAge - data.fitnessAge;
  const isYounger = ageDelta > 0;

  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 2 · Context</p>
      <h2 className="report-headline">What Your Number Means</h2>

      <p className="report-body">{data.whyParagraph}</p>

      <div className="report-divider" />

      <h3 className="report-subhead">Where You Stand</h3>
      <p className="report-body">{data.howToRead}</p>

      <BellCurve percentile={data.percentile} />

      <div className="report-stat-grid">
        <div className="report-stat-tile">
          <div className="value">{data.percentile}th</div>
          <div className="label">Percentile</div>
        </div>
        <div className="report-stat-tile">
          <div className="value">{data.fitnessAge}</div>
          <div className="label">Fitness Age</div>
        </div>
        <div className="report-stat-tile">
          <div className="value" style={{ color: isYounger ? 'var(--accent)' : 'var(--warn)' }}>
            {isYounger ? `−${ageDelta}` : `+${Math.abs(ageDelta)}`}
          </div>
          <div className="label">{isYounger ? 'Years Younger' : 'Years Older'}</div>
        </div>
      </div>

      <div className="report-callout">
        <p>{data.tierParagraph}</p>
      </div>

      <span className="report-page-num">2 / 9</span>
    </div>
  );
}
