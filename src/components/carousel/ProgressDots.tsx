interface ProgressDotsProps {
  current: number; // 1-6 (Moment index)
  total: number;
}

export default function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      paddingTop: '20px',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const dotIndex = i + 1;
        const isCompleted = dotIndex < current;
        const isCurrent = dotIndex === current;

        return (
          <div
            key={i}
            style={{
              width: isCurrent ? '24px' : '8px',
              height: '8px',
              borderRadius: isCurrent ? '4px' : '50%',
              background: isCurrent
                ? 'var(--accent)'
                : isCompleted
                  ? 'var(--accent)'
                  : 'var(--border)',
              opacity: isCompleted ? 0.5 : 1,
              transition: 'all 0.3s ease',
              animation: isCurrent ? 'dotPulse 2s ease-in-out infinite' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
