import { useState, useEffect } from 'react';
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
import ThemeToggle from '../ui/ThemeToggle';

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
  authNavProps?: { userName: string | null; onSignIn: () => void; onSignOut: () => void };
}

/* ─────────────────────────────────────────────
   Sample regression data for the preview chart
   ───────────────────────────────────────────── */
const sampleData = [
  { level: 1, hr: 95, vo2: 17.3 },
  { level: 2, hr: 115, vo2: 21.9 },
  { level: 3, hr: 132, vo2: 26.5 },
  { level: 4, hr: 151, vo2: 31.1 },
];

const regressionLine = (() => {
  const pts = sampleData.map((d) => ({ x: d.hr, y: d.vo2 }));
  const n = pts.length;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0;
  pts.forEach((p) => {
    sx += p.x;
    sy += p.y;
    sxy += p.x * p.y;
    sx2 += p.x * p.x;
  });
  const d = n * sx2 - sx * sx;
  const slope = (n * sxy - sx * sy) / d;
  const intercept = (sy - slope * sx) / n;
  const maxHR = 185;
  const vo2Max = Math.round((slope * maxHR + intercept) * 10) / 10;

  const line: { hr: number; actual?: number; predicted?: number }[] = [];
  for (let i = 0; i <= 40; i++) {
    const hr = 85 + (maxHR - 85) * (i / 40);
    const vo2 = slope * hr + intercept;
    if (hr <= 151) {
      line.push({ hr: Math.round(hr), actual: Math.round(vo2 * 10) / 10 });
    } else {
      line.push({ hr: Math.round(hr), predicted: Math.round(vo2 * 10) / 10 });
    }
  }
  return { line, vo2Max, maxHR };
})();

function PreviewChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart margin={{ top: 8, right: 12, bottom: 4, left: -20 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="hr"
          type="number"
          domain={[85, 190]}
          tick={{ fill: 'var(--text2)', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
          stroke="var(--border)"
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text2)', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
          stroke="var(--border)"
          tickLine={false}
        />
        <Line
          data={regressionLine.line.filter((d) => d.actual !== undefined)}
          dataKey="actual"
          stroke="#4A9EFF"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          data={regressionLine.line.filter((d) => d.predicted !== undefined)}
          dataKey="predicted"
          stroke="var(--class-good)"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          data={sampleData.map((p) => ({ hr: p.hr, dot: p.vo2 }))}
          dataKey="dot"
          stroke="transparent"
          dot={{ fill: '#4A9EFF', r: 4, stroke: 'var(--surface)', strokeWidth: 2 }}
          isAnimationActive={false}
        />
        <ReferenceDot
          x={regressionLine.maxHR}
          y={regressionLine.vo2Max}
          r={5}
          fill="var(--class-good)"
          stroke="var(--surface)"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─────────────────────────────────────────────
   Sample Result card (top right)
   ───────────────────────────────────────────── */
function SampleResultCard() {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Row 1 — label + classification badge */}
      <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
        <span
          className="uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.14em',
            color: 'var(--text2)',
          }}
        >
          Sample Result
        </span>
        <span
          className="uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'var(--class-good)',
            background: 'rgba(6,214,160,0.1)',
            border: '1px solid rgba(6,214,160,0.3)',
            borderRadius: '20px',
            padding: '3px 10px',
          }}
        >
          Good
        </span>
      </div>

      {/* Score label */}
      <div
        className="uppercase"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.52rem',
          letterSpacing: '0.14em',
          color: 'var(--text2)',
          marginBottom: '6px',
        }}
      >
        VO₂ Max Estimate
      </div>

      {/* Score number */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '4.5rem',
          color: 'var(--class-good)',
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        41.2
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'var(--text2)',
          marginTop: '6px',
          marginBottom: '16px',
        }}
      >
        ml · kg⁻¹ · min⁻¹
      </div>

      {/* Chart */}
      <div
        style={{
          background: 'var(--surface2)',
          borderRadius: '8px',
          padding: '8px 4px',
        }}
      >
        <PreviewChart />
      </div>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text2)',
          textAlign: 'center',
          marginTop: '12px',
        }}
      >
        4 of 5 levels · Age 35 · Male
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Test Preview card (bottom right)
   ───────────────────────────────────────────── */
function TestPreviewCard() {
  return (
    <div
      className="landing-preview-card"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Mini phone mockup */}
      <div
        style={{
          width: '80px',
          height: '120px',
          flexShrink: 0,
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          position: 'relative',
        }}
      >
        <span
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text)', lineHeight: 1, fontWeight: 700 }}
        >
          2
        </span>
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text2)' }}
        >
          1:43
        </span>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 6px var(--accent)',
            marginTop: '2px',
          }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--text)',
            fontWeight: 600,
            marginBottom: '6px',
          }}
        >
          Guided, beat by beat.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--text2)',
            lineHeight: 1.6,
          }}
        >
          The app sets the pace with a metronome and guides you through each
          level. Check your heart rate at the end of each stage.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Landing Page
   ───────────────────────────────────────────── */
export default function LandingPage({ onStart, onHowItWorks, authNavProps }: LandingPageProps) {
  const pills = ['Free · No Signup', 'Clinically Validated', 'Personalized Insights'];
  const [showSticky, setShowSticky] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
      setShowSticky(distFromBottom >= 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <NavBar onStart={onStart} onHowItWorks={onHowItWorks} {...authNavProps} />

      {/* ── HERO ── */}
      <section
        className="relative z-10"
        style={{
          minHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="landing-container"
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 64px',
          }}
        >
          <div className="landing-grid">
            {/* ── LEFT COLUMN ── */}
            <div style={{ paddingTop: '40px', paddingBottom: '40px' }}>
              {/* Eyebrow */}
              <p
                className="uppercase landing-stagger-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  color: 'var(--accent)',
                  marginBottom: '24px',
                }}
              >
                At-Home VO₂ Max Assessment
              </p>

              {/* Desktop Headline */}
              <h1
                className="landing-stagger-2 landing-headline landing-desktop-only"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  margin: 0,
                  marginBottom: '12px',
                }}
              >
                VO₂ max is the #1 predictor of how long you'll live.
              </h1>

              {/* Desktop Sub-headline */}
              <p
                className="landing-stagger-2 landing-desktop-only"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--accent)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                  marginBottom: '28px',
                }}
              >
                This is the easiest way to measure yours.
              </p>

              {/* Mobile Headline */}
              <h1
                className="landing-stagger-2 landing-mobile-only"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.4rem',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: 0,
                  marginBottom: '16px',
                }}
              >
                <span style={{ color: 'var(--text)', display: 'block' }}>Know your VO₂ max.</span>
                <span style={{ color: 'var(--accent)', display: 'block' }}>Train smarter.</span>
                <span style={{ color: 'var(--accent)', display: 'block' }}>Live longer.</span>
              </h1>

              {/* Mobile Subheadline */}
              <p
                className="landing-stagger-3 landing-mobile-only"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text2)',
                  lineHeight: 1.65,
                  marginBottom: '20px',
                }}
              >
                A free, science-backed 10-minute step test that shows your true
                fitness level — and exactly how to improve it.
              </p>

              {/* Desktop Description */}
              <p
                className="landing-stagger-3 landing-desktop-only"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  color: 'var(--text2)',
                  lineHeight: 1.75,
                  maxWidth: '520px',
                  marginBottom: '28px',
                }}
              >
                StepIQ is a free, clinically validated 10-minute step test.
                Get your VO₂ max score, see how you compare, and receive
                a personalized plan to improve it. No lab visit. No signup.
              </p>

              {/* Trust badges — desktop */}
              <div
                className="flex flex-wrap landing-stagger-4 landing-desktop-only"
                style={{ gap: '8px', marginBottom: '20px' }}
              >
                {pills.map((pill) => (
                  <span
                    key={pill}
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      color: 'var(--accent)',
                      background: 'var(--accent-dark)',
                      border: '1px solid rgba(0,184,162,0.25)',
                      padding: '5px 12px',
                      borderRadius: '20px',
                    }}
                  >
                    ✓ {pill}
                  </span>
                ))}
              </div>

              {/* Trust bullets — mobile */}
              <div className="landing-stagger-4 landing-mobile-only" style={{ marginBottom: '20px' }}>
                {[
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: 'Clinically Validated' },
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, text: 'No Signup Required' },
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>, text: 'Works With Any Device' },
                ].map((item) => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {item.icon}
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* What You Need strip */}
              <div
                className="landing-stagger-4 landing-need-strip"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '14px 24px',
                  marginBottom: '32px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxWidth: '100%',
                  gap: '8px',
                }}
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>10 Minutes</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)' }}>to complete</span>
                </div>
                <div className="landing-need-divider" style={{ width: '1px', height: '28px', background: 'var(--border)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>HR Monitor</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)' }}>watch or strap</span>
                </div>
                <div className="landing-need-divider" style={{ width: '1px', height: '28px', background: 'var(--border)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>12&quot; Step</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)', fontStyle: 'italic' }}>or measure your stairs</span>
                </div>
                <div className="landing-need-divider" style={{ width: '1px', height: '28px', background: 'var(--border)', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>Your Phone</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text2)' }}>any browser</span>
                </div>
              </div>

              {/* CTA */}
              <div className="landing-stagger-5">
                <div className="landing-cta-row">
                  <button
                    onClick={onStart}
                    className="landing-cta-btn uppercase cursor-pointer transition-all"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      flex: '0 0 60%',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      color: 'var(--bg)',
                      background: 'var(--accent)',
                      padding: '15px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: 'var(--shadow-accent)',
                    }}
                  >
                    Start Free Assessment →
                  </button>
                  <button
                    onClick={onHowItWorks}
                    className="landing-learn-btn uppercase cursor-pointer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      flex: '0 0 38%',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      color: 'var(--text2)',
                      background: 'transparent',
                      padding: '15px 24px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text2)';
                    }}
                  >
                    Learn More
                  </button>
                </div>
                <p
                  className="uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    color: 'var(--text2)',
                    marginTop: '12px',
                    textAlign: 'center',
                  }}
                >
                  Free · No Account · 10 Minutes
                </p>
                <span
                  onClick={() => {
                    document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--accent)',
                    textAlign: 'center',
                    display: 'block',
                    marginTop: '14px',
                    cursor: 'pointer',
                  }}
                >
                  See how it works ↓
                </span>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="landing-right-col landing-stagger-card">
              <SampleResultCard />
              <TestPreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — FOUR STEPS ── */}
      <section
        id="how-it-works-section"
        className="relative z-10"
        style={{
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          className="landing-steps-container"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '80px 64px',
          }}
        >
          {/* Eyebrow pill */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'transparent',
              border: '1px solid rgba(0,184,162,0.4)',
              borderRadius: '20px',
              padding: '6px 16px',
              display: 'inline-block',
            }}>
              How It Works
            </span>
          </div>

          {/* Headline */}
          <h2 className="landing-steps-headline" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.2rem',
            fontWeight: 700,
            color: 'var(--text)',
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: '12px',
          }}>
            Get your score in 10 minutes
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text2)',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '480px',
            margin: '0 auto 48px',
          }}>
            A simple 4-step test you can do at home with no special equipment.
          </p>

          {/* Step Cards — 2×2 grid on desktop, stacked on mobile */}
          <div className="landing-steps-grid">

            {/* Step 1 — Step to the Beat */}
            <div className="landing-step-card">
              <div className="landing-step-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div className="landing-step-icon-circle">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M12 30C12 30 14 28 16 24C18 20 19 16 20 14C21 12 22 10 24 10C26 10 27 12 28 16" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                      <path d="M8 32L14 18L18 28L22 12L26 24L32 8" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                      <circle cx="20" cy="34" r="2" fill="var(--accent)" opacity="0.6" />
                      <circle cx="26" cy="34" r="2" fill="var(--accent)" opacity="0.4" />
                      <circle cx="14" cy="34" r="2" fill="var(--accent)" opacity="0.4" />
                    </svg>
                  </div>
                  <span className="landing-step-number">01</span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}>Step to the beat</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--text2)',
                  lineHeight: 1.6,
                }}>Follow the guided pace on any step or stair. The tempo increases every 2 minutes.</p>
              </div>
              <div className="landing-step-illust">
                <svg width="100%" height="100%" viewBox="0 0 280 140" fill="none" preserveAspectRatio="xMidYMid meet">
                  <path d="M0 100 Q20 95 40 85 T80 65 T120 50 T160 40 T200 35 T240 30 T280 25" stroke="var(--accent)" strokeWidth="2.5" fill="none" opacity="0.6" />
                  <path d="M0 105 Q20 100 40 90 T80 70 T120 55 T160 45 T200 40 T240 35 T280 30" stroke="var(--accent)" strokeWidth="1.5" fill="none" opacity="0.25" strokeDasharray="6 4" />
                  {[40, 80, 120, 160, 200, 240].map((x, i) => (
                    <circle key={i} cx={x} cy={85 - i * 10} r={3} fill="var(--accent)" opacity={0.3 + i * 0.1} />
                  ))}
                  <rect x="20" y="110" width="240" height="6" rx="3" fill="rgba(0,184,162,0.1)" />
                  <rect x="20" y="110" width="160" height="6" rx="3" fill="rgba(0,184,162,0.25)" />
                </svg>
              </div>
            </div>

            {/* Step 2 — Track your heart rate */}
            <div className="landing-step-card">
              <div className="landing-step-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div className="landing-step-icon-circle">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="8" y="6" width="24" height="28" rx="12" stroke="var(--accent)" strokeWidth="2" fill="none" />
                      <rect x="11" y="14" width="18" height="12" rx="4" fill="rgba(0,184,162,0.15)" stroke="var(--accent)" strokeWidth="1" />
                      <polyline points="13,20 16,20 18,15 20,25 22,18 24,22 27,20" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="20" cy="30" r="1.5" fill="var(--accent)" opacity="0.5" />
                    </svg>
                  </div>
                  <span className="landing-step-number">02</span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}>Track your heart rate</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--text2)',
                  lineHeight: 1.6,
                }}>Use a smartwatch, chest strap, or enter your pulse manually after each level.</p>
              </div>
              <div className="landing-step-illust">
                <svg width="100%" height="100%" viewBox="0 0 280 140" fill="none" preserveAspectRatio="xMidYMid meet">
                  <rect x="90" y="10" width="100" height="120" rx="20" stroke="var(--accent)" strokeWidth="2" fill="rgba(0,184,162,0.05)" />
                  <rect x="105" y="35" width="70" height="45" rx="8" fill="rgba(0,184,162,0.1)" stroke="var(--accent)" strokeWidth="1" />
                  <polyline points="110,58 118,58 124,42 130,72 136,50 142,62 148,55 155,58 165,58" stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="140" y="95" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="18" fontWeight="700" fill="var(--accent)">128</text>
                  <text x="140" y="108" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--text2)" letterSpacing="0.08em">BPM</text>
                  <circle cx="140" cy="125" r="3" fill="var(--accent)" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Step 3 — We calculate your VO₂ max */}
            <div className="landing-step-card">
              <div className="landing-step-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div className="landing-step-icon-circle">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="14" stroke="var(--accent)" strokeWidth="2" fill="none" opacity="0.3" />
                      <circle cx="20" cy="20" r="14" stroke="var(--accent)" strokeWidth="2.5" fill="none" strokeDasharray="66 22" strokeLinecap="round" />
                      <text x="20" y="18" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fontWeight="700" fill="var(--accent)">45.6</text>
                      <text x="20" y="26" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="5" fill="var(--text2)">VO₂</text>
                      <circle cx="20" cy="20" r="2" fill="var(--accent)" opacity="0.3" />
                    </svg>
                  </div>
                  <span className="landing-step-number">03</span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}>We calculate your VO₂ max</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--text2)',
                  lineHeight: 1.6,
                }}>Using the validated Chester Step Test protocol and regression analysis.</p>
              </div>
              <div className="landing-step-illust">
                <svg width="100%" height="100%" viewBox="0 0 280 140" fill="none" preserveAspectRatio="xMidYMid meet">
                  <circle cx="140" cy="70" r="50" stroke="rgba(0,184,162,0.15)" strokeWidth="8" fill="none" />
                  <circle cx="140" cy="70" r="50" stroke="var(--accent)" strokeWidth="8" fill="none" strokeDasharray="236 78" strokeLinecap="round" transform="rotate(-90 140 70)" />
                  <text x="140" y="62" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="22" fontWeight="700" fill="var(--accent)">45.6</text>
                  <text x="140" y="80" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text2)">VO₂ max</text>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <circle key={i} cx={50 + i * 16} cy={125 - i * 2} r="3" fill="var(--accent)" opacity={0.2 + i * 0.12} />
                  ))}
                  <path d="M50 125 L130 113" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 3" opacity="0.3" />
                </svg>
              </div>
            </div>

            {/* Step 4 — Get your plan */}
            <div className="landing-step-card">
              <div className="landing-step-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div className="landing-step-icon-circle">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="8" y="6" width="24" height="28" rx="3" stroke="var(--accent)" strokeWidth="2" fill="none" />
                      <line x1="13" y1="14" x2="27" y2="14" stroke="var(--accent)" strokeWidth="1.5" opacity="0.4" />
                      <line x1="13" y1="19" x2="24" y2="19" stroke="var(--accent)" strokeWidth="1.5" opacity="0.3" />
                      <line x1="13" y1="24" x2="21" y2="24" stroke="var(--accent)" strokeWidth="1.5" opacity="0.2" />
                      <polyline points="13,30 16,28 19,30 22,26 25,28 28,24" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="landing-step-number">04</span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: '8px',
                  lineHeight: 1.2,
                }}>Get your plan</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  color: 'var(--text2)',
                  lineHeight: 1.6,
                }}>Receive personalized training zones and an 8-week plan to improve.</p>
              </div>
              <div className="landing-step-illust">
                <svg width="100%" height="100%" viewBox="0 0 280 140" fill="none" preserveAspectRatio="xMidYMid meet">
                  <rect x="30" y="15" width="100" height="110" rx="8" stroke="rgba(0,184,162,0.3)" strokeWidth="1.5" fill="rgba(0,184,162,0.05)" />
                  <text x="80" y="35" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" fill="var(--text2)" letterSpacing="0.08em">YOUR PLAN</text>
                  <line x1="42" y1="45" x2="118" y2="45" stroke="rgba(0,184,162,0.2)" strokeWidth="1" />
                  <rect x="42" y="52" width="66" height="5" rx="2.5" fill="rgba(0,184,162,0.15)" />
                  <rect x="42" y="52" width="44" height="5" rx="2.5" fill="rgba(0,184,162,0.35)" />
                  <rect x="42" y="62" width="66" height="5" rx="2.5" fill="rgba(0,184,162,0.15)" />
                  <rect x="42" y="62" width="52" height="5" rx="2.5" fill="rgba(0,184,162,0.35)" />
                  <rect x="42" y="72" width="66" height="5" rx="2.5" fill="rgba(0,184,162,0.15)" />
                  <rect x="42" y="72" width="60" height="5" rx="2.5" fill="rgba(0,184,162,0.35)" />
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <rect key={i} x={160 + i * 14} y={110 - [30, 42, 48, 55, 62, 70, 78, 90][i]} width="10" height={[30, 42, 48, 55, 62, 70, 78, 90][i]} rx="3" fill="var(--accent)" opacity={0.3 + i * 0.08} />
                  ))}
                  <text x="200" y="130" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--text2)">8 WEEKS</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="landing-steps-trust" style={{
            borderTop: '1px solid var(--border)',
            marginTop: '48px',
            paddingTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)' }}>Clinically validated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)' }}>No signup required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)' }}>Works on any device</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section
        className="relative z-10"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          className="landing-whatyouget-container"
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            padding: '64px 64px',
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              color: 'var(--text2)',
              textAlign: 'center',
              marginBottom: '28px',
            }}
          >
            What You Get
          </p>

          <div className="landing-whatyouget-grid">
            {/* Card 1 — VO₂ Max Score */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{
                background: 'var(--bg)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '14px',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>VO₂ Max</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>45.6</p>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                  color: 'var(--accent)', background: 'var(--accent-dark)',
                  border: '1px solid rgba(0,184,162,0.25)',
                  borderRadius: '20px', padding: '2px 8px',
                  display: 'inline-block', marginTop: '6px',
                }}>Good</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Your VO₂ Max Score</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px' }}>Know exactly where you stand.</p>
            </div>

            {/* Card 2 — Training Zones */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{
                background: 'var(--bg)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '14px',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Training Zones</p>
                {[
                  { color: '#FF4444', zone: 'Zone 5', pct: '90-100%' },
                  { color: '#FF8C42', zone: 'Zone 4', pct: '80-90%' },
                  { color: '#00E5A0', zone: 'Zone 3', pct: '70-80%' },
                ].map((z) => (
                  <div key={z.zone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: z.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)' }}>{z.zone}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)' }}>{z.pct}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Your Training Zones</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px' }}>Stop guessing your intensity.</p>
            </div>

            {/* Card 3 — 8-Week Plan */}
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{
                background: 'var(--bg)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '14px',
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Week 1</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', height: '40px' }}>
                  {[30, 45, 55, 70, 85].map((h, i) => (
                    <div key={i} style={{ width: '14px', height: `${h}%`, background: 'var(--accent)', borderRadius: '2px' }} />
                  ))}
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Your 8-Week Plan</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text2)', marginTop: '4px' }}>A clear path to improve your fitness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IS STEPIQ FOR? ── */}
      <section
        className="relative z-10"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="landing-audience-container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 64px',
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            Who Is StepIQ For?
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text)',
              textAlign: 'center',
              marginBottom: '40px',
              lineHeight: 1.2,
            }}
          >
            Built for Anyone Who Takes
            <br />
            Their Health Seriously
          </h2>

          <div className="landing-audience-grid">
            {[
              {
                accent: '#00B8A2',
                title: 'The Health Optimizer',
                body: 'You track your fitness seriously and want a more rigorous VO₂ max measurement than your wearable provides. StepIQ uses a clinically validated protocol — not an algorithm.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00B8A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
              },
              {
                accent: '#4A9EFF',
                title: 'The Fitness Baseline Seeker',
                body: 'You want to know exactly where your cardiovascular fitness stands and have a science-backed plan to improve it. No lab required.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                ),
              },
              {
                accent: '#FFD166',
                title: 'The Comeback Story',
                body: "You're returning to fitness after illness, injury, or a long break and want a safe, validated starting point. The test never pushes you to exhaustion.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
              },
              {
                accent: '#FF8C42',
                title: 'Occupational Health',
                body: 'Your industry requires cardiovascular fitness screening. StepIQ follows the Chester Step Test protocol used in cardiac rehabilitation and occupational health worldwide.',
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF8C42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.title}
                className="landing-audience-card"
                style={{
                  position: 'relative',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '24px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, transform 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: card.accent,
                    borderRadius: '3px 3px 0 0',
                  }}
                />
                <div style={{ marginBottom: '14px' }}>{card.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '8px',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.78rem',
                    color: 'var(--text2)',
                    lineHeight: 1.7,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--text2)',
              fontStyle: 'italic',
              textAlign: 'center',
              marginTop: '28px',
            }}
          >
            Not sure which category you're in? It doesn't matter — the test is the same for everyone.
          </p>
        </div>
      </section>

      {/* ── WHAT YOUR SCORE UNLOCKS ── */}
      <section
        className="relative z-10"
        style={{ padding: '0' }}
      >
        <div
          className="landing-unlocks-container"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 64px',
          }}
        >
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: 'var(--accent)',
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            What Your Score Unlocks
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text)',
              textAlign: 'center',
              marginBottom: '48px',
              lineHeight: 1.2,
            }}
          >
            One Test. Three Outcomes.
          </h2>

          <div className="landing-unlocks-grid">
            {[
              {
                number: '01',
                title: 'Know Your Number',
                body: 'Get a clinically validated VO₂ max estimate — the single best predictor of cardiovascular health and all-cause mortality. Know exactly where you stand compared to your age and sex.',
                accent: 'var(--accent)',
              },
              {
                number: '02',
                title: 'A Plan to Improve It',
                body: 'Receive a personalized 8-week training protocol built from your results — with specific heart rate zones, session durations, and progression targets. Not generic advice.',
                accent: '#4A9EFF',
              },
              {
                number: '03',
                title: 'Track What Matters',
                body: 'Retest every 8–12 weeks and see your progress over time. Watch your score climb, your resting heart rate drop, and your classification improve.',
                accent: '#FFD166',
              },
            ].map((col) => (
              <div key={col.number} style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    color: col.accent,
                    display: 'block',
                    marginBottom: '14px',
                  }}
                >
                  {col.number}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '12px',
                  }}
                >
                  {col.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--text2)',
                    lineHeight: 1.75,
                    maxWidth: '340px',
                    margin: '0 auto',
                  }}
                >
                  {col.body}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button
              onClick={onStart}
              className="landing-cta-btn uppercase cursor-pointer transition-all"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--bg)',
                background: 'var(--accent)',
                padding: '15px 40px',
                borderRadius: '10px',
                border: 'none',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              Start Free Assessment →
            </button>
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                color: 'var(--text2)',
                marginTop: '12px',
              }}
            >
              Free · No Account · 10 Minutes
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 landing-footer"
        style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          className="uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.1em',
            color: 'var(--text3)',
          }}
        >
          Powered by Chester Step Test Protocol · K. Sykes, 1998
        </span>

        <ThemeToggle />
      </footer>

      {/* ── STICKY MOBILE CTA ── */}
      <div
        className={`landing-sticky-cta${showSticky ? ' landing-sticky-visible' : ''}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          padding: '12px 24px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onStart}
          className="uppercase cursor-pointer"
          style={{
            width: '100%',
            height: '52px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--bg)',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          Start Free VO₂ Max Test →
        </button>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--text2)',
          textAlign: 'center',
          marginTop: '6px',
        }}>
          100% free · No signup · 10 minutes
        </p>
      </div>

      {/* ── RESPONSIVE & ANIMATIONS ── */}
      <style>{`
        /* Desktop grid */
        .landing-grid {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 80px;
          align-items: center;
          width: 100%;
        }
        .landing-headline {
          font-size: clamp(2.8rem, 4vw, 4rem);
        }
        .landing-right-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Tablet */
        @media (max-width: 1023px) {
          .landing-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 600px;
            margin: 0 auto;
          }
          .landing-headline { font-size: clamp(2.2rem, 4vw, 2.8rem); }
          .landing-container { padding: 0 40px !important; }
          .landing-preview-card { display: none; }
          .landing-footer { padding: 20px 40px !important; }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .landing-headline { font-size: clamp(1.8rem, 5vw, 2.2rem); }
          .landing-container { padding: 0 24px !important; }
          .landing-right-col { display: none; }
          .landing-footer {
            padding: 20px 24px !important;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Large screens */
        @media (min-width: 1400px) {
          .landing-headline { font-size: 4.5rem; }
        }

        /* Audience grid */
        .landing-audience-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1023px) {
          .landing-audience-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .landing-audience-container {
            padding: 60px 40px !important;
          }
        }
        @media (max-width: 767px) {
          .landing-audience-grid {
            grid-template-columns: 1fr;
          }
          .landing-audience-container {
            padding: 48px 24px !important;
          }
          .landing-audience-card {
            padding: 20px !important;
          }
        }

        /* Unlocks grid */
        .landing-unlocks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        @media (max-width: 1023px) {
          .landing-unlocks-container {
            padding: 60px 40px !important;
          }
        }
        @media (max-width: 767px) {
          .landing-unlocks-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .landing-unlocks-container {
            padding: 48px 24px !important;
          }
        }

        /* CTA button row */
        .landing-cta-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 767px) {
          .landing-cta-row {
            flex-direction: column;
            gap: 10px;
          }
          .landing-cta-row button {
            flex: 1 1 auto !important;
            width: 100% !important;
          }
        }

        /* CTA hover */
        .landing-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(0,184,162,0.4), 0 8px 24px rgba(0,184,162,0.2);
        }
        .landing-cta-btn:active {
          transform: scale(0.98);
        }

        /* Staggered entrance */
        .landing-stagger-1,
        .landing-stagger-2,
        .landing-stagger-3,
        .landing-stagger-4,
        .landing-stagger-5,
        .landing-stagger-card {
          opacity: 0;
          animation: landingFadeUp 0.6s ease-out forwards;
        }
        .landing-stagger-1 { animation-delay: 0.1s; }
        .landing-stagger-2 { animation-delay: 0.2s; }
        .landing-stagger-3 { animation-delay: 0.3s; }
        .landing-stagger-4 { animation-delay: 0.4s; }
        .landing-stagger-5 { animation-delay: 0.5s; }
        .landing-stagger-card {
          animation-delay: 0.4s;
          animation-name: landingSlideRight;
        }

        @keyframes landingFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes landingSlideRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Mobile/Desktop visibility */
        .landing-mobile-only { display: none; }
        .landing-desktop-only { display: block; }
        .landing-sticky-cta { display: none; }

        @media (max-width: 767px) {
          .landing-mobile-only { display: block !important; }
          .landing-desktop-only { display: none !important; }
          .landing-mobile-only.flex { display: flex !important; }
          .landing-sticky-cta.landing-sticky-visible { display: flex; }
        }

        /* Steps grid */
        .landing-steps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .landing-step-card {
          background: linear-gradient(135deg, rgba(20,30,45,0.6), rgba(15,22,35,0.4));
          border: 1px solid rgba(0,184,162,0.15);
          border-radius: 24px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.2);
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .landing-step-card:hover {
          border-color: rgba(0,184,162,0.35);
          transform: translateY(-3px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.3);
        }
        .landing-step-content {
          flex: 1;
          margin-bottom: 16px;
        }
        .landing-step-icon-circle {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 2px solid rgba(0,184,162,0.35);
          background: rgba(0,184,162,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .landing-step-number {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: var(--text2);
          opacity: 0.5;
        }
        .landing-step-illust {
          width: 100%;
          max-width: 280px;
          height: 140px;
          margin: 0 auto;
          flex-shrink: 0;
        }
        .landing-steps-headline {
          font-size: 3.2rem !important;
        }
        @media (max-width: 1023px) {
          .landing-steps-container { padding: 60px 40px !important; }
          .landing-step-icon-circle { width: 72px; height: 72px; }
          .landing-steps-headline { font-size: 2.6rem !important; }
        }
        @media (max-width: 767px) {
          .landing-steps-container { padding: 48px 20px !important; }
          .landing-steps-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .landing-steps-headline { font-size: 2.4rem !important; }
          .landing-step-card { padding: 22px; }
          .landing-step-icon-circle { width: 72px; height: 72px; }
          .landing-step-icon-circle svg { width: 32px; height: 32px; }
          .landing-step-illust { max-width: 240px; height: 120px; }
          .landing-steps-trust {
            flex-direction: column;
            gap: 16px !important;
            align-items: flex-start !important;
            padding-left: 8px;
          }
        }
        @media (max-width: 480px) {
          .landing-steps-headline { font-size: 2rem !important; }
          .landing-step-card { padding: 18px; }
          .landing-step-icon-circle { width: 64px; height: 64px; }
        }

        /* What You Get grid */
        .landing-whatyouget-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1023px) {
          .landing-whatyouget-container { padding: 48px 40px !important; }
        }
        @media (max-width: 767px) {
          .landing-whatyouget-grid {
            grid-template-columns: 1fr;
          }
          .landing-whatyouget-container { padding: 48px 24px !important; }
        }

        /* Need strip mobile */
        @media (max-width: 480px) {
          .landing-need-strip {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 12px !important;
            padding: 16px !important;
          }
          .landing-need-divider {
            display: none !important;
          }
        }

        /* Mobile bottom padding for sticky CTA */
        @media (max-width: 767px) {
          .landing-footer { padding-bottom: 110px !important; }
        }
      `}</style>
    </div>
  );
}
