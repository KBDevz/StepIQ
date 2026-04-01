import { RPE_SCALE } from '../../utils/protocol';

interface RpeChartProps {
  selected: number | null;
  onSelect: (value: number) => void;
}

export default function RpeChart({ selected, onSelect }: RpeChartProps) {
  return (
    <div className="space-y-1.5">
      {RPE_SCALE.map((entry) => {
        const isStop = entry.value >= 7;
        const isActive = selected === entry.value;

        return (
          <button
            key={entry.value}
            type="button"
            onClick={() => onSelect(entry.value)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
              isActive
                ? isStop
                  ? 'bg-[#FF8C42]/20 border border-[#FF8C42]/40'
                  : 'bg-[#00E5A0]/15 border border-[#00E5A0]/40'
                : 'bg-[#152238]/50 border border-transparent hover:border-[#1C2F4A]'
            }`}
          >
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
                isStop
                  ? 'bg-[#FF8C42]/20 text-[#FF8C42]'
                  : 'bg-[#1C2F4A] text-[#EEF2FF]'
              }`}
            >
              {entry.value}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-mono text-sm truncate ${isStop ? 'text-[#FF8C42]' : 'text-[#EEF2FF]'}`}>
                {entry.label}
              </p>
              <p className="font-mono text-[11px] text-[#5A7090] truncate">{entry.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
