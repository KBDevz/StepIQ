interface Moment0Props {
  onAdvance: () => void;
}

export default function Moment0({ onAdvance }: Moment0Props) {
  return (
    <div
      onClick={onAdvance}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(0,184,162,0.08) 0%, transparent 60%)',
        animation: 'glowPulse 3s ease-in-out infinite',
      }} />

      {/* Sonar rings */}
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--accent)',
        }} />
        <div className="sonar-ring" style={{ animationDelay: '0s' }} />
        <div className="sonar-ring" style={{ animationDelay: '0.5s' }} />
        <div className="sonar-ring" style={{ animationDelay: '1s' }} />
      </div>

      {/* Copy */}
      <div style={{ textAlign: 'center', marginTop: '48px', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.8rem',
          fontWeight: 700,
          color: 'var(--text)',
          lineHeight: 1.1,
        }}>
          You did it.
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.1rem',
          color: 'var(--text2)',
          marginTop: '12px',
        }}>
          That took real effort.
        </p>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'var(--text2)',
          lineHeight: 1.6,
          maxWidth: '300px',
          marginTop: '8px',
        }}>
          Most people never bother to find out where they stand.
        </p>
      </div>

      {/* Bottom CTA */}
      <p
        className="bounce-up"
        style={{
          position: 'absolute',
          bottom: '60px',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
        }}
      >
        Tap to see your results &rarr;
      </p>

      <style>{`
        .sonar-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          animation: sonarExpand 1.5s ease-out infinite;
        }
        @keyframes sonarExpand {
          0% { width: 40px; height: 40px; opacity: 1; }
          100% { width: 80px; height: 80px; opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .bounce-up {
          animation: bounceUp 1.5s ease-in-out infinite;
        }
        @keyframes bounceUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
