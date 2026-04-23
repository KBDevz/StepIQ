import type { HRZones } from '../../utils/scoring';

interface Moment4Props {
  zones: HRZones;
  betaBlocker: boolean;
  onContinue: () => void;
}

const ZONE_CONFIG = [
  { key: 'zone1' as const, name: 'Recovery', color: '#4A9EFF', num: 1 },
  { key: 'zone2' as const, name: 'Fat Burning', color: '#00E5A0', num: 2, star: true },
  { key: 'zone3' as const, name: 'Aerobic', color: '#FFD166', num: 3 },
  { key: 'zone4' as const, name: 'Threshold', color: '#FF8C42', num: 4 },
  { key: 'zone5' as const, name: 'Maximum', color: '#FF4444', num: 5 },
];

export default function Moment4({ zones, betaBlocker, onContinue }: Moment4Props) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '80px 24px 120px',
      position: 'relative',
    }}>
      {/* Top label */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text2)',
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        Your Training Zones
      </p>

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
        {ZONE_CONFIG.map((zone) => {
          const z = zones[zone.key];
          const isZ2 = zone.star;

          return (
            <div
              key={zone.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '44px',
                borderLeft: `4px solid ${zone.color}`,
                paddingLeft: '12px',
                paddingRight: '12px',
                ...(isZ2 ? {
                  background: 'var(--accent-dark)',
                  border: '1px solid rgba(0,184,162,0.2)',
                  borderLeft: `4px solid ${zone.color}`,
                  borderRadius: '10px',
                } : {}),
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
                  fontWeight: isZ2 ? 600 : 400,
                }}>
                  {isZ2 && <span style={{ marginRight: '4px' }}>{'★'}</span>}
                  {zone.name}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: isZ2 ? 700 : 500,
                color: isZ2 ? 'var(--accent)' : 'var(--text)',
              }}>
                {z.min} &ndash; {z.max}
                <span style={{ fontSize: '0.55rem', fontWeight: 400, color: 'var(--text2)', marginLeft: '4px' }}>bpm</span>
              </span>
            </div>
          );
        })}
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
