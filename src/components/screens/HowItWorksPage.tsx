import { useState } from 'react';
import NavBar from '../ui/NavBar';
import SiteFooter from '../ui/SiteFooter';
import Photo from '../ui/Photo';

interface HowItWorksPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
  onLogoClick: () => void;
}

const ageBands = ['15–19', '20–29', '30–39', '40–49', '50–59', '60–65'];

type Row = { label: string; color: string; values: string[] };
const maleData: Row[] = [
  { label: 'Excellent', color: 'var(--class-excellent)', values: ['60+', '55+', '50+', '46+', '44+', '40+'] },
  { label: 'Good', color: 'var(--class-good)', values: ['48–59', '44–54', '40–49', '37–45', '35–43', '33–39'] },
  { label: 'Average', color: 'var(--class-average)', values: ['39–47', '35–43', '34–39', '32–36', '29–34', '25–32'] },
  { label: 'Below average', color: 'var(--class-below-avg)', values: ['30–38', '28–34', '26–33', '25–31', '23–28', '20–24'] },
  { label: 'Poor', color: 'var(--class-poor)', values: ['<30', '<28', '<26', '<25', '<23', '<20'] },
];
const femaleData: Row[] = [
  { label: 'Excellent', color: 'var(--class-excellent)', values: ['55+', '50+', '46+', '43+', '41+', '39+'] },
  { label: 'Good', color: 'var(--class-good)', values: ['44–54', '40–49', '36–45', '34–42', '33–40', '31–38'] },
  { label: 'Average', color: 'var(--class-average)', values: ['36–43', '32–39', '30–35', '28–33', '26–32', '24–30'] },
  { label: 'Below average', color: 'var(--class-below-avg)', values: ['29–35', '27–31', '25–29', '22–27', '21–25', '19–23'] },
  { label: 'Poor', color: 'var(--class-poor)', values: ['<29', '<27', '<25', '<22', '<21', '<19'] },
];

const steps = [
  { n: '01', title: 'Enter your details', desc: 'Age, sex, and whether you take a beta-blocker. That is all we need to predict your maximum heart rate. Under thirty seconds.' },
  { n: '02', title: 'Step to a guided pace', desc: 'Up to five two-minute levels, each slightly faster, with a metronome and on-screen cues. Most people complete three or four. You stop at a comfortable effort.' },
  { n: '03', title: 'Get your score and plan', desc: 'We fit a regression line through your heart-rate data and project to your maximum. You receive a VO₂ max, a classification, and an eight-week protocol.' },
];

const compare = [
  { label: 'Clinically validated', lab: true, wear: false, cst: true, siq: true },
  { label: 'Accessible at home', lab: false, wear: true, cst: true, siq: true },
  { label: 'Published research basis', lab: true, wear: false, cst: true, siq: true },
  { label: 'Safe at every fitness level', lab: false, wear: true, cst: true, siq: true },
  { label: 'Accuracy vs. lab test', lab: 'Reference standard', wear: '±20%+ (unvalidated)', cst: '±8–10% (r = 0.92)', siq: '±8–10% (r = 0.92)' },
  { label: 'Equipment needed', lab: 'Specialist lab', wear: '$200–400 device', cst: '30 cm step', siq: '30 cm step' },
  { label: 'Cost', lab: '$300–500', wear: '$200–400', cst: 'Free', siq: 'Free' },
] as const;

const Cell = ({ v, strong }: { v: boolean | string; strong?: boolean }) =>
  typeof v === 'boolean' ? (
    <span style={{ color: v ? 'var(--accent)' : 'var(--text3)', fontWeight: 700 }}>{v ? '✓' : '—'}</span>
  ) : (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: strong ? 'var(--accent)' : 'var(--text2)', fontWeight: strong ? 600 : 400 }}>{v}</span>
  );

export default function HowItWorksPage({ onStart, onHowItWorks, onLogoClick, authNavProps }: HowItWorksPageProps) {
  const [tableSex, setTableSex] = useState<'male' | 'female'>('male');
  const tableData = tableSex === 'male' ? maleData : femaleData;

  const th: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', padding: '14px 16px', textAlign: 'center', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <NavBar onStart={onStart} onHowItWorks={onHowItWorks} onLogoClick={onLogoClick} {...authNavProps} />

      <main style={{ paddingTop: '72px' }}>

        {/* ── HERO ── */}
        <section className="mk-section" style={{ paddingTop: '64px', paddingBottom: '48px' }}>
          <div className="mk-narrow" style={{ textAlign: 'center' }}>
            <p className="mk-eyebrow">The science</p>
            <h1 className="mk-display-xl" style={{ marginBottom: '22px' }}>The most credible fitness test you can do <em>without a lab.</em></h1>
            <p className="mk-lede" style={{ maxWidth: '620px', margin: '0 auto' }}>
              Peer-reviewed. Validated at r = 0.92 against laboratory VO₂ max. Used in cardiac rehabilitation and occupational health for more than two decades.
            </p>
          </div>
          <div className="mk-container" style={{ marginTop: '56px' }}>
            <Photo name="hero-facilities.jpg" alt="A guided step test in a bright, airy studio" ratio="21 / 9" radius={28} priority hint="Wide hero — step test in progress" />
          </div>
        </section>

        {/* ── THREE STEPS ── */}
        <section className="mk-section">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">How it works</p>
              <h2 className="mk-display-lg">Three steps to your VO₂ score.</h2>
            </div>
            <div className="mk-grid-3">
              {steps.map((s) => (
                <div key={s.n} className="mk-card mk-card--flat">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--clay)', lineHeight: 1, marginBottom: '16px' }}>{s.n}</p>
                  <h3 className="mk-display-md" style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{s.title}</h3>
                  <p className="mk-body">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY IT WORKS ── */}
        <section className="mk-section mk-section--tinted">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
              <p className="mk-eyebrow">Why the Chester Step Test</p>
              <h2 className="mk-display-lg">Developed in clinics. <em>Proven in research.</em></h2>
            </div>
            <div className="mk-grid-3">
              {[
                { t: 'Clinical pedigree', b: 'Developed by Kevin Sykes for cardiac rehabilitation and occupational health, the Chester Step Test is a real clinical assessment tool — not a wellness-app feature.' },
                { t: 'The method', b: 'Your heart-rate response is plotted across up to five known workloads and a regression line is fitted. Extrapolating to your predicted maximum gives a validated VO₂ estimate.' },
                { t: 'Submaximal by design', b: 'The test estimates peak capacity from moderate-effort data. No exhaustion required, which makes it safe across ages and fitness levels, including people returning from illness.' },
              ].map((c) => (
                <div key={c.t} className="mk-card">
                  <h3 className="mk-display-md" style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{c.t}</h3>
                  <p className="mk-body">{c.b}</p>
                </div>
              ))}
            </div>

            {/* Validation */}
            <div className="mk-card" style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start', borderColor: 'var(--accent)' }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </span>
              <div>
                <h3 className="mk-display-md" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Validated in peer-reviewed research</h3>
                <p className="mk-body" style={{ marginBottom: '12px' }}>
                  Against direct laboratory VO₂ max measurement the Chester Step Test correlates at r = 0.92, with a standard error of roughly ±3.0–3.5 ml/kg/min — the most accurate submaximal cardiovascular test you can perform without specialist equipment.
                </p>
                <p className="mk-small" style={{ fontStyle: 'italic' }}>Sykes K, Roberts A. (2004). The Chester step test: a simple yet effective tool for the prediction of aerobic capacity. <em>Occupational Medicine</em>, 54(4), 304–312.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON ── */}
        <section className="mk-section">
          <div className="mk-container">
            <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
              <p className="mk-eyebrow">How it compares</p>
              <h2 className="mk-display-lg">Lab accuracy. Living-room access.</h2>
            </div>
            <div className="mk-card mk-card--flat" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
                  <thead>
                    <tr>
                      <th style={{ ...th, textAlign: 'left' }}>&nbsp;</th>
                      <th style={th}>Lab VO₂ test</th>
                      <th style={th}>Wearable</th>
                      <th style={th}>Chester Step Test</th>
                      <th style={{ ...th, color: 'var(--accent)', background: 'var(--accent-soft)' }}>StepIQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compare.map((r, i) => {
                      const accuracy = r.label.startsWith('Accuracy');
                      return (
                        <tr key={r.label} style={{ background: i % 2 ? 'var(--surface2)' : 'var(--surface)' }}>
                          <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)', padding: '16px', borderBottom: '1px solid var(--border)' }}>{r.label}</td>
                          <td style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--border)' }}><Cell v={r.lab} /></td>
                          <td style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--border)' }}><Cell v={r.wear} /></td>
                          <td style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--border)' }}><Cell v={r.cst} strong={accuracy} /></td>
                          <td style={{ textAlign: 'center', padding: '16px', borderBottom: '1px solid var(--border)', background: 'var(--accent-soft)' }}><Cell v={r.siq} strong={accuracy} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── CLASSIFICATIONS ── */}
        <section className="mk-section mk-section--tinted">
          <div className="mk-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <div style={{ maxWidth: '640px' }}>
                <p className="mk-eyebrow">Where do you rank?</p>
                <h2 className="mk-display-lg" style={{ marginBottom: '12px' }}>Fitness classifications by age and sex.</h2>
                <p className="mk-body">Chester Step Test norms. Your exact score is calculated after your test — use this to see where you might land.</p>
              </div>
              <div style={{ display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999, padding: 4 }}>
                {(['male', 'female'] as const).map((sex) => (
                  <button key={sex} type="button" onClick={() => setTableSex(sex)} style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600, padding: '8px 20px', borderRadius: 999, border: 'none', cursor: 'pointer', textTransform: 'capitalize', background: tableSex === sex ? 'var(--accent)' : 'transparent', color: tableSex === sex ? '#fff' : 'var(--text2)', transition: 'all 0.15s' }}>
                    {sex}
                  </button>
                ))}
              </div>
            </div>

            <div className="mk-card mk-card--flat" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
                  <thead>
                    <tr>
                      <th style={{ ...th, textAlign: 'left' }}>Age</th>
                      {ageBands.map((b) => <th key={b} style={th}>{b}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, ri) => (
                      <tr key={row.label} style={{ background: ri % 2 ? 'var(--surface2)' : 'var(--surface)' }}>
                        <td style={{ padding: '14px 16px', borderLeft: `4px solid ${row.color}`, borderBottom: '1px solid var(--border)' }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>{row.label}</span>
                        </td>
                        {row.values.map((v, ci) => (
                          <td key={ci} style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text2)', textAlign: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mk-small" style={{ marginTop: '14px' }}>Values in ml · kg⁻¹ · min⁻¹. Source: K. Sykes, Chester Step Test Resource Pack.</p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mk-section mk-section--ink">
          <div className="mk-narrow" style={{ textAlign: 'center' }}>
            <h2 className="mk-display-lg" style={{ color: '#F4F7F5', marginBottom: '16px' }}>Ready to find out where you stand?</h2>
            <p className="mk-lede" style={{ marginBottom: '32px' }}>Ten minutes. No account. Just a step and a heart-rate monitor.</p>
            <button type="button" onClick={onStart} className="mk-btn mk-btn--onink mk-btn--lg">Start your assessment</button>
          </div>
        </section>
      </main>

      <SiteFooter onStart={onStart} onHowItWorks={onHowItWorks} />
    </div>
  );
}
