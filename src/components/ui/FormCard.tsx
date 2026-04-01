interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function FormCard({ children, className = '' }: FormCardProps) {
  return (
    <div
      className={`bg-[#0D1829]/80 backdrop-blur-md border border-[#1C2F4A] rounded-2xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}
