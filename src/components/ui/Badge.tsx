interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'amber' | 'danger';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles: Record<string, React.CSSProperties> = {
    default: {
      background: 'var(--accent-dark)',
      border: '1px solid rgba(0,184,162,0.3)',
      color: 'var(--accent)',
    },
    amber: {
      background: 'var(--warn-glow)',
      border: '1px solid rgba(245,165,36,0.3)',
      color: 'var(--warn)',
    },
    danger: {
      background: 'rgba(240,79,79,0.12)',
      border: '1px solid rgba(240,79,79,0.3)',
      color: 'var(--danger)',
    },
  };

  return (
    <span
      className="inline-block font-mono uppercase"
      style={{
        ...styles[variant],
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        borderRadius: '20px',
        padding: '4px 12px',
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
