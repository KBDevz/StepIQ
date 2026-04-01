import { useState } from 'react';
import Button from '../ui/Button';

interface APIKeyModalProps {
  onSubmit: (key: string) => void;
  onClose: () => void;
  error?: string | null;
}

export default function APIKeyModal({ onSubmit, onClose, error }: APIKeyModalProps) {
  const [key, setKey] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-[#060C18]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[400px] bg-[#0D1829] border border-[#1C2F4A] rounded-2xl p-6">
        <h3 className="font-serif text-xl text-[#EEF2FF] mb-2">API Key Required</h3>
        <p className="font-mono text-xs text-[#5A7090] mb-4 leading-relaxed">
          Enter your Anthropic API key to generate the AI report. Your key is stored in memory only and never persisted.
        </p>

        {error && (
          <div className="mb-3 p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/25">
            <p className="font-mono text-xs text-[#FF4444]">{error}</p>
          </div>
        )}

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full bg-[#152238] border border-[#1C2F4A] rounded-xl px-4 py-3 font-mono text-sm text-[#EEF2FF] placeholder-[#5A7090]/50 focus:outline-none focus:border-[#00E5A0]/50 transition-colors mb-4"
        />

        <div className="space-y-2">
          <Button onClick={() => key.trim() && onSubmit(key.trim())} disabled={!key.trim()}>
            Submit Key
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
