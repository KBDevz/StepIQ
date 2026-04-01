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

interface LandingPageProps {
  onStart: () => void;
  onHowItWorks: () => void;
}

// Sample data for the preview chart
const sampleData = [
  { level: 1, hr: 95, vo2: 17.3 },
  { level: 2, hr: 115, vo2: 21.9 },
  { level: 3, hr: 132, vo2: 26.5 },
  { level: 4, hr: 151, vo2: 31.1 },
];

const regressionLine = (() => {
  const pts = sampleData.map((d) => ({ x: d.hr, y: d.vo2 }));
  const n = pts.length;
  let sx = 0,
    sy = 0,
    sxy = 0,
    sx2 = 0;
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
    <ResponsiveContainer width="100%" height={180}>
      <LineChart margin={{ top: 8, right: 12, bottom: 4, left: -20 }}>
        <CartesianGrid stroke="#1C2F4A" strokeDasharray="3 3" />
        <XAxis
          dataKey="hr"
          type="number"
          domain={[85, 190]}
          tick={{ fill: '#5A7090', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
          stroke="#1C2F4A"
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#5A7090', fontSize: 9, fontFamily: 'IBM Plex Mono' }}
          stroke="#1C2F4A"
          tickLine={false}
        />
        <Line
          data={regressionLine.line.filter((d) => d.actual !== undefined)}
          dataKey="actual"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          data={regressionLine.line.filter((d) => d.predicted !== undefined)}
          dataKey="predicted"
          stroke="#00E5A0"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          data={sampleData.map((p) => ({ hr: p.hr, dot: p.vo2 }))}
          dataKey="dot"
          stroke="transparent"
          dot={{ fill: '#3B82F6', r: 4, stroke: '#0D1829', strokeWidth: 2 }}
          isAnimationActive={false}
        />
        <ReferenceDot
          x={regressionLine.maxHR}
          y={regressionLine.vo2Max}
          r={5}
          fill="#00E5A0"
          stroke="#0D1829"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ResultPreviewCard() {
  return (
    <div
      className="w-full"
      style={{
        background: '#0D1829',
        border: '1px solid #1C2F4A',
        borderRadius: '20px',
        padding: '28px',
        boxShadow:
          '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.16em',
            color: '#5A7090',
          }}
        >
          Sample Result
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            color: '#5A7090',
            border: '1px solid #1C2F4A',
            borderRadius: '6px',
            padding: '3px 8px',
          }}
        >
          StepIQ
        </span>
      </div>

      {/* VO2 number display */}
      <div className="mb-5">
        <div
          className="font-serif"
          style={{
            fontSize: '4rem',
            color: '#06D6A0',
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          41.2
        </div>
        <div
          className="font-mono mt-1"
          style={{ fontSize: '0.65rem', color: '#5A7090' }}
        >
          ml · kg⁻¹ · min⁻¹
        </div>
        <span
          className="inline-block mt-2 font-mono uppercase"
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            color: '#06D6A0',
            background: 'rgba(6,214,160,0.1)',
            border: '1px solid rgba(6,214,160,0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
          }}
        >
          Good
        </span>
      </div>

      {/* Regression chart */}
      <div className="mb-4">
        <PreviewChart />
      </div>

      {/* Stat chips */}
      <div className="flex items-center justify-center gap-2">
        {['4 Levels', '56 mins', 'Age 35'].map((chip, i) => (
          <span key={chip} className="flex items-center gap-2">
            <span
              className="font-mono"
              style={{ fontSize: '0.65rem', color: '#5A7090' }}
            >
              {chip}
            </span>
            {i < 2 && (
              <span style={{ color: '#1C2F4A', fontSize: '0.65rem' }}>·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage({ onStart, onHowItWorks }: LandingPageProps) {
  const pills = ['Clinically Validated', 'Linear Regression', 'AI Report'];

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative overflow-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(28,47,74,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28,47,74,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(6,12,24,0) 30%, rgba(6,12,24,0.6) 60%, #060C18 100%)',
        }}
      />

      <NavBar onStart={onStart} onHowItWorks={onHowItWorks} />

      {/* ── HERO SECTION ── */}
      <div
        className="relative z-10 mx-auto"
        style={{
          maxWidth: '1200px',
          minHeight: 'calc(100vh - 72px)',
          marginTop: '72px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Responsive padding wrapper */}
        <div
          className="w-full"
          style={{ padding: '0 64px' }}
        >
          {/* Desktop: two-column grid */}
          <div className="landing-grid w-full">
            {/* ── LEFT COLUMN ── */}
            <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
              {/* Eyebrow */}
              <p
                className="font-mono uppercase landing-stagger-1"
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  color: '#00E5A0',
                  marginBottom: '20px',
                }}
              >
                Chester Step Test · VO₂ Max Assessment
              </p>

              {/* Headline */}
              <h1
                className="font-serif landing-stagger-2 landing-headline"
                style={{
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.1,
                  marginBottom: '24px',
                }}
              >
                Know Your
                <br />
                Cardiovascular Fitness
                <br />
                In 10 Minutes.
              </h1>

              {/* Subheadline */}
              <p
                className="font-mono landing-stagger-3"
                style={{
                  fontSize: '0.85rem',
                  color: '#5A7090',
                  lineHeight: 1.8,
                  maxWidth: '480px',
                  marginBottom: '36px',
                }}
              >
                The Chester Step Test is the gold standard submaximal VO₂ max
                assessment used in cardiac rehabilitation and occupational
                health. Now available at home — no lab, just a step and a heart
                rate monitor.
              </p>

              {/* Feature pills */}
              <div
                className="flex flex-wrap landing-stagger-4"
                style={{ gap: '10px', marginBottom: '40px' }}
              >
                {pills.map((pill) => (
                  <span
                    key={pill}
                    className="font-mono uppercase"
                    style={{
                      fontSize: '0.62rem',
                      letterSpacing: '0.1em',
                      color: '#00E5A0',
                      background: 'rgba(0,229,160,0.08)',
                      border: '1px solid rgba(0,229,160,0.3)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* CTA button */}
              <div className="landing-stagger-5">
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
                  Start Free Assessment →
                </button>
                <p
                  className="font-mono"
                  style={{
                    fontSize: '0.65rem',
                    color: '#5A7090',
                    marginTop: '12px',
                  }}
                >
                  No account required · Takes 10–12 minutes
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="landing-right-col landing-stagger-card">
              <ResultPreviewCard />
            </div>
          </div>
        </div>
      </div>

      {/* ── RESPONSIVE STYLES & ANIMATIONS ── */}
      <style>{`
        /* Grid layout */
        .landing-grid {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 80px;
          align-items: center;
        }
        .landing-headline {
          font-size: 4rem;
        }
        .landing-right-col {
          display: flex;
          align-items: center;
        }

        /* Tablet: single column */
        @media (max-width: 1023px) {
          .landing-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            max-width: 600px;
            margin: 0 auto;
          }
          .landing-headline {
            font-size: 2.5rem;
          }
          .landing-right-col {
            justify-content: center;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .landing-grid { padding: 0; }
          .w-full[style*="padding: 0 64px"] {
            padding: 0 40px !important;
          }
        }

        /* Mobile */
        @media (max-width: 767px) {
          .landing-headline {
            font-size: 2rem;
          }
          .w-full[style*="padding: 0 64px"] {
            padding: 0 24px !important;
          }
          .landing-right-col {
            display: none;
          }
        }

        /* Large screens */
        @media (min-width: 1400px) {
          .landing-headline {
            font-size: 4.2rem;
          }
        }

        /* CTA hover */
        .landing-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(0,229,160,0.45), 0 8px 24px rgba(0,229,160,0.2);
        }

        /* Staggered animations */
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
          animation-duration: 0.6s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }

        @keyframes landingFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes landingSlideRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
