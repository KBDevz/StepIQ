import type { TestState, ClassificationResult } from '../types';

function toAscii(str: string): string {
  // Replace common non-ASCII with ASCII equivalents
  const subs: Record<string, string> = {
    '\u2013': '-', '\u2014': '-', '\u2018': "'", '\u2019': "'",
    '\u201C': '"', '\u201D': '"', '\u2026': '...', '\u00B7': '*',
    '\u2022': '*', '\u00B2': '2', '\u00B3': '3', '\u2070': '0',
    '\u00B9': '1', '\u2074': '4', '\u2075': '5', '\u2076': '6',
    '\u2077': '7', '\u2078': '8', '\u2079': '9',
  };
  let out = str;
  for (const [k, v] of Object.entries(subs)) {
    out = out.split(k).join(v);
  }
  // Strip remaining non-ASCII
  return out.replace(/[^\x00-\x7F]/g, '');
}

export function buildReportPrompt(
  state: TestState,
  vo2Max: number,
  classification: ClassificationResult,
  stopReason: string,
): string {
  const hrZones = [0.60, 0.65, 0.70, 0.75, 0.80].map(pct => ({
    pct: Math.round(pct * 100),
    bpm: Math.round(state.maxHR * pct),
  }));

  const vo2Target = Math.round(vo2Max * 1.09 * 10) / 10;

  const levelLines = state.data.map(d => {
    const ratio = Math.round((d.hr / d.vo2Estimate) * 100) / 100;
    return `  Level ${d.level}: HR ${d.hr} bpm, RPE ${d.rpe}, VO2 est ${d.vo2Estimate} ml/kg/min, HR:VO2 ratio ${ratio}`;
  }).join('\n');

  const hrValues = state.data.map(d => d.hr);
  const hrRange = hrValues.length > 1
    ? `${Math.min(...hrValues)}-${Math.max(...hrValues)} bpm (delta ${Math.max(...hrValues) - Math.min(...hrValues)})`
    : `${hrValues[0]} bpm`;

  const rpeProgression = state.data.map(d => d.rpe).join(' -> ');

  const prompt = `You are a clinical exercise physiologist analyzing a Chester Step Test result.
Return ONLY raw JSON (no markdown, no code fences, no extra text).

Patient:
  Name: ${state.name || 'Not provided'}
  Age: ${state.age}
  Sex: ${state.sex}
  Resting HR: ${state.restingHR ?? 'Not recorded'}
  Predicted Max HR: ${state.maxHR} bpm
  Beta blocker: ${state.betaBlocker ? 'Yes (Londeree formula)' : 'No (standard 220-age)'}

Test Data:
${levelLines}

HR range: ${hrRange}
RPE progression: ${rpeProgression}
Levels completed: ${state.data.length} of 5
Stop reason: ${stopReason}

Results:
  Estimated VO2 max: ${Math.round(vo2Max * 10) / 10} ml/kg/min
  K. Sykes classification: ${classification.name} (for ${state.sex}, age ${state.age})

HR Training Zones:
${hrZones.map(z => `  ${z.pct}% max HR = ${z.bpm} bpm`).join('\n')}

VO2 improvement target: ${vo2Target} ml/kg/min (9% improvement)

Respond with this exact JSON structure:
{
  "score_meaning": "3-4 sentences about their specific VO2 max score, what it means physiologically, and how it compares to norms for their age/sex.",
  "observations": [
    "observation referencing actual HR numbers from the data",
    "observation about HR trajectory and aerobic efficiency",
    "observation about RPE pattern vs physiological response",
    "observation about anything clinically notable"
  ],
  "protocol": [
    {
      "weeks": "Weeks 1-2",
      "phase": "Foundation",
      "exercise": "specific activity recommendation",
      "duration": "e.g. 25 minutes",
      "intensity": "60-65% max HR (X-Y bpm) / RPE 3-4",
      "frequency": "3x per week",
      "focus": "one sentence on the physiological adaptation goal"
    },
    {
      "weeks": "Weeks 3-4",
      "phase": "Build",
      "exercise": "...",
      "duration": "...",
      "intensity": "...",
      "frequency": "...",
      "focus": "..."
    },
    {
      "weeks": "Weeks 5-6",
      "phase": "Development",
      "exercise": "...",
      "duration": "...",
      "intensity": "...",
      "frequency": "...",
      "focus": "..."
    },
    {
      "weeks": "Weeks 7-8",
      "phase": "Peak",
      "exercise": "...",
      "duration": "...",
      "intensity": "...",
      "frequency": "...",
      "focus": "..."
    }
  ],
  "next_target": {
    "vo2_target": ${vo2Target},
    "timeframe": "8-10 weeks with consistent training",
    "classification": "the classification they would reach",
    "improvement_needed": ${Math.round((vo2Target - vo2Max) * 10) / 10},
    "closing": "motivating sentence specific to this patient"
  }
}

Use actual HR values from the data in your observations and protocol intensity zones.`;

  return toAscii(prompt);
}
