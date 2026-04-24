import { useState, useRef, useEffect } from 'react';
import type { HRZones } from '../../utils/scoring';

interface Moment4Props {
  zones: HRZones;
  betaBlocker: boolean;
  onContinue: () => void;
}

const ZONE_DETAILS: Record<string, { feel: string; why: string; bestFor: string }> = {
  zone1: {
    feel: 'Easy breathing, comfortable pace. You could sing a song without effort.',
    why: 'Promotes recovery between hard sessions and builds aerobic base without stress on the body.',
    bestFor: 'Warm-ups, cool-downs, active recovery days',
  },
  zone2: {
    feel: 'Breathing is heavier but controlled. You can hold a conversation but you’re clearly working.',
    why: 'This is where your body primarily burns fat as fuel. Builds endurance and aerobic efficiency.',
    bestFor: 'Fat loss, endurance building, 30–45 min sessions 3–4x/week',
  },
  zone3: {
    feel: 'Noticeable effort. Speaking in short sentences only. Breathing is rhythmic and steady.',
    why: 'Improves cardiovascular capacity. Your body uses a mix of fat and carbohydrate fuel.',
    bestFor: 'Tempo runs, moderate cycling, general fitness',
  },
  zone4: {
    feel: 'Hard effort. Only a few words at a time. You’re aware of your breathing.',
    why: 'Pushes your lactate threshold higher, letting you sustain faster paces over time.',
    bestFor: 'Interval training, race prep, performance gains',
  },
  zone5: {
    feel: 'Maximum effort. Cannot speak. Sustainable for very short bursts only.',
    why: 'Develops peak power and speed. Triggers the strongest cardiovascular adaptations.',
    bestFor: 'Short sprints, HIIT intervals, competitive efforts',
  },
};

const ZONE_CONFIG = [
  { key: 'zone1' as const, name: 'Recovery', color: '#4A9EFF', num: 1 },
  { key: 'zone2' as const, name: 'Fat Burning', color: '#00E5A0', num: 2 },
  { key: 'zone3' as const, name: 'Aerobic', color: '#FFD166', num: 3 },
  { key: 'zone4' as const, name: 'Threshold', color: '#FF8C42', num: 4 },
  { key: 'zone5' as const, name: 'Maximum', color: '#FF4444', num: 5 },
];

function ZoneRow({ zone, z, expanded, onToggle }: {
  zone: typeof ZONE_CONFIG[number];
  z: { min: number; max: number };
  expanded: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  const details = ZONE_DETAILS[zone.key];

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.52rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text2)',
    marginBottom: '4px',
  };

  const contentStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.78rem',
    color: 'var(--text2)',
    lineHeight: 1.5,
  };

  return (
    <div style={{ borderLeft: `4px solid ${zone.color}` }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '44px',
          paddingLeft: '12px',
          paddingRight: '12px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: zone.color,
            background: `${zone.color}15`,
            border: `1px solid ${zone.color}40`,
            borderRadius: '4px',
            padding: '2px 6px',
          }}>
            Z{zone.num}
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text)',
            fontWeight: 400,
          }}>
            {zone.name}
          </span>
        </div>
        <span style={{
          fontSize: '16px',
          color: 'var(--text2)',
          transition: 'transform 0.2s ease',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          marginRight: '8px',
          lineHeight: 1,
        }}>
          {'›'}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--text)',
        }}>
          {z.min} &ndash; {z.max}
          <span style={{ fontSize: '0.55rem', fontWeight: 400, color: 'var(--text2)', marginLeft: '4px' }}>bpm</span>
        </span>
      </div>

      <div style={{
        maxHeight: `${height}px`,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div ref={contentRef} style={{ padding: '4px 12px 14px 12px' }}>
          <div style={{ marginBottom: '10px' }}>
            <p style={labelStyle}>What It Feels Like</p>
            <p style={contentStyle}>{details.feel}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <p style={labelStyle}>Why Train Here</p>
            <p style={contentStyle}>{details.why}</p>
          </div>
          <div>
            <p style={labelStyle}>Best For</p>
            <p style={contentStyle}>{details.bestFor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Moment4({ zones, betaBlocker, onContinue }: Moment4Props) {
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const toggleZone = (key: string) => {
    setExpandedZone(prev => prev === key ? null : key);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '80px 24px 120px',
      position: 'relative',
      overflowY: 'auto',
    }}>
      {/* Top label with method badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--text2)',
        }}>
          Your Training Zones
        </p>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.48rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
          color: zones.method === 'data-derived' ? 'var(--accent)' : 'var(--text2)',
          background: zones.method === 'data-derived' ? 'var(--accent-dark)' : 'rgba(90,112,144,0.1)',
          border: `1px solid ${zones.method === 'data-derived' ? 'rgba(0,184,162,0.2)' : 'rgba(90,112,144,0.15)'}`,
          borderRadius: '20px',
          padding: '2px 8px',
        }}>
          {zones.method === 'data-derived' ? 'Data-Derived' : 'Karvonen'}
        </span>
      </div>

      {/* Headline */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.6rem',
        fontWeight: 700,
        color: 'var(--text)',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        Here's how to train
      </h2>

      {/* Zone bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {ZONE_CONFIG.map((zone) => (
          <ZoneRow
            key={zone.key}
            zone={zone}
            z={zones[zone.key]}
            expanded={expandedZone === zone.key}
            onToggle={() => toggleZone(zone.key)}
          />
        ))}
      </div>

      {/* Fat burning callout */}
      <div style={{
        background: 'rgba(0,229,160,0.06)',
        border: '1px solid rgba(0,229,160,0.2)',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '20px',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.78rem',
          color: 'var(--text2)',
          marginBottom: '4px',
        }}>
          Your fat burning sweet spot:
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: 'var(--accent)',
          marginBottom: '6px',
        }}>
          {zones.fatBurnMin} &ndash; {zones.fatBurnMax}
          <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'var(--text2)', marginLeft: '6px' }}>bpm</span>
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.78rem',
          color: 'var(--text2)',
          lineHeight: 1.5,
        }}>
          Stay here and your body burns fat as its primary fuel.
        </p>
        {betaBlocker && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: '#FF8C42',
            marginTop: '8px',
            lineHeight: 1.5,
          }}>
            Note: Zones adjusted for beta blocker medication.
          </p>
        )}
      </div>

      {/* Efficiency metric */}
      {zones.hrEfficiency !== null && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'rgba(74,158,255,0.06)',
          border: '1px solid rgba(74,158,255,0.15)',
          borderRadius: '10px',
          marginTop: '12px',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4A9EFF' }}>
            Cardiac Efficiency
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
            {zones.hrEfficiency.toFixed(2)}
            <span style={{ fontSize: '0.5rem', fontWeight: 400, color: 'var(--text2)', marginLeft: '4px' }}>ml/kg/min/bpm</span>
          </span>
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={onContinue}
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '32px',
          right: '32px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--bg)',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '10px',
          padding: '15px 24px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-accent)',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
      >
        Continue &rarr;
      </button>
    </div>
  );
}
