import { useState } from 'react';
import Button from '../ui/Button';

interface ChecklistScreenProps {
  onBegin: () => void;
  onBack: () => void;
}

const CHECKLIST_ITEMS = [
  'I have a step approximately 30cm (12 inches) high',
  'I have a way to check my heart rate',
  'I am wearing appropriate footwear',
  'I understand I should stop if I feel unwell',
];

export default function ChecklistScreen({ onBegin, onBack }: ChecklistScreenProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));

  const allChecked = checked.every(Boolean);

  function toggle(index: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '32px 28px', flex: 1 }}>
      <span
        className="font-mono"
        style={{
          display: 'inline-block',
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          color: 'var(--accent)',
          marginBottom: '12px',
        }}
      >
        Pre-Test
      </span>

      <h2
        className="font-serif"
        style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}
      >
        Ready to begin?
      </h2>
      <p
        className="font-mono"
        style={{ fontSize: '0.7rem', color: 'var(--text2)', marginBottom: '32px', lineHeight: 1.6 }}
      >
        Confirm each item before starting the test.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
        {CHECKLIST_ITEMS.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              minHeight: '52px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: checked[i] ? 'var(--accent-dark)' : 'var(--surface2)',
              border: `1px solid ${checked[i] ? 'rgba(0,229,160,0.35)' : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: `2px solid ${checked[i] ? 'var(--accent)' : 'var(--border)'}`,
                background: checked[i] ? 'var(--accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {checked[i] && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#060C18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              className="font-mono"
              style={{
                fontSize: '0.75rem',
                color: checked[i] ? 'var(--text)' : 'var(--text2)',
                lineHeight: 1.5,
                transition: 'color 0.2s',
              }}
            >
              {item}
            </span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button onClick={onBegin} disabled={!allChecked}>
          Begin Test
        </Button>
        <Button variant="ghost" onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
