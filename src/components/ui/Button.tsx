interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'report';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'font-mono text-sm tracking-wide rounded-xl py-3.5 px-6 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#00E5A0] text-[#060C18] font-semibold hover:bg-[#00cc8e] active:scale-[0.98] shadow-[0_0_20px_rgba(0,229,160,0.2)]',
    ghost:
      'bg-transparent text-[#5A7090] border border-[#1C2F4A] hover:border-[#5A7090] hover:text-[#EEF2FF]',
    danger:
      'bg-transparent text-[#FF4444] border border-[#FF4444]/30 hover:bg-[#FF4444]/10',
    report:
      'bg-[#0D1829] text-[#00E5A0] border border-[#00E5A0]/40 hover:border-[#00E5A0] shadow-[0_0_20px_rgba(0,229,160,0.1)] hover:shadow-[0_0_30px_rgba(0,229,160,0.2)]',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
