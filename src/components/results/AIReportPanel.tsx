import type { AIReport, ClassificationResult } from '../../types';
import FormCard from '../ui/FormCard';

interface AIReportPanelProps {
  report: AIReport;
  vo2Max: number;
  classification: ClassificationResult;
}

export default function AIReportPanel({ report, vo2Max, classification }: AIReportPanelProps) {
  return (
    <div className="space-y-4 mt-4 animate-fadeIn">
      {/* Score header */}
      <FormCard>
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl font-bold" style={{ color: classification.color }}>
            {Math.round(vo2Max * 10) / 10}
          </span>
          <div>
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold"
              style={{ color: classification.color, backgroundColor: classification.bgColor }}
            >
              {classification.name}
            </span>
            <p className="font-mono text-xs text-[#5A7090] mt-0.5">ml/kg/min</p>
          </div>
        </div>
      </FormCard>

      {/* Score meaning */}
      <FormCard>
        <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-2">
          What Your Score Means
        </p>
        <p className="font-mono text-sm text-[#EEF2FF]/80 leading-relaxed">
          {report.score_meaning}
        </p>
      </FormCard>

      {/* Observations */}
      <FormCard>
        <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-3">
          Key Observations
        </p>
        <ul className="space-y-2.5">
          {report.observations.map((obs, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00E5A0] mt-1.5" />
              <p className="font-mono text-sm text-[#EEF2FF]/80 leading-relaxed">{obs}</p>
            </li>
          ))}
        </ul>
      </FormCard>

      {/* 8-Week Protocol */}
      <div>
        <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-3 px-1">
          8-Week Improvement Protocol
        </p>
        <div className="space-y-3">
          {report.protocol.map((week) => (
            <FormCard key={week.weeks}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-sm text-[#EEF2FF] font-semibold">{week.weeks}</span>
                <span className="px-2 py-0.5 rounded bg-[#00E5A0]/10 border border-[#00E5A0]/20 font-mono text-[10px] text-[#00E5A0] uppercase">
                  {week.phase}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  ['Exercise', week.exercise],
                  ['Duration', week.duration],
                  ['Intensity', week.intensity],
                  ['Frequency', week.frequency],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] text-[#5A7090] uppercase tracking-wider">{label}</p>
                    <p className="font-mono text-xs text-[#EEF2FF]/80 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs text-[#5A7090] italic">{week.focus}</p>
            </FormCard>
          ))}
        </div>
      </div>

      {/* Next target */}
      <FormCard>
        <p className="font-mono text-xs text-[#00E5A0] uppercase tracking-wider mb-3">
          Next Test Target
        </p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-mono text-3xl text-[#00E5A0] font-bold">
            {report.next_target.vo2_target}
          </span>
          <span className="font-mono text-xs text-[#5A7090]">ml/kg/min</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <p className="font-mono text-[10px] text-[#5A7090] uppercase">Target</p>
            <p className="font-mono text-xs text-[#EEF2FF]">{report.next_target.classification}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#5A7090] uppercase">Improvement</p>
            <p className="font-mono text-xs text-[#EEF2FF]">+{report.next_target.improvement_needed}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] text-[#5A7090] uppercase">Timeframe</p>
            <p className="font-mono text-xs text-[#EEF2FF]">{report.next_target.timeframe}</p>
          </div>
        </div>
        <p className="font-mono text-sm text-[#EEF2FF]/80 italic">{report.next_target.closing}</p>
      </FormCard>
    </div>
  );
}
