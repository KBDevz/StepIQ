interface LevelTimerProps {
  remaining: number;
  progress: number;
  alert?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LevelTimer({ remaining, progress, alert = false }: LevelTimerProps) {
  return (
    <div className="w-full">
      <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider text-center mb-2">
        Time Remaining
      </p>
      <p
        className="font-mono text-5xl text-center tabular-nums mb-4"
        style={{
          color: alert ? '#FF8C42' : '#EEF2FF',
          animation: alert ? 'timerPulse 0.8s ease-in-out infinite' : 'none',
          transition: 'color 0.3s',
        }}
      >
        {formatTime(remaining)}
      </p>
      <div className="w-full h-1.5 bg-[#152238] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-linear"
          style={{
            width: `${progress * 100}%`,
            background: alert ? '#FF8C42' : '#00E5A0',
          }}
        />
      </div>
      <style>{`
        @keyframes timerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
