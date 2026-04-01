interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'amber' | 'danger';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const colors = {
    default: 'border-[#00E5A0]/30 text-[#00E5A0] bg-[#00E5A0]/10',
    amber: 'border-[#FF8C42]/30 text-[#FF8C42] bg-[#FF8C42]/10',
    danger: 'border-[#FF4444]/30 text-[#FF4444] bg-[#FF4444]/10',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.15em] border ${colors[variant]}`}
    >
      {children}
    </span>
  );
}
