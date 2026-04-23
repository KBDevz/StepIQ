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
  const isDataDerived = zones.method === 'data-derived';

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
      {/* Header with method badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
        <p
          className="font-mono"
          style={{
            fontSize: '0.58rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#5A7090',
          }}
        >
          Your Heart Rate Zones
        </p>
        <span
          className="font-mono"
          style={{
            fontSize: '0.52rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
            color: isDataDerived ? '#00E5A0' : '#5A7090',
            background: isDataDerived ? 'rgba(0,229,160,0.1)' : 'rgba(90,112,144,0.1)',
            border: `1px solid ${isDataDerived ? 'rgba(0,229,160,0.25)' : 'rgba(90,112,144,0.2)'}`,
            borderRadius: '20px',
            padding: '3px 10px',
            flexShrink: 0,
          }}
        >
          {isDataDerived ? 'Data-Derived Zones' : 'Karvonen Method'}
        </span>
      </div>

      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.75rem',
          color: '#5A7090',
          marginBottom: '16px',
          lineHeight: 1.5,
          fontStyle: 'italic',
        }}
      >
        {isDataDerived
          ? `Calculated from your actual heart rate response at ${zones.levelsUsed} measured workloads — not a generic age-based formula.`
          : 'Calculated using the Karvonen heart rate reserve method. Complete 3+ levels next time for data-derived zones.'}
      </p>

      {/* Aerobic threshold indicator */}
      {zones.aerobicThreshold && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px',
          padding: '8px 12px',
          background: 'rgba(0,229,160,0.06)',
          border: '1px solid rgba(0,229,160,0.15)',
          borderRadius: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="font-mono" style={{ fontSize: '0.62rem', color: '#00E5A0', fontWeight: 600 }}>
            Estimated Aerobic Threshold: ~{zones.aerobicThreshold} bpm
          </span>
        </div>
      )}

      {/* Zone rows */}
      {ZONE_CONFIG.map((zone, i) => {
        const z = zones[zone.key];
        const barWidth = Math.max(10, ((z.max - z.min) / totalRange) * 100);
        const barLeft = Math.max(0, ((z.min - zones.zone1.min) / totalRange) * 100);

        // Aerobic threshold line position within this zone's bar
        const at = zones.aerobicThreshold;
        const showThresholdLine = at && at > z.min && at <= z.max;
        const thresholdPos = showThresholdLine
          ? ((at - z.min) / (z.max - z.min)) * 100
          : 0;

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

            {/* Color bar with optional threshold line */}
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
              {showThresholdLine && (
                <div style={{
                  position: 'absolute',
                  left: `${barLeft + (barWidth * thresholdPos / 100)}%`,
                  top: '-3px',
                  width: '2px',
                  height: '12px',
                  background: '#00E5A0',
                  borderRadius: '1px',
                  boxShadow: '0 0 4px rgba(0,229,160,0.5)',
                }} />
              )}
            </div>

            <p className="font-mono" style={{ fontSize: '0.55rem', color: '#5A7090', lineHeight: 1.4 }}>
              {zone.desc}
            </p>
          </div>
        );
      })}

      {/* HR Efficiency metric */}
      {zones.hrEfficiency !== null && (
        <div style={{
          background: 'rgba(74,158,255,0.06)',
          border: '1px solid rgba(74,158,255,0.15)',
          borderRadius: '10px',
          padding: '14px 16px',
          marginTop: '14px',
        }}>
          <p className="font-mono" style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A9EFF', marginBottom: '4px' }}>
            Cardiac Efficiency
          </p>
          <p className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#EEF2FF', marginBottom: '4px' }}>
            {zones.hrEfficiency.toFixed(2)}
            <span style={{ fontSize: '0.55rem', fontWeight: 400, color: '#5A7090', marginLeft: '6px' }}>ml/kg/min per bpm</span>
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: '#5A7090', lineHeight: 1.5 }}>
            How efficiently your heart delivers oxygen per beat. Higher = stronger cardiovascular system.
          </p>
        </div>
      )}

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
        {isDataDerived
          ? `These zones are derived from linear regression of your ${zones.levelsUsed} measured HR-VO₂ data points. They reflect your individual cardiovascular response rather than population averages. Accuracy improves with more completed levels.`
          : 'These zones are estimated using the Karvonen heart rate reserve method. For the most precise zones, a maximal exercise test with lactate measurement is recommended. These estimates are accurate to approximately ±5–8 bpm for most individuals.'}
      </p>
    </div>
  );
}
