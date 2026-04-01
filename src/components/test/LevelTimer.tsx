interface LevelTimerProps {
  remaining: number;
  progress: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LevelTimer({ remaining, progress }: LevelTimerProps) {
  return (
    <div className="w-full">
      <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider text-center mb-2">
        Time Remaining
      </p>
      <p className="font-mono text-5xl text-[#EEF2FF] text-center tabular-nums mb-4">
        {formatTime(remaining)}
      </p>
      <div className="w-full h-1.5 bg-[#152238] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00E5A0] rounded-full transition-all duration-500 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
