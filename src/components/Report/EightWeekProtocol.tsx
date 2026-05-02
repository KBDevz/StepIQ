import type { ReportData } from '../../types/report';

interface WeekBlock {
  weeks: string;
  phase: string;
  frequency: string;
  sessions: string;
  intensity: string;
}

const PROTOCOLS: Record<ReportData['protocolTier'], WeekBlock[]> = {
  beginner: [
    { weeks: '1–2', phase: 'Foundation', frequency: '3x/week', sessions: '30 min walk/light jog', intensity: 'Z1-Z2 only' },
    { weeks: '3–4', phase: 'Build Base', frequency: '3–4x/week', sessions: '35 min, add 2 min jog intervals', intensity: 'Z2 primary, brief Z3' },
    { weeks: '5–6', phase: 'Extend', frequency: '4x/week', sessions: '40 min, longer continuous Z2', intensity: 'Z2 with 1x Z3 session' },
    { weeks: '7–8', phase: 'Challenge', frequency: '4x/week', sessions: '40–45 min, 1x tempo session', intensity: 'Z2 base + 1x Z3-Z4 intervals' },
  ],
  intermediate: [
    { weeks: '1–2', phase: 'Re-establish', frequency: '4x/week', sessions: '40 min Z2, 1x tempo run', intensity: 'Z2 base + 1x Z3' },
    { weeks: '3–4', phase: 'Build', frequency: '4–5x/week', sessions: '45 min, add 1x interval session', intensity: '80% Z2, 20% Z3-Z4' },
    { weeks: '5–6', phase: 'Intensify', frequency: '5x/week', sessions: '45–50 min, structured intervals', intensity: '75% Z2, 25% Z3-Z4' },
    { weeks: '7–8', phase: 'Peak', frequency: '5x/week', sessions: '50 min, 2x high-intensity sessions', intensity: '70% Z2, 30% Z3-Z5' },
  ],
  advanced: [
    { weeks: '1–2', phase: 'Base Reset', frequency: '5x/week', sessions: '50–60 min Z2, 1x intervals', intensity: '85% Z2, 15% Z4' },
    { weeks: '3–4', phase: 'Build Volume', frequency: '5–6x/week', sessions: '60 min, 2x intervals', intensity: '80% Z2, 20% Z4-Z5' },
    { weeks: '5–6', phase: 'Sharpen', frequency: '5–6x/week', sessions: '55–65 min, polarized', intensity: '80% Z2, 20% Z4-Z5' },
    { weeks: '7–8', phase: 'Perform', frequency: '5–6x/week', sessions: '60 min, 2x race-pace', intensity: '75% Z2, 25% Z4-Z5' },
  ],
};

export default function EightWeekProtocol({ data }: { data: ReportData }) {
  const protocol = PROTOCOLS[data.protocolTier];

  const eightWeekTarget = data.vo2Max < 30
    ? data.vo2Max + 6
    : data.vo2Max < 50
      ? data.vo2Max + 4.7
      : data.vo2Max < 60
        ? data.vo2Max + 3
        : data.vo2Max + 2;

  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 6 · Training Protocol</p>
      <h2 className="report-headline">Your 8-Week Protocol</h2>

      <p className="report-body">
        This protocol is built for your <span className="report-bold">{data.protocolTier}</span> tier
        based on a starting VO₂ of <span className="report-accent">{data.vo2Max.toFixed(1)}</span>.
        Follow it consistently for 8 weeks, then retest to measure progress.
      </p>

      <div className="report-stat-grid" style={{ marginTop: '20px', marginBottom: '24px' }}>
        <div className="report-stat-tile">
          <div className="value">{data.vo2Max.toFixed(1)}</div>
          <div className="label">Starting VO₂</div>
        </div>
        <div className="report-stat-tile">
          <div className="value">{eightWeekTarget.toFixed(1)}</div>
          <div className="label">8-Week Target</div>
        </div>
        <div className="report-stat-tile">
          <div className="value">+{(eightWeekTarget - data.vo2Max).toFixed(1)}</div>
          <div className="label">Expected Gain</div>
        </div>
      </div>

      <div className="report-card">
        <table className="report-protocol-table">
          <thead>
            <tr>
              <th>Weeks</th>
              <th>Phase</th>
              <th>Frequency</th>
              <th>Sessions</th>
              <th>Intensity</th>
            </tr>
          </thead>
          <tbody>
            {protocol.map((w) => (
              <tr key={w.weeks}>
                <td className="week-label">{w.weeks}</td>
                <td style={{ fontWeight: 600, color: 'var(--text)' }}>{w.phase}</td>
                <td>{w.frequency}</td>
                <td>{w.sessions}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{w.intensity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="report-callout" style={{ marginTop: '24px' }}>
        <p>Consistency beats intensity. Missing a session is fine — missing a week is where progress stalls.</p>
      </div>

      <span className="report-page-num">6 / 9</span>
    </div>
  );
}
