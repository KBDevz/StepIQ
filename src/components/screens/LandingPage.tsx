import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts';
import Button from '../ui/Button';

interface LandingPageProps {
  onStart: () => void;
}

// Sample data for the preview chart
const sampleData = [
  { hr: 98, vo2: 17.3, label: 'L1' },
  { hr: 118, vo2: 21.9, label: 'L2' },
  { hr: 136, vo2: 26.5, label: 'L3' },
  { hr: 152, vo2: 31.1, label: 'L4' },
];

const regressionLine = (() => {
  const pts = sampleData.map(d => ({ x: d.hr, y: d.vo2 }));
  const n = pts.length;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0;
  pts.forEach(p => { sx += p.x; sy += p.y; sxy += p.x * p.y; sx2 += p.x * p.x; });
  const d = n * sx2 - sx * sx;
  const slope = (n * sxy - sx * sy) / d;
  const intercept = (sy - slope * sx) / n;
  const maxHR = 185;
  const vo2Max = Math.round((slope * maxHR + intercept) * 10) / 10;

  const line: { hr: number; actual?: number; predicted?: number }[] = [];
  for (let i = 0; i <= 40; i++) {
    const hr = 88 + (maxHR - 88) * i / 40;
    const vo2 = slope * hr + intercept;
    const lastDataHR = 152;
    if (hr <= lastDataHR) {
      line.push({ hr: Math.round(hr), actual: Math.round(vo2 * 10) / 10 });
    } else {
      line.push({ hr: Math.round(hr), predicted: Math.round(vo2 * 10) / 10 });
    }
  }
  return { line, vo2Max, maxHR };
})();

function PreviewChart() {
  return (
    <div className="w-full bg-[#0D1829]/60 backdrop-blur-md border border-[#1C2F4A] rounded-2xl p-4">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart margin={{ top: 10, right: 15, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#1C2F4A" strokeDasharray="3 3" />
          <XAxis
            dataKey="hr"
            type="number"
            domain={[88, 190]}
            tick={{ fill: '#5A7090', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            stroke="#1C2F4A"
          />
          <YAxis
            tick={{ fill: '#5A7090', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            stroke="#1C2F4A"
          />
          <Line
            data={regressionLine.line.filter(d => d.actual !== undefined)}
            dataKey="actual"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            data={regressionLine.line.filter(d => d.predicted !== undefined)}
            dataKey="predicted"
            stroke="#00E5A0"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            data={sampleData.map(p => ({ hr: p.hr, dot: p.vo2 }))}
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
      <div className="flex justify-center mt-3">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00E5A0]/10 border border-[#00E5A0]/25">
          <span className="font-mono text-sm font-bold text-[#00E5A0]">Good</span>
          <span className="font-mono text-xs text-[#5A7090]">·</span>
          <span className="font-mono text-sm text-[#EEF2FF]">{regressionLine.vo2Max} ml/kg/min</span>
        </span>
      </div>
    </div>
  );
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const pills = [
    'Clinically Validated Protocol',
    'Linear Regression Scoring',
    'AI-Powered Report',
  ];

  return (
    <div className="min-h-screen bg-[#060C18] text-[#EEF2FF] relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #060C18 100%)' }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-12 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        {/* Desktop: two columns */}
        <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-center w-full">

          {/* Left column */}
          <div className="flex-1 lg:max-w-[58%]">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#00E5A0]/15 border border-[#00E5A0]/30 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-serif text-2xl text-[#EEF2FF]">StepIQ</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl lg:text-5xl text-[#EEF2FF] font-bold leading-[1.15] mb-5">
              Know Your Cardiovascular Fitness — In 10 Minutes
            </h1>

            {/* Subheadline */}
            <p className="font-mono text-sm text-[#5A7090] leading-relaxed mb-8 max-w-[520px]">
              The Chester Step Test is the gold standard submaximal VO2 max assessment used in cardiac rehab and occupational health. Now available at home.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-block px-3 py-1.5 rounded-full font-mono text-[11px] text-[#00E5A0] bg-[#00E5A0]/8 border border-[#00E5A0]/20 tracking-wide"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="max-w-[320px]">
              <Button onClick={onStart}>
                Start Free Assessment →
              </Button>
              <p className="font-mono text-[11px] text-[#5A7090] mt-3 text-center">
                No account required · Takes 10-12 minutes
              </p>
            </div>
          </div>

          {/* Right column — chart preview (hidden on small mobile) */}
          <div className="flex-1 mt-12 lg:mt-0 lg:max-w-[42%]">
            <PreviewChart />
          </div>
        </div>
      </div>
    </div>
  );
}
