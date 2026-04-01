import { useCallback } from 'react';

interface HRKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
}

export default function HRKeypad({
  value,
  onChange,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmDisabled = false,
}: HRKeypadProps) {
  const handleKey = useCallback(
    (key: string) => {
      if (key === 'back') {
        onChange(value.slice(0, -1));
      } else if (key === 'confirm') {
        onConfirm?.();
      } else {
        if (value.length < 3) onChange(value + key);
      }
    },
    [value, onChange, onConfirm],
  );

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', 'confirm'];

  return (
    <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
      {keys.map((key) => {
        if (key === 'back') {
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleKey('back')}
              className="h-14 rounded-xl bg-[#152238] text-[#5A7090] font-mono text-lg
                hover:bg-[#1C2F4A] active:scale-95 transition-all flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          );
        }
        if (key === 'confirm') {
          return (
            <button
              key={key}
              type="button"
              disabled={confirmDisabled}
              onClick={() => handleKey('confirm')}
              className="h-14 rounded-xl bg-[#00E5A0]/15 text-[#00E5A0] font-mono text-sm font-semibold
                hover:bg-[#00E5A0]/25 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {confirmLabel === 'Confirm' ? '✓' : confirmLabel}
            </button>
          );
        }
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className="h-14 rounded-xl bg-[#152238] text-[#EEF2FF] font-mono text-xl
              hover:bg-[#1C2F4A] active:scale-95 transition-all"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
