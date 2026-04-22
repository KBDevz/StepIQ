import { useState } from 'react';
import NavBar from '../ui/NavBar';

interface HowItWorksPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
  onLogoClick: () => void;
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
    desc: 'Age, sex, and step height — takes under 30 seconds.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: 'Step to a Guided Pace',
    desc: 'Five 2-minute levels with a metronome and animated step guide — most people complete 3 to 4 levels.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h6V14h4V8h6" /><path d="M4 20h16" />
      </svg>
    ),
  },
  {
    title: 'Get Your Score and Insights',
    desc: 'Linear regression calculates your VO₂ max estimate — you receive a fitness classification, AI analysis, and an 8-week training plan.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];


/* ── Section divider component ── */
function Divider() {
  return <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5, width: '100%' }} />;
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
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5.5vw, 3.3rem)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: '20px' }}>
              The Most Credible Fitness Test You Can Do Without a Lab
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto' }}>
              Peer-reviewed. Validated at r=0.92 against laboratory VO₂ max testing. Used in cardiac rehabilitation and occupational health for decades.
            </p>
          </div>
        </section>

        <Divider />

        {/* ────── SECTION 2: HOW IT WORKS (3 steps) ────── */}
        <section className="hiw-section-pad hiw-section-v">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center', marginBottom: '40px' }}>
              Three Steps to Your VO₂ Score
            </h2>

            <div className="hiw-steps-grid">
              {steps.map((step, i) => (
                <div key={step.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <div className="hiw-step-connector" />
                  )}

                  <div style={{ marginBottom: '12px', color: 'var(--accent)' }}>
                    {step.icon}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: 'var(--accent)', color: 'var(--bg)',
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <h3 style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.78rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)',
                      margin: 0,
                    }}>
                      {step.title}
                    </h3>
                  </div>

                  <p className="font-mono" style={{ fontSize: '0.75rem', color: '#5A7090', lineHeight: 1.7, maxWidth: '280px' }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ────── SECTION 3: CLINICAL CREDIBILITY ────── */}
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
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.65 }}>
                  Developed by K. Sykes, the Chester Step Test is used in cardiac rehabilitation and occupational health worldwide. It's a real clinical assessment tool — not a wellness app feature.
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
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.65 }}>
                  Your heart rate response is plotted across up to five known workloads and a regression line is fitted to the data. Extrapolating to your predicted max HR gives a clinically validated VO₂ estimate.
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
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.65 }}>
                  The test estimates your peak capacity from moderate effort data — no exhaustion required. Safe for a wide range of ages and fitness levels including those returning from illness or injury.
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

        <Divider />

        {/* ────── SECTION 4: CLASSIFICATIONS TABLE ────── */}
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
              Takes 10 minutes. No account required. Just a step platform and a heart rate monitor.
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
            top: 16px;
            left: calc(33.33% * var(--step-i, 1) + 24px);
            width: calc(33.33% - 48px);
            height: 1px;
            background: rgba(0,229,160,0.2);
          }
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hiw-section-pad { padding-left: 48px; padding-right: 48px; }
          .hiw-cred-v { padding-top: 56px; padding-bottom: 56px; }
          .hiw-cred-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .hiw-steps-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .hiw-section-pad { padding-left: 24px; padding-right: 24px; }
          .hiw-section-v { padding-top: 48px; padding-bottom: 48px; }
          .hiw-cred-v { padding-top: 48px; padding-bottom: 48px; }
          .hiw-cred-grid { grid-template-columns: 1fr; }
          .hiw-steps-grid { grid-template-columns: 1fr; gap: 40px; }
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
