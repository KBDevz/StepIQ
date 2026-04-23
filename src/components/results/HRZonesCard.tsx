import type { HRZones } from '../../utils/scoring';

interface HRZonesCardProps {
  zones: HRZones;
  betaBlocker: boolean;
}

const ZONE_CONFIG = [
  { key: 'zone1' as const, num: 1, name: 'Recovery', color: '#4A9EFF', desc: 'Active recovery · Fat oxidation dominant' },
  { key: 'zone2' as const, num: 2, name: 'Fat Burning', color: '#00E5A0', desc: 'Optimal fat burning · Aerobic base building', star: true },
  { key: 'zone3' as const, num: 3, name: 'Aerobic', color: '#FFD166', desc: 'Mixed fuel · Cardiovascular development' },
  { key: 'zone4' as const, num: 4, name: 'Threshold', color: '#FF8C42', desc: 'Performance gains · High carb burn' },
  { key: 'zone5' as const, num: 5, name: 'Maximum', color: '#FF4444', desc: 'Peak efforts · Short intervals only' },
];

export default function HRZonesCard({ zones, betaBlocker }: HRZonesCardProps) {
  const totalRange = zones.maxHR - (zones.zone1.min || 80);

  return (
    <div
      style={{
        background: '#0D1829',
        border: '1px solid #1C2F4A',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '12px',
      }}
    >
      {/* Header */}
      <p
        className="font-mono"
        style={{
          fontSize: '0.58rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: '#5A7090',
          marginBottom: '4px',
        }}
      >
        Your Heart Rate Zones
      </p>
      <p
        className="font-mono"
        style={{
          fontSize: '0.62rem',
          color: '#5A7090',
          marginBottom: '16px',
          lineHeight: 1.5,
        }}
      >
        Calculated from your test data using the Karvonen heart rate reserve method
      </p>

      {/* Zone rows */}
      {ZONE_CONFIG.map((zone, i) => {
        const z = zones[zone.key];
        const barWidth = Math.max(10, ((z.max - z.min) / totalRange) * 100);
        const barLeft = ((z.min - zones.zone1.min) / totalRange) * 100;

        return (
          <div
            key={zone.key}
            style={{
              padding: '10px 0',
              borderBottom: i < ZONE_CONFIG.length - 1 ? '1px solid rgba(28,47,74,0.5)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: zone.color,
                    background: `${zone.color}15`,
                    border: `1px solid ${zone.color}40`,
                    borderRadius: '4px',
                    padding: '2px 6px',
                  }}
                >
                  Z{zone.num}
                </span>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#EEF2FF', fontWeight: 600 }}>
                  {zone.name}
                  {zone.star && <span style={{ color: '#00E5A0', marginLeft: '4px' }}>{'★'}</span>}
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#EEF2FF' }}>
                {z.min} – {z.max}
                <span style={{ fontSize: '0.55rem', fontWeight: 400, color: '#5A7090', marginLeft: '4px' }}>bpm</span>
              </span>
            </div>

            {/* Color bar */}
            <div style={{ position: 'relative', height: '6px', background: 'rgba(28,47,74,0.3)', borderRadius: '3px', marginBottom: '4px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: `${barLeft}%`,
                  width: `${barWidth}%`,
                  height: '100%',
                  background: zone.color,
                  borderRadius: '3px',
                  opacity: 0.7,
                }}
              />
            </div>

            <p className="font-mono" style={{ fontSize: '0.55rem', color: '#5A7090', lineHeight: 1.4 }}>
              {zone.desc}
            </p>
          </div>
        );
      })}

      {/* Fat Burning Highlight */}
      <div
        style={{
          background: 'rgba(0,229,160,0.06)',
          border: '1px solid rgba(0,229,160,0.2)',
          borderRadius: '10px',
          padding: '14px 16px',
          marginTop: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="font-serif" style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            Your Fat Burning Zone
          </span>
        </div>

        <p className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00E5A0', marginBottom: '4px' }}>
          {zones.fatBurnMin} – {zones.fatBurnMax}
          <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#5A7090', marginLeft: '6px' }}>bpm</span>
        </p>

        <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5A7090', marginTop: '14px', marginBottom: '4px' }}>
          What It Feels Like
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.6 }}>
          You can hold a conversation but you're clearly working. Breathing is heavier but controlled — like a brisk walk or easy jog.
        </p>

        <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5A7090', marginTop: '12px', marginBottom: '4px' }}>
          How to Use It
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#5A7090', lineHeight: 1.6 }}>
          Aim for 30–45 minutes in this zone, 3–4 times per week. This is your primary fat burning window.
        </p>

        {betaBlocker && (
          <p className="font-mono" style={{ fontSize: '0.62rem', color: '#FF8C42', marginTop: '8px', lineHeight: 1.5 }}>
            Note: Your zones are adjusted for beta blocker medication which limits maximum heart rate response.
          </p>
        )}
      </div>

      {/* Calibration note */}
      <p
        className="font-mono"
        style={{
          fontSize: '0.58rem',
          color: '#5A7090',
          lineHeight: 1.6,
          fontStyle: 'italic',
          marginTop: '14px',
        }}
      >
        These zones are estimated from your Chester Step Test data using the Karvonen heart rate reserve method. For the most precise zones, a maximal exercise test with lactate measurement is recommended. These estimates are accurate to approximately ±5–8 bpm for most individuals.
      </p>
    </div>
  );
}
