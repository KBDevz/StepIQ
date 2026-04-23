import type { LevelResult, ClassificationResult } from '../../types';
import { linReg } from '../../utils/scoring';

interface ShareCardProps {
  format: 'square' | 'story' | 'challenge';
  vo2Max: number;
  classification: ClassificationResult;
  age: number;
  sex: 'male' | 'female';
  levelsCompleted: number;
  data: LevelResult[];
  maxHR: number;
}

const GRADIENTS: Record<string, string> = {
  'Excellent': 'linear-gradient(135deg, #003D35 0%, #001A14 50%, #060C18 100%)',
  'Good': 'linear-gradient(135deg, #003D35 0%, #001829 50%, #060C18 100%)',
  'Average': 'linear-gradient(135deg, #3D2E00 0%, #1A1400 50%, #060C18 100%)',
  'Below Average': 'linear-gradient(135deg, #3D1A00 0%, #1A0C00 50%, #060C18 100%)',
  'Poor': 'linear-gradient(135deg, #3D0000 0%, #1A0000 50%, #060C18 100%)',
};

const PERCENTILES: Record<string, { label: string; pct: number }> = {
  'Excellent': { label: 'Top 10%', pct: 90 },
  'Good': { label: 'Top 30%', pct: 70 },
  'Average': { label: 'Top 50%', pct: 50 },
  'Below Average': { label: 'Top 70%', pct: 30 },
  'Poor': { label: 'Bottom 30%', pct: 15 },
};

function MiniChart({ data, maxHR, vo2Max, color }: { data: LevelResult[]; maxHR: number; vo2Max: number; color: string }) {
  if (data.length < 2) return null;

  const pts = data.map((d) => ({ x: d.hr, y: d.vo2Estimate }));
  const reg = linReg(pts);
  if (!reg) return null;

  const minHR = Math.min(...data.map((d) => d.hr)) - 10;
  const chartMin = Math.max(40, minHR);
  const chartMax = maxHR + 5;
  const maxVo2 = reg.slope * maxHR + reg.intercept;
  const minVo2 = reg.slope * chartMin + reg.intercept;
  const vo2Min = Math.min(minVo2, ...data.map((d) => d.vo2Estimate)) - 3;
  const vo2MaxRange = Math.max(maxVo2, ...data.map((d) => d.vo2Estimate)) + 3;

  const W = 500;
  const H = 140;
  const toX = (hr: number) => ((hr - chartMin) / (chartMax - chartMin)) * W;
  const toY = (vo2: number) => H - ((vo2 - vo2Min) / (vo2MaxRange - vo2Min)) * H;

  const lastDataHR = Math.max(...data.map((d) => d.hr));

  const steps = 40;
  const actualPath: string[] = [];
  const predPath: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const hr = chartMin + ((chartMax - chartMin) * i) / steps;
    const vo2 = reg.slope * hr + reg.intercept;
    const x = toX(hr);
    const y = toY(vo2);
    if (hr <= lastDataHR) {
      actualPath.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
    } else {
      if (predPath.length === 0) {
        const bridgeVo2 = reg.slope * lastDataHR + reg.intercept;
        predPath.push(`M${toX(lastDataHR)},${toY(bridgeVo2)}`);
      }
      predPath.push(`L${x},${y}`);
    }
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <path d={actualPath.join('')} fill="none" stroke="#3B82F6" strokeWidth="3" />
      {predPath.length > 0 && (
        <path d={predPath.join('')} fill="none" stroke={color} strokeWidth="3" strokeDasharray="8 5" />
      )}
      {data.map((d, i) => (
        <circle key={i} cx={toX(d.hr)} cy={toY(d.vo2Estimate)} r="5" fill="#3B82F6" stroke="#060C18" strokeWidth="2" />
      ))}
      <circle cx={toX(maxHR)} cy={toY(vo2Max)} r="7" fill={color} stroke="#060C18" strokeWidth="2" />
    </svg>
  );
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ShareCard({ format, vo2Max, classification, age, sex, levelsCompleted, data, maxHR }: ShareCardProps) {
  const c = classification.color;
  const w = 1080;
  const h = format === 'story' ? 1920 : 1080;
  const pad = format === 'story' ? 80 : 80;
  const isStory = format === 'story';
  const isChallenge = format === 'challenge';
  const scoreSize = isStory ? '14rem' : '10rem';
  const perc = PERCENTILES[classification.name] || PERCENTILES['Average'];

  const id = format === 'challenge' ? 'share-card-challenge' : format === 'story' ? 'share-card-story' : 'share-card-square';

  return (
    <div
      id={id}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: '-9999px',
        width: `${w}px`,
        height: `${h}px`,
        background: GRADIENTS[classification.name] || GRADIENTS['Average'],
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        padding: `${pad}px`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'IBM Plex Mono, monospace',
        overflow: 'hidden',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'rgba(0,184,162,0.15)', border: '1px solid rgba(0,184,162,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00B8A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Libre Baskerville, serif', fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>StepIQ</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{formatDate()}</span>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Eyebrow */}
        <span style={{
          fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em',
          color: c, opacity: 0.7, marginBottom: '8px',
        }}>
          My VO₂ Max Estimate
        </span>

        {/* Score */}
        <span style={{
          fontFamily: 'Libre Baskerville, serif', fontSize: scoreSize, fontWeight: 700,
          color: c, lineHeight: 1, textShadow: `0 0 80px ${c}66`,
        }}>
          {(Math.round(vo2Max * 10) / 10).toFixed(1)}
        </span>

        {/* Unit */}
        <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginTop: '-10px' }}>
          ml · kg⁻¹ · min⁻¹
        </span>

        {/* Classification badge */}
        <div style={{
          marginTop: '20px', padding: '10px 32px', borderRadius: '40px',
          background: `${c}26`, border: `2px solid ${c}`,
          fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.15em', color: c,
        }}>
          {classification.name}
        </div>

        {/* Context */}
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '16px' }}>
          Age {age} · {sex === 'male' ? 'Male' : 'Female'} · {levelsCompleted} of 5 levels completed
        </span>

        {/* Challenge CTA */}
        {isChallenge && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
              Do you know your VO₂ max?
            </p>
            <p style={{ fontSize: '0.85rem', color: c, fontWeight: 700 }}>
              Find out free at stepiq.vercel.app
            </p>
          </div>
        )}

        {/* Percentile bar (not on challenge) */}
        {!isChallenge && (
          <div style={{ width: '70%', marginTop: isStory ? '60px' : '40px' }}>
            <span style={{
              fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px',
            }}>
              Percentile Rank
            </span>
            <div style={{
              width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px', overflow: 'hidden',
            }}>
              <div style={{ width: `${perc.pct}%`, height: '100%', background: c, borderRadius: '4px' }} />
            </div>
            <span style={{
              fontSize: '0.75rem', fontWeight: 700, color: c,
              display: 'block', textAlign: 'right', marginTop: '8px',
            }}>
              {perc.label} for age {age}
            </span>
          </div>
        )}

        {/* Mini chart (not on challenge) */}
        {!isChallenge && data.length >= 2 && (
          <div style={{ width: '60%', marginTop: isStory ? '60px' : '40px' }}>
            <MiniChart data={data} maxHR={maxHR} vo2Max={vo2Max} color={c} />
          </div>
        )}
      </div>

      {/* Story CTA */}
      {isStory && (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '1rem', color: c, fontWeight: 700 }}>
            Know your number →
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            stepiq.vercel.app
          </p>
        </div>
      )}

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>Chester Step Test Protocol</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: c }}>stepiq.vercel.app</span>
      </div>
    </div>
  );
}
