import { useState, useCallback } from 'react';
import type { TestState, AIReport } from '../../types';
import { calcVO2Max, classify } from '../../utils/scoring';
import { buildReportPrompt } from '../../utils/reportPrompt';
import Button from '../ui/Button';
import FormCard from '../ui/FormCard';
import RegressionChart from '../results/RegressionChart';
import AIReportPanel from '../results/AIReportPanel';
import APIKeyModal from '../results/APIKeyModal';

interface ResultsScreenProps {
  state: TestState;
  stopReason: string;
  onNewTest: () => void;
}

export default function ResultsScreen({ state, stopReason, onNewTest }: ResultsScreenProps) {
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_ANTHROPIC_API_KEY || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const vo2Max = calcVO2Max(state.data, state.maxHR);
  const classification = classify(vo2Max, state.age, state.sex);
  const vo2Display = Math.round(vo2Max * 10) / 10;

  const generateReport = useCallback(
    async (key: string) => {
      setLoading(true);
      setReportError(null);
      setShowKeyModal(false);

      try {
        const prompt = buildReportPrompt(state, vo2Max, classification, stopReason);

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-5-20250514',
            max_tokens: 1800,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (res.status === 401 || res.status === 403) {
          setApiKey('');
          setKeyError('Invalid API key. Please try again.');
          setShowKeyModal(true);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const body = await res.json();
        const text = body.content?.[0]?.text || '';

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');

        const parsed: AIReport = JSON.parse(jsonMatch[0]);
        setReport(parsed);
        setApiKey(key);
      } catch (err: any) {
        setReportError(err.message || 'Failed to generate report');
      } finally {
        setLoading(false);
      }
    },
    [state, vo2Max, classification, stopReason],
  );

  const handleGenerateClick = useCallback(() => {
    if (apiKey) {
      generateReport(apiKey);
    } else {
      setShowKeyModal(true);
    }
  }, [apiKey, generateReport]);

  const hrFormula = state.betaBlocker ? 'Adjusted (Londeree)' : 'Standard (220-age)';

  return (
    <div className="px-5 py-6 pb-20 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#00E5A0]/15 border border-[#00E5A0]/30 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="font-serif text-xl text-[#EEF2FF]">StepIQ</h1>
          <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">Test Results</p>
        </div>
      </div>

      {/* VO2 Max Score */}
      <div className="text-center mb-6">
        <p className="font-mono text-7xl font-bold tabular-nums" style={{ color: classification.color }}>
          {vo2Display}
        </p>
        <p className="font-mono text-xs text-[#5A7090] mt-1">ml · kg⁻¹ · min⁻¹</p>
        <div className="mt-3">
          <span
            className="inline-block px-4 py-1.5 rounded-full font-mono text-sm font-semibold"
            style={{ color: classification.color, backgroundColor: classification.bgColor }}
          >
            {classification.name}
          </span>
        </div>
      </div>

      {/* Regression Chart */}
      <div className="mb-4">
        <RegressionChart data={state.data} maxHR={state.maxHR} vo2Max={vo2Max} />
      </div>

      {/* Per-level table */}
      <FormCard className="mb-4">
        <p className="font-mono text-xs text-[#5A7090] uppercase tracking-wider mb-3">Level Data</p>
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-[#5A7090]">
                <th className="text-left py-1.5">Level</th>
                <th className="text-right py-1.5">HR (bpm)</th>
                <th className="text-right py-1.5">RPE</th>
                <th className="text-right py-1.5">VO2 est.</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((d) => (
                <tr key={d.level} className="text-[#EEF2FF] border-t border-[#1C2F4A]/50">
                  <td className="py-2">{d.level}</td>
                  <td className="text-right py-2">{d.hr}</td>
                  <td className="text-right py-2">
                    <span className={d.rpe >= 7 ? 'text-[#FF8C42]' : ''}>{d.rpe}</span>
                  </td>
                  <td className="text-right py-2">{d.vo2Estimate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormCard>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <FormCard>
          <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">Max HR (pred.)</p>
          <p className="font-mono text-lg text-[#EEF2FF] mt-1">{state.maxHR} <span className="text-xs text-[#5A7090]">bpm</span></p>
        </FormCard>
        <FormCard>
          <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">Levels Done</p>
          <p className="font-mono text-lg text-[#EEF2FF] mt-1">{state.data.length} <span className="text-xs text-[#5A7090]">of 5</span></p>
        </FormCard>
        <FormCard>
          <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">Age</p>
          <p className="font-mono text-lg text-[#EEF2FF] mt-1">{state.age}</p>
        </FormCard>
        <FormCard>
          <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">HR Formula</p>
          <p className={`font-mono text-xs mt-1 ${state.betaBlocker ? 'text-[#FF8C42]' : 'text-[#EEF2FF]'}`}>
            {hrFormula}
          </p>
        </FormCard>
      </div>

      {/* Resting HR */}
      {state.restingHR !== null && (
        <FormCard className="mb-4">
          <div className="flex justify-between items-center">
            <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">Resting HR</p>
            <p className="font-mono text-lg text-[#EEF2FF]">{state.restingHR} <span className="text-xs text-[#5A7090]">bpm</span></p>
          </div>
        </FormCard>
      )}

      {/* Warning banner */}
      {state.data.length < 3 && (
        <div className="mb-4 p-4 rounded-xl bg-[#FF8C42]/10 border border-[#FF8C42]/25">
          <p className="font-mono text-xs text-[#FF8C42] leading-relaxed">
            Warning: Fewer than 3 levels completed. Linear regression requires at least 3 data points for clinically valid extrapolation. Results should be interpreted with caution.
          </p>
        </div>
      )}

      {/* Generate Report button */}
      <div className="mb-4">
        <Button variant="report" onClick={handleGenerateClick} disabled={loading}>
          {loading ? 'Generating Report...' : 'Generate AI Report'}
        </Button>
      </div>

      {reportError && (
        <div className="mb-4 p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/25">
          <p className="font-mono text-xs text-[#FF4444]">{reportError}</p>
        </div>
      )}

      {/* AI Report */}
      {report && (
        <AIReportPanel report={report} vo2Max={vo2Max} classification={classification} />
      )}

      {/* New test button */}
      <div className="mt-6">
        <Button onClick={onNewTest}>Take New Test</Button>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <APIKeyModal
          onSubmit={(key) => {
            setKeyError(null);
            generateReport(key);
          }}
          onClose={() => setShowKeyModal(false)}
          error={keyError}
        />
      )}
    </div>
  );
}
