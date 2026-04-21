import { useCallback } from 'react';

interface HRKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  showConfirm?: boolean;
}

export default function HRKeypad({
  value,
  onChange,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmDisabled = false,
  showConfirm = true,
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

  const keys = showConfirm
    ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', 'confirm']
    : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', 'empty'];

  const btnBase: React.CSSProperties = {
    height: '60px',
    borderRadius: '14px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '1.35rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.15s, transform 0.1s',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
      {keys.map((key) => {
        if (key === 'empty') {
          return <div key={key} />;
        }
        if (key === 'back') {
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleKey('back')}
              style={{ ...btnBase, background: 'var(--surface2)', color: 'var(--text2)' }}
              onMouseDown={(e) => { (e.target as HTMLElement).style.transform = 'scale(0.95)'; }}
              onMouseUp={(e) => { (e.target as HTMLElement).style.transform = ''; }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              style={{
                ...btnBase,
                background: 'var(--accent-glow)',
                color: 'var(--accent)',
                fontSize: '0.85rem',
                fontWeight: 600,
                opacity: confirmDisabled ? 0.3 : 1,
                cursor: confirmDisabled ? 'not-allowed' : 'pointer',
              }}
              onMouseDown={(e) => { if (!confirmDisabled) (e.target as HTMLElement).style.transform = 'scale(0.95)'; }}
              onMouseUp={(e) => { (e.target as HTMLElement).style.transform = ''; }}
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
            style={{ ...btnBase, background: 'var(--surface2)', color: 'var(--text)' }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--surface3)'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'var(--surface2)'; }}
            onMouseDown={(e) => { (e.target as HTMLElement).style.transform = 'scale(0.95)'; }}
            onMouseUp={(e) => { (e.target as HTMLElement).style.transform = ''; }}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
