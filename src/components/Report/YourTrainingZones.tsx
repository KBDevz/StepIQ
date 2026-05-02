import type { ReportData } from '../../types/report';

const ZONE_COLORS = ['#06D6A0', '#00B4D8', '#FFD166', '#FF8C42', '#FF4444'];
const ZONE_NAMES = ['Recovery', 'Aerobic Base', 'Tempo', 'Threshold', 'VO₂ Max'];
const ZONE_EFFORT = ['Very easy', 'Conversational', 'Comfortably hard', 'Hard', 'All-out'];

export default function YourTrainingZones({ data }: { data: ReportData }) {
  const zones = [
    { low: data.zone1Low, high: data.zone1High },
    { low: data.zone2Low, high: data.zone2High },
    { low: data.zone3Low, high: data.zone3High },
    { low: data.zone4Low, high: data.zone4High },
    { low: data.zone5Low, high: data.zone5High },
  ];

  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 5 · Heart Rate Zones</p>
      <h2 className="report-headline">Your Training Zones</h2>

      <p className="report-body">
        These zones are derived from your test data — not generic formulas. Each zone targets a
        different physiological adaptation. The 8-week protocol on the next page tells you exactly
        how much time to spend in each.
      </p>

      <div className="report-card" style={{ marginTop: '20px' }}>
        <table className="report-zone-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Range</th>
              <th>Effort</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z, i) => (
              <tr key={i} className={i === 1 ? 'zone-highlight' : ''}>
                <td>
                  <span className="zone-dot" style={{ background: ZONE_COLORS[i] }} />
                  <span style={{ fontWeight: 600 }}>Z{i + 1}</span>
                  <span style={{ color: 'var(--text2)', marginLeft: '6px', fontSize: '0.78rem' }}>
                    {ZONE_NAMES[i]}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{z.low}–{z.high} bpm</td>
                <td style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>{ZONE_EFFORT[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual zone bar */}
      <div style={{ margin: '24px 0', display: 'flex', gap: '2px', borderRadius: '8px', overflow: 'hidden' }}>
        {zones.map((z, i) => {
          const width = z.high - z.low;
          return (
            <div
              key={i}
              style={{
                flex: width,
                height: i === 1 ? '28px' : '20px',
                background: ZONE_COLORS[i],
                opacity: i === 1 ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                borderRadius: '4px',
                transition: 'all 0.3s',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                fontWeight: 700,
                color: '#060C18',
              }}>
                Z{i + 1}
              </span>
            </div>
          );
        })}
      </div>

      <div className="report-divider" />

      <h3 className="report-subhead">Why Zone 2 Matters Most</h3>
      <p className="report-body">{data.zoneTwoCommentary}</p>

      <div className="report-card report-card--accent" style={{ marginTop: '20px' }}>
        <p className="report-label" style={{ color: 'var(--accent)', marginBottom: '8px' }}>Your Zone 2 Range</p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--accent)',
          lineHeight: 1,
        }}>
          {data.zone2Low}–{data.zone2High} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 400 }}>bpm</span>
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--text2)',
          marginTop: '8px',
          lineHeight: 1.5,
        }}>
          Stay in this range for 70-80% of your weekly training volume. You should be able to hold
          a full conversation at this intensity.
        </p>
      </div>

      <span className="report-page-num">5 / 9</span>
    </div>
  );
}
