interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'report';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    borderRadius: '10px',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.2s, color 0.2s, background 0.2s',
    outline: 'none',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--bg)',
      fontSize: '0.78rem',
      fontWeight: 600,
      padding: '15px 24px',
      border: 'none',
      boxShadow: 'var(--shadow-accent)',
    },
    ghost: {
      background: 'var(--surface2)',
      color: 'var(--text2)',
      fontSize: '0.72rem',
      fontWeight: 500,
      letterSpacing: '0.06em',
      padding: '13px 24px',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--danger)',
      fontSize: '0.72rem',
      fontWeight: 500,
      padding: '13px 24px',
      border: '1px solid rgba(240,79,79,0.35)',
    },
    report: {
      background: 'var(--surface)',
      color: 'var(--accent)',
      fontSize: '0.78rem',
      fontWeight: 600,
      padding: '15px 24px',
      border: '1px solid rgba(0,184,162,0.4)',
      boxShadow: '0 0 20px rgba(0,184,162,0.1)',
    },
  };

  const mergedStyle: React.CSSProperties = {
    ...base,
    ...variants[variant],
    ...(props.disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button
      className={className}
      style={mergedStyle}
      onMouseEnter={(e) => {
        if (props.disabled) return;
        const el = e.currentTarget;
        if (variant === 'primary') {
          el.style.transform = 'translateY(-2px)';
          el.style.boxShadow = '0 0 40px rgba(0,184,162,0.35), 0 8px 20px rgba(0,184,162,0.15)';
        } else if (variant === 'ghost') {
          el.style.borderColor = 'var(--accent)';
          el.style.color = 'var(--text)';
        } else if (variant === 'report') {
          el.style.borderColor = 'var(--accent)';
          el.style.boxShadow = '0 0 30px rgba(0,184,162,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.boxShadow = variants[variant].boxShadow as string || '';
        el.style.borderColor = '';
        el.style.color = '';
      }}
      onMouseDown={(e) => {
        if (!props.disabled && variant === 'primary') {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!props.disabled && variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
