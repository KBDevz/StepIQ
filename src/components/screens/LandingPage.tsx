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

              {/* Headline */}
              <h1
                className="landing-stagger-2 landing-headline"
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

              {/* Sub-headline */}
              <p
                className="landing-stagger-2"
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

              {/* Description */}
              <p
                className="landing-stagger-3"
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

              {/* Trust badges */}
              <div
                className="flex flex-wrap landing-stagger-4"
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
      `}</style>
    </div>
  );
}
