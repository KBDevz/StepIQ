interface BeatDotsProps {
  activeBeat: number; // 0-3, -1 for none
}

export default function BeatDots({ activeBeat }: BeatDotsProps) {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-all duration-100 ${
            activeBeat === i
              ? 'bg-[#00E5A0] shadow-[0_0_12px_rgba(0,229,160,0.6)] scale-125'
              : 'bg-[#1C2F4A]'
          }`}
        />
      ))}
    </div>
  );
}
