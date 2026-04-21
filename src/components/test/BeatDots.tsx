interface BeatDotsProps {
  activeBeat: number;
}

export default function BeatDots({ activeBeat }: BeatDotsProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 0' }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: activeBeat === i ? 'var(--accent)' : 'var(--border)',
            transform: activeBeat === i ? 'scale(1.3)' : 'scale(1)',
            boxShadow: activeBeat === i ? '0 0 12px rgba(0,229,160,0.6)' : 'none',
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}
    </div>
  );
}
