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
    fontFamily: "'IBM Plex Mono', monospace",
    borderRadius: '10px',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.2s, color 0.2s, background 0.2s',
    outline: 'none',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: '#00E5A0',
      color: '#060C18',
      fontSize: '0.78rem',
      fontWeight: 700,
      padding: '15px 24px',
      border: 'none',
      boxShadow: '0 0 24px rgba(0,229,160,0.2)',
    },
    ghost: {
      background: 'rgba(13,24,41,0.7)',
      color: '#C4D4E8',
      fontSize: '0.72rem',
      fontWeight: 500,
      letterSpacing: '0.08em',
      padding: '13px 24px',
      border: '1px solid rgba(100,140,180,0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
    danger: {
      background: 'transparent',
      color: '#FF4444',
      fontSize: '0.72rem',
      fontWeight: 500,
      padding: '13px 24px',
      border: '1px solid rgba(255,68,68,0.3)',
    },
    report: {
      background: '#0D1829',
      color: '#00E5A0',
      fontSize: '0.78rem',
      fontWeight: 600,
      padding: '15px 24px',
      border: '1px solid rgba(0,229,160,0.4)',
      boxShadow: '0 0 20px rgba(0,229,160,0.1)',
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
          el.style.boxShadow = '0 0 40px rgba(0,229,160,0.35), 0 8px 20px rgba(0,229,160,0.15)';
        } else if (variant === 'ghost') {
          el.style.borderColor = 'rgba(100,140,180,0.7)';
          el.style.color = '#fff';
        } else if (variant === 'report') {
          el.style.borderColor = '#00E5A0';
          el.style.boxShadow = '0 0 30px rgba(0,229,160,0.2)';
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
