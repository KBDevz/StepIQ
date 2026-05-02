import type { ReportData } from '../../types/report';

export default function BeyondTraining({ data }: { data: ReportData }) {
  return (
    <div className="report-page">
      <p className="report-eyebrow">Page 7 · Recovery & Nutrition</p>
      <h2 className="report-headline">Beyond Training</h2>

      <p className="report-body">
        Training is only half the equation. Recovery, nutrition, and sleep are where adaptation
        actually happens. Your muscles don't get stronger during the workout — they rebuild
        afterward, stronger than before.
      </p>

      <div className="report-divider" />

      <h3 className="report-subhead">Nutrition Targets</h3>
      <p className="report-body">
        Based on your weight ({data.weightKg} kg / {data.weightLb} lb) and activity level during
        the 8-week protocol, here are your estimated daily targets.
      </p>

      <div className="report-nutrition-grid" style={{ marginTop: '16px' }}>
        <div className="report-card">
          <p className="report-label" style={{ marginBottom: '8px' }}>Daily Calories (TDEE)</p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--accent)',
            lineHeight: 1,
          }}>
            {data.estimatedTdeeLow}–{data.estimatedTdeeHigh}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>
            kcal / day
          </p>
        </div>

        <div className="report-card">
          <p className="report-label" style={{ marginBottom: '8px' }}>Daily Protein</p>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'var(--accent)',
            lineHeight: 1,
          }}>
            {data.proteinLowG}–{data.proteinHighG}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>
            grams / day (1.6–2.0 g/kg)
          </p>
        </div>
      </div>

      <div className="report-divider" />

      <h3 className="report-subhead">Sleep & Recovery</h3>

      <ul className="report-bullets">
        <li>
          <span className="report-bold">7-9 hours per night.</span> Sleep is when growth hormone
          peaks and cardiovascular repair occurs. Chronic sleep debt erases training gains.
        </li>
        <li>
          <span className="report-bold">Recovery days are training days.</span> Easy walks, light
          stretching, or complete rest on non-training days allows your body to adapt. Skipping
          recovery is not "working harder" — it's working against yourself.
        </li>
        <li>
          <span className="report-bold">Hydration matters more than you think.</span> Even mild
          dehydration (2% body weight) reduces VO₂ max by up to 10%. Aim for 0.5 oz per pound
          of body weight daily, more on training days.
        </li>
      </ul>

      <div className="report-divider" />

      <h3 className="report-subhead">What to Avoid</h3>

      <ul className="report-bullets">
        <li>Training in the "gray zone" (Zone 3) too often — it's too hard to recover from quickly but not hard enough to drive top-end adaptation</li>
        <li>Increasing weekly volume by more than 10% per week</li>
        <li>Ignoring persistent fatigue, elevated resting heart rate, or mood changes — these are signs of overtraining</li>
      </ul>

      <span className="report-page-num">7 / 9</span>
    </div>
  );
}
