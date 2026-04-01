interface BeatDotsProps {
  activeBeat: number; // 0-3, -1 for none
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
            background: activeBeat === i ? '#00E5A0' : '#1C2F4A',
            transform: activeBeat === i ? 'scale(1.3)' : 'scale(1)',
            boxShadow: activeBeat === i ? '0 0 12px rgba(0,229,160,0.6)' : 'none',
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}
    </div>
  );
}
