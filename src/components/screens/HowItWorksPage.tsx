// HowItWorksPage — updated 2026-04-02
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';
import NavBar from '../ui/NavBar';

interface HowItWorksPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
  onLogoClick: () => void;
}

/* ── Regression chart data (same as landing page) ── */
const sampleData = [
  { hr: 95, vo2: 17.3 },
  { hr: 115, vo2: 21.9 },
  { hr: 132, vo2: 26.5 },
  { hr: 151, vo2: 31.1 },
];

const regression = (() => {
  const pts = sampleData.map((d) => ({ x: d.hr, y: d.vo2 }));
  const n = pts.length;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0;
  pts.forEach((p) => { sx += p.x; sy += p.y; sxy += p.x * p.y; sx2 += p.x * p.x; });
  const d = n * sx2 - sx * sx;
  const slope = (n * sxy - sx * sy) / d;
  const intercept = (sy - slope * sx) / n;
  const maxHR = 185;
  const vo2Max = Math.round((slope * maxHR + intercept) * 10) / 10;
  const line: { hr: number; actual?: number; predicted?: number }[] = [];
  for (let i = 0; i <= 40; i++) {
    const hr = 85 + (maxHR - 85) * (i / 40);
    const vo2 = slope * hr + intercept;
    if (hr <= 151) line.push({ hr: Math.round(hr), actual: Math.round(vo2 * 10) / 10 });
    else line.push({ hr: Math.round(hr), predicted: Math.round(vo2 * 10) / 10 });
  }
  return { line, vo2Max, maxHR };
})();

function ScienceChart() {
  return (
    <div style={{ background: '#0a1220', borderRadius: '12px', padding: '12px 4px 4px 0' }}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart margin={{ top: 8, right: 12, bottom: 4, left: -20 }}>
          <CartesianGrid stroke="#1C2F4A" strokeDasharray="3 3" />
          <XAxis dataKey="hr" type="number" domain={[85, 190]} tick={{ fill: '#5A7090', fontSize: 9, fontFamily: 'IBM Plex Mono' }} stroke="#1C2F4A" tickLine={false} />
          <YAxis tick={{ fill: '#5A7090', fontSize: 9, fontFamily: 'IBM Plex Mono' }} stroke="#1C2F4A" tickLine={false} />
          <Line data={regression.line.filter((d) => d.actual !== undefined)} dataKey="actual" stroke="#3B82F6" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line data={regression.line.filter((d) => d.predicted !== undefined)} dataKey="predicted" stroke="#00E5A0" strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
          <Line data={sampleData.map((p) => ({ hr: p.hr, dot: p.vo2 }))} dataKey="dot" stroke="transparent" dot={{ fill: '#3B82F6', r: 4, stroke: '#0D1829', strokeWidth: 2 }} isAnimationActive={false} />
          <ReferenceDot x={regression.maxHR} y={regression.vo2Max} r={5} fill="#00E5A0" stroke="#0D1829" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Classification data ── */
const ageBands = ['15–19', '20–29', '30–39', '40–49', '50–59', '60–65'];

const maleData = [
  { label: 'Excellent', color: '#00E5A0', values: ['60+', '55+', '50+', '46+', '44+', '40+'] },
  { label: 'Good', color: '#06D6A0', values: ['48–59', '44–54', '40–49', '37–45', '35–43', '33–39'] },
  { label: 'Average', color: '#FFD166', values: ['39–47', '35–43', '34–39', '32–36', '29–34', '25–32'] },
  { label: 'Below Avg', color: '#FF8C42', values: ['30–38', '28–34', '26–33', '25–31', '23–28', '20–24'] },
  { label: 'Poor', color: '#FF4444', values: ['<30', '<28', '<26', '<25', '<23', '<20'] },
];

const femaleData = [
  { label: 'Excellent', color: '#00E5A0', values: ['55+', '50+', '46+', '43+', '41+', '39+'] },
  { label: 'Good', color: '#06D6A0', values: ['44–54', '40–49', '36–45', '34–42', '33–40', '31–38'] },
  { label: 'Average', color: '#FFD166', values: ['36–43', '32–39', '30–35', '28–33', '26–32', '24–30'] },
  { label: 'Below Avg', color: '#FF8C42', values: ['29–35', '27–31', '25–29', '22–27', '21–25', '19–23'] },
  { label: 'Poor', color: '#FF4444', values: ['<29', '<27', '<25', '<22', '<21', '<19'] },
];

/* ── Steps data (3 steps) ── */
const steps = [
  {
    title: 'Enter Your Details',
    desc: 'Age, sex, and whether you take beta blockers. Takes 20 seconds.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A7090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'Step to a Guided Pace',
    desc: 'The app coaches you through up to 5 levels, each 2 minutes long, with a metronome and animated step guide. Most people complete 3\u20134 levels.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A7090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h6V14h4V8h6" /><path d="M4 20h16" />
      </svg>
    ),
  },
  {
    title: 'Get Your Score and Insights',
    desc: 'Your VO\u2082 max is calculated using linear regression across your heart rate data. You receive a fitness classification, AI analysis, and an 8-week training protocol.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A7090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

/* ── Comparison cards data ── */
const comparisons = [
  {
    title: 'Lab VO₂ Max Test',
    highlighted: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A7090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3v7.2L6 16a4 4 0 0 0 3.8 5h4.4a4 4 0 0 0 3.8-5l-3-5.8V3" />
        <path d="M9 3h6" /><path d="M7 16h10" />
      </svg>
    ),
    pros: ['Gold standard accurate'],
    cons: ['Requires specialist lab equipment', '$200–500 per test', 'Not repeatable at home'],
  },
  {
    title: 'Wearable Estimate',
    highlighted: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5A7090" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="4" width="12" height="16" rx="6" /><path d="M12 8v4l2 2" />
      </svg>
    ),
    pros: ['Convenient and passive'],
    cons: ['Algorithm-dependent, not validated', 'Cannot be clinically verified'],
  },
  {
    title: 'StepIQ',
    highlighted: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    pros: [
      'Clinically validated CST protocol',
      'Safe submaximal test',
      'Repeatable at home, free',
      'Linear regression scoring',
    ],
    cons: [],
  },
];

/* ── Science cards ── */
const scienceCards = [
  {
    title: 'Chester Step Test Protocol',
    content:
      'The Chester Step Test was developed by K. Sykes and is used in cardiac rehabilitation and occupational health worldwide. It uses a submaximal protocol — meaning it estimates your VO₂ max without pushing you to exhaustion, making it safe for a wide range of fitness levels.',
    chart: false,
  },
  {
    title: 'Linear Regression Scoring',
    content:
      'StepIQ plots your heart rate response at each level and fits a regression line to the data. That line is extrapolated to your predicted maximum heart rate — where it intersects is your VO₂ max estimate. More levels completed means a more accurate result.',
    chart: true,
  },
  {
    title: 'Why VO₂ Max Matters',
    content:
      'VO₂ max is one of the strongest independent predictors of all-cause mortality — more predictive than blood pressure, cholesterol, or BMI in several large studies. Each 1 ml/kg/min improvement is associated with a meaningful reduction in cardiovascular risk.',
    chart: false,
  },
];

/* ── Page component ── */
export default function HowItWorksPage({ onStart, onHowItWorks, onLogoClick, authNavProps }: HowItWorksPageProps) {
  const [tableSex, setTableSex] = useState<'male' | 'female'>('male');
  const tableData = tableSex === 'male' ? maleData : femaleData;

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(28,47,74,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(28,47,74,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(6,12,24,0) 30%, rgba(6,12,24,0.6) 60%, #060C18 100%)' }} />

      <NavBar onStart={onStart} onHowItWorks={onHowItWorks} onLogoClick={onLogoClick} {...authNavProps} />

      <div className="relative z-10">

        {/* ────── SECTION 1: MINI HERO ────── */}
        <section className="hiw-section-pad" style={{ paddingTop: '152px', paddingBottom: '100px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p className="font-mono uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: '#00E5A0', marginBottom: '20px' }}>
              How It Works
            </p>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: '24px' }}>
              Measure Your VO₂ Max — Without a Lab
            </h1>
            <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto' }}>
              Lab testing costs $500. Wearables are educated guesses. StepIQ uses the same clinically validated protocol used in cardiac rehabilitation — at home, in under 12 minutes.
            </p>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div style={{ height: '1px', background: 'rgba(28,47,74,0.6)' }} />

        {/* ────── SECTION 2: THE PROBLEM ────── */}
        <section style={{ background: '#0D1829' }}>
          <div className="hiw-section-pad hiw-section-v">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.76rem, 4.4vw, 2.64rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center', marginBottom: '16px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
                VO₂ Max Is the Best Predictor of Longevity. Most People Can't Measure It.
              </h2>
              <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.8, textAlign: 'center', maxWidth: '600px', margin: '0 auto 56px' }}>
                Lab testing is expensive. Wearables are estimates. There hasn't been a credible middle ground — until now.
              </p>

              {/* Comparison cards */}
              <div className="hiw-compare-grid">
                {comparisons.map((card) => (
                  <div
                    key={card.title}
                    className="relative"
                    style={{
                      background: card.highlighted ? 'rgba(0,229,160,0.04)' : '#0a1220',
                      border: card.highlighted ? '1px solid rgba(0,229,160,0.3)' : '1px solid #1C2F4A',
                      borderRadius: '16px',
                      padding: '28px',
                    }}
                  >
                    {card.highlighted && (
                      <span
                        className="absolute font-mono uppercase"
                        style={{
                          top: '16px', right: '16px',
                          fontSize: '0.55rem', letterSpacing: '0.12em',
                          color: '#00E5A0',
                          background: 'rgba(0,229,160,0.1)',
                          border: '1px solid rgba(0,229,160,0.3)',
                          borderRadius: '20px',
                          padding: '4px 10px',
                        }}
                      >
                        Recommended
                      </span>
                    )}

                    <div style={{ marginBottom: '16px' }}>{card.icon}</div>
                    <h3 className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 600, color: card.highlighted ? '#00E5A0' : '#EEF2FF', marginBottom: '20px' }}>
                      {card.title}
                    </h3>

                    {card.pros.length > 0 && (
                      <div style={{ marginBottom: card.cons.length > 0 ? '16px' : '0' }}>
                        {card.pros.map((pro) => (
                          <div key={pro} className="flex items-start gap-2" style={{ marginBottom: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="font-mono" style={{ fontSize: '0.75rem', color: '#EEF2FF', lineHeight: 1.6 }}>{pro}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {card.cons.length > 0 && (
                      <div>
                        {card.cons.map((con) => (
                          <div key={con} className="flex items-start gap-2" style={{ marginBottom: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4444" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            <span className="font-mono" style={{ fontSize: '0.75rem', color: '#5A7090', lineHeight: 1.6 }}>{con}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div style={{ height: '1px', background: 'rgba(28,47,74,0.6)' }} />

        {/* ────── SECTION 3: HOW IT WORKS ────── */}
        <section className="hiw-section-pad hiw-section-v">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.76rem, 4.4vw, 2.64rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center', marginBottom: '64px' }}>
              How It Works
            </h2>

            <div className="hiw-steps-grid">
              {steps.map((step, i) => (
                <div key={step.title} className="relative" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {/* Connecting arrow on desktop */}
                  {i < steps.length - 1 && (
                    <div className="hiw-step-arrow" />
                  )}

                  {/* Number badge + icon */}
                  <div
                    style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '20px', position: 'relative',
                    }}
                  >
                    <span className="font-mono" style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: '#00E5A0', color: '#060C18', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {i + 1}
                    </span>
                    {step.icon}
                  </div>

                  <h3 className="font-mono uppercase" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', color: '#EEF2FF', marginBottom: '10px' }}>
                    {step.title}
                  </h3>
                  <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.7, maxWidth: '300px' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div style={{ height: '1px', background: 'rgba(28,47,74,0.6)' }} />

        {/* ────── SECTION 4: THE SCIENCE ────── */}
        <section style={{ background: '#0D1829' }}>
          <div className="hiw-section-pad hiw-section-v">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.76rem, 4.4vw, 2.64rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center', marginBottom: '56px' }}>
                Built on Clinical Science
              </h2>

              <div className="hiw-science-grid">
                {scienceCards.map((card) => (
                  <div
                    key={card.title}
                    style={{
                      background: '#0a1220',
                      border: '1px solid #1C2F4A',
                      borderRadius: '16px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <h3 className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#EEF2FF', marginBottom: '16px' }}>
                      {card.title}
                    </h3>
                    <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.8, marginBottom: card.chart ? '20px' : '0', flex: card.chart ? undefined : 1 }}>
                      {card.content}
                    </p>
                    {card.chart && (
                      <div style={{ marginBottom: '0' }}>
                        <ScienceChart />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div style={{ height: '1px', background: 'rgba(28,47,74,0.6)' }} />

        {/* ────── SECTION 5: CLASSIFICATIONS TABLE ────── */}
        <section className="hiw-section-pad hiw-section-v">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.76rem, 4.4vw, 2.64rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center', marginBottom: '16px' }}>
              Where Do You Rank?
            </h2>
            <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.7, textAlign: 'center', maxWidth: '560px', margin: '0 auto 12px' }}>
              Fitness classifications based on Chester Step Test norms (K. Sykes). Used in clinical and occupational health settings worldwide.
            </p>
            <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', textAlign: 'center', marginBottom: '24px' }}>
              Your exact score will be calculated after your test. Use this table to see where you might land.
            </p>

            {/* Sex toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', background: '#0a1220', border: '1px solid #1C2F4A', borderRadius: '10px', padding: '4px' }}>
                {(['male', 'female'] as const).map((sex) => (
                  <button
                    key={sex}
                    onClick={() => setTableSex(sex)}
                    className="font-mono capitalize"
                    style={{
                      fontSize: '0.75rem',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: tableSex === sex ? 'rgba(0,229,160,0.12)' : 'transparent',
                      color: tableSex === sex ? '#00E5A0' : '#5A7090',
                      fontWeight: tableSex === sex ? 600 : 400,
                    }}
                  >
                    {sex}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #1C2F4A' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
                <thead>
                  <tr>
                    <th className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 16px', borderBottom: '1px solid #1C2F4A', background: '#0a1220', fontWeight: 500 }}>
                      CLASSIFICATION
                    </th>
                    {ageBands.map((band) => (
                      <th key={band} className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', letterSpacing: '0.08em', textAlign: 'center', padding: '14px 12px', borderBottom: '1px solid #1C2F4A', background: '#0a1220', fontWeight: 500 }}>
                        {band}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, ri) => (
                    <tr key={row.label} style={{ background: ri % 2 === 0 ? '#0D1829' : '#0a1220' }}>
                      <td style={{ padding: '12px 16px', borderLeft: `3px solid ${row.color}`, borderBottom: ri < tableData.length - 1 ? '1px solid #1C2F4A' : 'none' }}>
                        <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 600, color: row.color }}>
                          {row.label}
                        </span>
                      </td>
                      {row.values.map((val, ci) => (
                        <td key={ci} className="font-mono" style={{ fontSize: '0.72rem', color: '#EEF2FF', textAlign: 'center', padding: '12px', borderBottom: ri < tableData.length - 1 ? '1px solid #1C2F4A' : 'none' }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-mono" style={{ fontSize: '0.6rem', color: '#5A7090', opacity: 0.5, textAlign: 'center', marginTop: '16px' }}>
              Values in ml · kg⁻¹ · min⁻¹
            </p>
          </div>
        </section>

        {/* ── Section divider ── */}
        <div style={{ height: '1px', background: 'rgba(28,47,74,0.6)' }} />

        {/* ────── SECTION 6: FINAL CTA ────── */}
        <section style={{ position: 'relative' }}>
          {/* Top gradient border */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,160,0.4), transparent)' }} />

          <div className="hiw-section-pad hiw-section-v" style={{ textAlign: 'center' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.98rem, 4.4vw, 2.75rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '20px' }}>
              Ready to Find Out Where You Stand?
            </h2>
            <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 40px' }}>
              Takes 10 minutes. No account required. No equipment beyond a step.
            </p>

            <button
              onClick={onStart}
              className="font-mono uppercase cursor-pointer transition-all landing-cta-btn"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#060C18',
                background: '#00E5A0',
                padding: '16px 36px',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 0 40px rgba(0,229,160,0.3)',
              }}
            >
              Start Your Assessment →
            </button>

            <p className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', marginTop: '16px', letterSpacing: '0.05em' }}>
              Join thousands tracking their cardiovascular fitness with StepIQ.
            </p>
          </div>
        </section>

      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        .hiw-section-pad { padding-left: 64px; padding-right: 64px; }
        .hiw-section-v { padding-top: 100px; padding-bottom: 100px; }

        .hiw-compare-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .hiw-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px 80px;
        }

        .hiw-step-arrow {
          display: block;
          position: absolute;
          top: 28px;
          right: -48px;
          width: 16px;
          height: 2px;
          background: rgba(0,229,160,0.3);
        }
        .hiw-step-arrow::after {
          content: '';
          position: absolute;
          right: 0;
          top: -3px;
          width: 0;
          height: 0;
          border-left: 5px solid rgba(0,229,160,0.3);
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
        }

        .hiw-science-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hiw-section-pad { padding-left: 48px; padding-right: 48px; }
          .hiw-compare-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .hiw-steps-grid { grid-template-columns: repeat(3, 1fr); gap: 40px; }
          .hiw-step-arrow { right: -28px; width: 12px; }
          .hiw-science-grid { grid-template-columns: 1fr; max-width: 560px; margin: 0 auto; }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .hiw-section-pad { padding-left: 24px; padding-right: 24px; }
          .hiw-section-v { padding-top: 48px; padding-bottom: 48px; }
          .hiw-compare-grid { grid-template-columns: 1fr; }
          .hiw-steps-grid { grid-template-columns: 1fr; gap: 40px; }
          .hiw-step-arrow { display: none; }
          .hiw-science-grid { grid-template-columns: 1fr; }
        }

        .landing-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(0,229,160,0.45), 0 8px 24px rgba(0,229,160,0.2) !important;
        }
      `}</style>
    </div>
  );
}
