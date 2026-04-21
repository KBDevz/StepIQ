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
                  marginBottom: '20px',
                }}
              >
                Chester Step Test · At-Home VO₂ Max Assessment
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
                }}
              >
                Estimate your VO₂ max
                <br />
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'var(--accent)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  without a lab.
                </span>
              </h1>

              {/* VO₂ max longevity line */}
              <p
                className="landing-stagger-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'var(--text2)',
                  lineHeight: 1.65,
                  maxWidth: '520px',
                  marginTop: '16px',
                  marginBottom: '20px',
                }}
              >
                VO₂ max is the single strongest predictor of how long — and how well — you'll live.
              </p>

              {/* Subheadline */}
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
                StepIQ is a guided 10-minute step test that estimates your
                cardiovascular fitness, gives you a personalized score, and
                tells you exactly how to improve it.
              </p>

              {/* Trust badges */}
              <div
                className="flex flex-wrap landing-stagger-4"
                style={{ gap: '8px', marginBottom: '14px' }}
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

              {/* HR note */}
              <p
                className="landing-stagger-4"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                  color: 'var(--text2)',
                  marginBottom: '28px',
                  maxWidth: '480px',
                }}
              >
                ♥ You'll need a way to check your heart rate — a fitness
                watch or chest strap works best.
              </p>

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
          font-size: clamp(3rem, 5vw, 4.5rem);
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
      `}</style>
    </div>
  );
}
