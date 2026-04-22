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

/* ── Regression chart data ── */
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
const ageBands = ['15\u201319', '20\u201329', '30\u201339', '40\u201349', '50\u201359', '60\u201365'];

const maleData = [
  { label: 'Excellent', color: '#00E5A0', values: ['60+', '55+', '50+', '46+', '44+', '40+'] },
  { label: 'Good', color: '#06D6A0', values: ['48\u201359', '44\u201354', '40\u201349', '37\u201345', '35\u201343', '33\u201339'] },
  { label: 'Average', color: '#FFD166', values: ['39\u201347', '35\u201343', '34\u201339', '32\u201336', '29\u201334', '25\u201332'] },
  { label: 'Below Avg', color: '#FF8C42', values: ['30\u201338', '28\u201334', '26\u201333', '25\u201331', '23\u201328', '20\u201324'] },
  { label: 'Poor', color: '#FF4444', values: ['<30', '<28', '<26', '<25', '<23', '<20'] },
];

const femaleData = [
  { label: 'Excellent', color: '#00E5A0', values: ['55+', '50+', '46+', '43+', '41+', '39+'] },
  { label: 'Good', color: '#06D6A0', values: ['44\u201354', '40\u201349', '36\u201345', '34\u201342', '33\u201340', '31\u201338'] },
  { label: 'Average', color: '#FFD166', values: ['36\u201343', '32\u201339', '30\u201335', '28\u201333', '26\u201332', '24\u201330'] },
  { label: 'Below Avg', color: '#FF8C42', values: ['29\u201335', '27\u201331', '25\u201329', '22\u201327', '21\u201325', '19\u201323'] },
  { label: 'Poor', color: '#FF4444', values: ['<29', '<27', '<25', '<22', '<21', '<19'] },
];

/* ── 3 Steps data ── */
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
    desc: 'The app coaches you through up to 5 levels, each 2 minutes long, with a metronome and animated step guide. Most people complete 3 to 4 levels.',
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

/* ── Science cards ── */
const scienceCards = [
  {
    title: 'Chester Step Test Protocol',
    content: 'The Chester Step Test was developed by K. Sykes and is used in cardiac rehabilitation and occupational health worldwide. It uses a submaximal protocol \u2014 meaning it estimates your VO\u2082 max without pushing you to exhaustion, making it safe for a wide range of fitness levels.',
    chart: false,
  },
  {
    title: 'Linear Regression Scoring',
    content: 'StepIQ plots your heart rate response at each level and fits a regression line to the data. That line is extrapolated to your predicted maximum heart rate \u2014 where it intersects is your VO\u2082 max estimate. More levels completed means a more accurate result.',
    chart: true,
  },
  {
    title: 'Why VO\u2082 Max Matters',
    content: 'VO\u2082 max is one of the strongest independent predictors of all-cause mortality \u2014 more predictive than blood pressure, cholesterol, or BMI in several large studies. Each 1 ml/kg/min improvement is associated with a meaningful reduction in cardiovascular risk.',
    chart: false,
  },
];

/* ── Section divider component ── */
function Divider() {
  return <div style={{ height: '1px', background: 'rgba(28,47,74,0.6)' }} />;
}

/* ══════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════ */
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

        {/* ────── SECTION 1: HERO ────── */}
        <section className="hiw-section-pad" style={{ paddingTop: '152px', paddingBottom: '100px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px' }}>
              Why the Chester Step Test
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5.5vw, 3.3rem)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: '24px' }}>
              The Most Credible Fitness Test You Can Do Without a Lab
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 400, color: 'var(--text2)', lineHeight: 1.65, maxWidth: '620px', margin: '0 auto 16px' }}>
              VO₂ max is the single strongest predictor of how long — and how well — you'll live. Yet most people have never measured it.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.75, maxWidth: '620px', margin: '0 auto' }}>
              Lab testing is the gold standard but costs $300–500 and requires specialist equipment. Wearables are convenient but algorithmically estimated and clinically unvalidated. The Chester Step Test has been used in cardiac rehabilitation and occupational health for decades — and StepIQ brings it to your living room.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text2)', fontStyle: 'italic', maxWidth: '600px', margin: '16px auto 0', textAlign: 'center', lineHeight: 1.75 }}>
              Peer-reviewed research shows the Chester Step Test correlates with laboratory VO₂ max at r=0.92 — typically accurate to within ±3-4 ml/kg/min of your true value when performed correctly.
            </p>
          </div>
        </section>

        {/* ────── SECTION: CLINICAL CREDIBILITY ────── */}
        <section
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="hiw-section-pad hiw-cred-v" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, textAlign: 'center', marginBottom: '12px' }}>
              Why the Chester Step Test Works
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text2)', textAlign: 'center', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.65 }}>
              Developed in clinical settings. Validated in peer-reviewed research. Used in cardiac rehabilitation worldwide.
            </p>

            {/* 3 credibility cards */}
            <div className="hiw-cred-grid">
              {/* Card 1 — Clinical Pedigree */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '14px' }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5" />
                </svg>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>
                  Clinical Pedigree
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                  Developed by K. Sykes and validated in peer-reviewed research, the Chester Step Test has been used in cardiac rehabilitation, occupational health screening, and sports medicine for decades. It is a real clinical assessment tool — not a wellness app feature.
                </p>
              </div>

              {/* Card 2 — The Science Behind It */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '14px' }}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>
                  The Science Behind It
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                  The test measures your heart rate response to progressively increasing stepping loads. Because heart rate and oxygen consumption have a well-established linear relationship, extrapolating your HR response to your predicted maximum gives a reliable estimate of your aerobic capacity — without pushing you to exhaustion.
                </p>
              </div>

              {/* Card 3 — Submaximal by Design */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '14px' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>
                  Submaximal by Design
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                  Unlike a maximal treadmill test, the Chester Step Test is submaximal — it estimates your peak capacity from moderate effort data. This makes it safe for a wide range of fitness levels and ages, including those returning from illness or injury or new to exercise.
                </p>
              </div>
            </div>

            {/* ── Comparison Table ── */}
            <div style={{ marginTop: '64px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text2)', textAlign: 'center', marginBottom: '20px' }}>
                How It Compares
              </p>

              <div className="hiw-compare-table-wrap" style={{ maxWidth: '860px', margin: '0 auto', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface2)' }}>
                        <th style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', textAlign: 'left', padding: '12px 16px', fontWeight: 500 }}>&nbsp;</th>
                        <th style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', textAlign: 'center', padding: '12px 16px', fontWeight: 500 }}>Lab VO₂ Test</th>
                        <th style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', textAlign: 'center', padding: '12px 16px', fontWeight: 500 }}>Wearable</th>
                        <th style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', textAlign: 'center', padding: '12px 16px', fontWeight: 500 }}>Chester Step Test</th>
                        <th style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', textAlign: 'center', padding: '12px 16px', fontWeight: 500, borderLeft: '3px solid var(--accent)' }}>StepIQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Clinically validated', lab: true, wearable: false, chester: true, stepiq: true },
                        { label: 'Accessible at home', lab: false, wearable: true, chester: true, stepiq: true },
                        { label: 'Published research basis', lab: true, wearable: false, chester: true, stepiq: true },
                        { label: 'Safe for all fitness levels', lab: false, wearable: true, chester: true, stepiq: true },
                        { label: 'Accuracy vs lab test', lab: 'Reference standard', wearable: '±20%+ (unvalidated)', chester: '±8-10% (r=0.92)', stepiq: '±8-10% (r=0.92)', accentAccuracy: true },
                        { label: 'Equipment needed', lab: 'Specialist lab', wearable: '$200–400 device', chester: '30cm step', stepiq: '30cm step' },
                        { label: 'Cost', lab: '$300–500', wearable: '$200–400', chester: 'Free', stepiq: 'Free' },
                      ].map((row, i) => (
                        <tr key={row.label} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg)' }}>
                          <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)', padding: '14px 16px', textAlign: 'left' }}>{row.label}</td>
                          {(['lab', 'wearable', 'chester', 'stepiq'] as const).map((col) => {
                            const val = row[col];
                            const isStepiq = col === 'stepiq';
                            return (
                              <td key={col} style={{ textAlign: 'center', padding: '14px 16px', borderLeft: isStepiq ? '3px solid var(--accent)' : undefined }}>
                                {typeof val === 'boolean' ? (
                                  <span style={{ fontSize: '1rem', fontWeight: 700, color: val ? 'var(--accent)' : 'var(--danger)' }}>{val ? '✓' : '✗'}</span>
                                ) : (
                                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: (row as Record<string, unknown>).accentAccuracy && (col === 'chester' || col === 'stepiq') ? 'var(--accent)' : 'var(--text2)', fontWeight: (row as Record<string, unknown>).accentAccuracy && (col === 'chester' || col === 'stepiq') ? 600 : undefined }}>{val}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clinical reference */}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text3)', fontStyle: 'italic', textAlign: 'center', maxWidth: '600px', margin: '24px auto 0', lineHeight: 1.7 }}>
                The Chester Step Test was designed by K. Sykes (1998) for cardiac rehabilitation and occupational health settings. Reference: Sykes K. (1998) Chester Step Test Resource Pack. Cheshire: Physique Management Co.
              </p>

              {/* Validation callout box */}
              <div style={{ background: 'var(--accent-dark)', border: '1px solid rgba(0,184,162,0.2)', borderRadius: '12px', padding: '24px 28px', maxWidth: '760px', margin: '32px auto 0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                    Validated in Peer-Reviewed Research
                  </h4>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.75 }}>
                    The Chester Step Test has been validated against direct laboratory VO₂ max measurement with a correlation coefficient of r=0.92 (Sykes & Roberts, 2004). The standard error of estimate is approximately ±3.0-3.5 ml/kg/min, making it the most accurate submaximal cardiovascular fitness test you can perform without specialist equipment.
                  </p>
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text3)', fontStyle: 'italic', lineHeight: 1.6 }}>
                      Reference: Sykes K, Roberts A. (2004). The Chester step test: a simple yet effective tool for the prediction of aerobic capacity. Occupational Medicine, 54(4), 304-312.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────── SECTION: ACCURACY VISUALIZATION ────── */}
        <section className="hiw-section-pad hiw-section-v">
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '16px' }}>
              How Accurate Is It?
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>
              Closer to a Lab Test Than Anything Else Available
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text2)', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.75 }}>
              Independent validation studies show the Chester Step Test produces results within 8-10% of laboratory-measured VO₂ max — significantly more accurate than consumer wearable estimates.
            </p>

            {/* Accuracy bar chart */}
            <div style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', textAlign: 'left' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text2)', marginBottom: '24px' }}>
                Accuracy vs Laboratory VO₂ Max Test
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Row 1 — Lab */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text)' }}>Lab VO₂ Max Test</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)' }}>Direct measurement</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#4A9EFF' }}>Gold Standard</span>
                  </div>
                  <div style={{ width: '100%', height: '24px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: '#4A9EFF', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* Row 2 — Chester/StepIQ */}
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px' }}>★ Recommended</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 700 }}>Chester Step Test (StepIQ)</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)' }}>Validated submaximal protocol · r=0.92</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)' }}>±8-10%</span>
                  </div>
                  <div style={{ width: '100%', height: '24px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '91%', height: '100%', background: 'var(--accent)', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* Row 3 — Wearables */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text2)' }}>Consumer Wearables</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)' }}>Algorithmic estimate · no validated protocol</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text2)' }}>±20%+</span>
                  </div>
                  <div style={{ width: '100%', height: '24px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '72%', height: '100%', background: 'var(--text3)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text3)', fontStyle: 'italic', marginTop: '16px', lineHeight: 1.6 }}>
                * Accuracy figures based on Sykes & Roberts (2004), Occupational Medicine. Laboratory VO₂ max testing used as reference standard. Wearable accuracy based on published independent validation studies.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* ────── SECTION 3: HOW IT WORKS (3 steps) ────── */}
        <section className="hiw-section-pad hiw-section-v">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.76rem, 4.4vw, 2.64rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center', marginBottom: '64px' }}>
              How It Works
            </h2>

            <div className="hiw-steps-grid">
              {steps.map((step, i) => (
                <div key={step.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                  {/* Connecting line on desktop */}
                  {i < steps.length - 1 && (
                    <div className="hiw-step-connector" />
                  )}

                  {/* Number badge */}
                  <div
                    style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'rgba(0,229,160,0.12)', border: '2px solid rgba(0,229,160,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '1rem', fontWeight: 700, color: '#00E5A0',
                      marginBottom: '16px',
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div style={{ marginBottom: '16px', opacity: 0.7 }}>{step.icon}</div>

                  <h3 className="font-mono uppercase" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', color: '#EEF2FF', marginBottom: '10px' }}>
                    {step.title}
                  </h3>
                  <p className="font-mono" style={{ fontSize: '0.75rem', color: '#5A7090', lineHeight: 1.7, maxWidth: '280px' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

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
                    <p className="font-mono" style={{ fontSize: '0.75rem', color: '#5A7090', lineHeight: 1.8, marginBottom: card.chart ? '20px' : '0', flex: card.chart ? undefined : 1 }}>
                      {card.content}
                    </p>
                    {card.chart && <ScienceChart />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ────── SECTION 5: CLASSIFICATIONS TABLE ────── */}
        <section className="hiw-section-pad hiw-section-v">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.76rem, 4.4vw, 2.64rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center', marginBottom: '16px' }}>
              Where Do You Rank?
            </h2>
            <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.7, textAlign: 'center', maxWidth: '560px', margin: '0 auto 8px' }}>
              Fitness classifications based on Chester Step Test norms by K. Sykes.
            </p>
            <p className="font-mono" style={{ fontSize: '0.72rem', color: '#5A7090', textAlign: 'center', marginBottom: '32px' }}>
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
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(28,47,74,0.6)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
                <thead>
                  <tr>
                    <th className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', letterSpacing: '0.1em', textAlign: 'left', padding: '11px 13px', borderBottom: '1px solid rgba(28,47,74,0.6)', background: '#0a1220', fontWeight: 500 }}>
                      CLASSIFICATION
                    </th>
                    {ageBands.map((band) => (
                      <th key={band} className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', letterSpacing: '0.08em', textAlign: 'center', padding: '11px 10px', borderBottom: '1px solid rgba(28,47,74,0.6)', background: '#0a1220', fontWeight: 500 }}>
                        {band}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, ri) => (
                    <tr key={row.label} style={{ background: ri % 2 === 0 ? '#0D1829' : '#0a1220' }}>
                      <td style={{ padding: '10px 13px', borderLeft: `3px solid ${row.color}`, borderBottom: ri < tableData.length - 1 ? '1px solid rgba(28,47,74,0.6)' : 'none' }}>
                        <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 600, color: row.color }}>
                          {row.label}
                        </span>
                      </td>
                      {row.values.map((val, ci) => (
                        <td key={ci} className="font-mono" style={{ fontSize: '0.72rem', color: '#EEF2FF', textAlign: 'center', padding: '10px', borderBottom: ri < tableData.length - 1 ? '1px solid rgba(28,47,74,0.6)' : 'none' }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-mono" style={{ fontSize: '0.6rem', color: '#5A7090', opacity: 0.5, textAlign: 'center', marginTop: '16px' }}>
              Values in ml &middot; kg&#x207B;&#xB9; &middot; min&#x207B;&#xB9;
            </p>
          </div>
        </section>

        <Divider />

        {/* ────── SECTION 6: FINAL CTA ────── */}
        <section style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,229,160,0.4), transparent)' }} />

          <div className="hiw-section-pad hiw-section-v" style={{ textAlign: 'center' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '20px' }}>
              Ready to Find Out Where You Stand?
            </h2>
            <p className="font-mono" style={{ fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 40px' }}>
              Takes 10 minutes. No account required. Just a step and a heart rate monitor.
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
              Start Your Assessment &rarr;
            </button>

            <p className="font-mono" style={{ fontSize: '0.65rem', color: '#5A7090', marginTop: '12px' }}>
              Join thousands tracking their cardiovascular fitness with StepIQ.
            </p>
          </div>
        </section>

      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        .hiw-section-pad { padding-left: 64px; padding-right: 64px; }
        .hiw-section-v { padding-top: 100px; padding-bottom: 100px; }

        .hiw-cred-v { padding-top: 80px; padding-bottom: 80px; }
        .hiw-cred-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .hiw-compare-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .hiw-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          position: relative;
        }

        .hiw-step-connector {
          display: none;
        }

        @media (min-width: 768px) {
          .hiw-step-connector {
            display: block;
            position: absolute;
            top: 24px;
            left: calc(33.33% * var(--step-i, 1) + 24px);
            width: calc(33.33% - 48px);
            height: 1px;
            background: rgba(0,229,160,0.2);
          }
        }

        .hiw-science-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hiw-section-pad { padding-left: 48px; padding-right: 48px; }
          .hiw-cred-v { padding-top: 56px; padding-bottom: 56px; }
          .hiw-cred-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .hiw-compare-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
          .hiw-steps-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; }
          .hiw-science-grid { grid-template-columns: 1fr; max-width: 560px; margin: 0 auto; }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .hiw-section-pad { padding-left: 24px; padding-right: 24px; }
          .hiw-section-v { padding-top: 48px; padding-bottom: 48px; }
          .hiw-cred-v { padding-top: 48px; padding-bottom: 48px; }
          .hiw-cred-grid { grid-template-columns: 1fr; }
          .hiw-compare-grid { grid-template-columns: 1fr; }
          .hiw-steps-grid { grid-template-columns: 1fr; gap: 40px; }
          .hiw-science-grid { grid-template-columns: 1fr; }
          .hiw-compare-table-wrap { margin-left: -24px; margin-right: -24px; border-radius: 0 !important; border-left: none !important; border-right: none !important; }
          .hiw-compare-table-wrap td:first-child,
          .hiw-compare-table-wrap th:first-child {
            position: sticky;
            left: 0;
            background: var(--surface);
            z-index: 2;
          }
        }

        .landing-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(0,229,160,0.45), 0 8px 24px rgba(0,229,160,0.2) !important;
        }
      `}</style>
    </div>
  );
}
