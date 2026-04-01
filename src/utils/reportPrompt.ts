import type { TestState, ClassificationResult } from '../types';

function toAscii(str: string): string {
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
  return out.replace(/[^\x00-\x7F]/g, '');
}

// ── HR Efficiency Trend ──
function computeHRTrend(data: { hr: number }[]): string {
  if (data.length < 2) return 'Insufficient data for HR trend analysis.';
  const rises: number[] = [];
  for (let i = 0; i < data.length - 1; i++) {
    rises.push(data[i + 1].hr - data[i].hr);
  }
  const avg = rises.reduce((a, b) => a + b, 0) / rises.length;
  const avgRound = Math.round(avg * 10) / 10;

  if (avg > 18) {
    return `Steep HR rise (avg ${avgRound} bpm/level) -- weak aerobic base, needs Zone 2 foundation work.`;
  }
  if (avg >= 10) {
    return `Moderate HR rise (avg ${avgRound} bpm/level) -- average aerobic efficiency, ready for mixed Zone 2/3.`;
  }
  return `Gradual HR rise (avg ${avgRound} bpm/level) -- good aerobic efficiency, ready for threshold training.`;
}

// ── RPE vs HR Calibration ──
function computeRPECalibration(finalHR: number, finalRPE: number, maxHR: number): string {
  const finalHRpct = (finalHR / maxHR) * 100;
  const expectedRPE = finalHRpct / 10;
  const delta = finalRPE - expectedRPE;
  const deltaRound = Math.round(delta * 10) / 10;

  if (delta > 2) {
    return `RPE higher than expected for HR (delta +${deltaRound}) -- poor effort economy, prioritize aerobic base.`;
  }
  if (delta < -2) {
    return `RPE lower than expected for HR (delta ${deltaRound}) -- good effort tolerance, can handle progressive overload.`;
  }
  return `RPE well calibrated to HR (delta ${deltaRound}) -- perceived effort matches physiological demand.`;
}

// ── Classification-Driven Training Parameters ──
interface TrainingParams {
  focus: string;
  primaryZone: string;
  intervalReady: boolean;
  weeklyFrequency: string;
  sessionLength: string;
  protocolApproach: string;
}

function getTrainingParams(classification: string): TrainingParams {
  switch (classification) {
    case 'Poor':
      return {
        focus: 'aerobic base building',
        primaryZone: 'Zone 2 (60-70% max HR)',
        intervalReady: false,
        weeklyFrequency: '3 sessions',
        sessionLength: '20-30 minutes building to 35',
        protocolApproach:
          'No intervals in first 6 weeks. Pure steady-state aerobic work to build mitochondrial density and cardiac output. Intervals only in weeks 7-8 if progress is made.',
      };
    case 'Below Average':
      return {
        focus: 'aerobic development',
        primaryZone: 'Zone 2-3 (65-75% max HR)',
        intervalReady: false,
        weeklyFrequency: '3-4 sessions',
        sessionLength: '25-35 minutes',
        protocolApproach:
          'Establish aerobic base in weeks 1-4. Introduce short intervals (30 sec work, 90 sec rest) in weeks 5-6. Progress to 1-minute intervals in weeks 7-8.',
      };
    case 'Average':
      return {
        focus: 'aerobic efficiency and threshold development',
        primaryZone: 'Zone 3 (70-80% max HR)',
        intervalReady: true,
        weeklyFrequency: '4 sessions',
        sessionLength: '30-40 minutes',
        protocolApproach:
          'Mix of steady-state Zone 2-3 and structured intervals. Introduce 2-minute work intervals at 80% max HR from week 3. Progress to 4-minute intervals by week 7.',
      };
    case 'Good':
      return {
        focus: 'threshold and VO2 max development',
        primaryZone: 'Zone 3-4 (75-85% max HR)',
        intervalReady: true,
        weeklyFrequency: '4-5 sessions',
        sessionLength: '35-45 minutes',
        protocolApproach:
          'Structured interval progression is the primary driver. Week 1-2: tempo runs at 80% max HR. Week 3-4: 4x4 minute intervals at 85-90% max HR. Week 5-6: 6x3 minute intervals. Week 7-8: race-pace or test-pace efforts. Include one long Zone 2 session per week throughout.',
      };
    case 'Excellent':
      return {
        focus: 'VO2 max optimization and performance',
        primaryZone: 'Zone 4-5 (85-95% max HR)',
        intervalReady: true,
        weeklyFrequency: '5 sessions',
        sessionLength: '40-55 minutes',
        protocolApproach:
          'High-intensity interval training is the primary stimulus. Norwegian 4x4 protocol (4 min at 90-95% max HR, 3 min active recovery) from week 1. Polarized training model -- 80% of sessions easy Zone 2, 20% very hard Zone 4-5. Include weekly long aerobic session (50+ min Zone 2).',
      };
    default:
      return getTrainingParams('Average');
  }
}

// ── Compute HR Training Zones ──
function computeHRZones(maxHR: number): string {
  const zones = [
    { name: 'Zone 1', label: 'Recovery', low: 0.50, high: 0.60 },
    { name: 'Zone 2', label: 'Aerobic Base', low: 0.60, high: 0.70 },
    { name: 'Zone 3', label: 'Aerobic Development', low: 0.70, high: 0.80 },
    { name: 'Zone 4', label: 'Threshold', low: 0.80, high: 0.90 },
    { name: 'Zone 5', label: 'VO2 Max', low: 0.90, high: 1.00 },
  ];
  return zones
    .map(z => `  ${z.name}: ${Math.round(z.low * 100)}-${Math.round(z.high * 100)}% max HR = ${Math.round(maxHR * z.low)}-${Math.round(maxHR * z.high)} bpm (${z.label})`)
    .join('\n');
}

export function buildReportPrompt(
  state: TestState,
  vo2Max: number,
  classification: ClassificationResult,
  stopReason: string,
): string {
  const vo2Target = Math.round(vo2Max * 1.09 * 10) / 10;

  const levelLines = state.data
    .map(d => {
      const ratio = Math.round((d.hr / d.vo2Estimate) * 100) / 100;
      return `  Level ${d.level}: HR ${d.hr} bpm, RPE ${d.rpe}, VO2 est ${d.vo2Estimate} ml/kg/min, HR:VO2 ratio ${ratio}`;
    })
    .join('\n');

  const hrValues = state.data.map(d => d.hr);
  const hrRange =
    hrValues.length > 1
      ? `${Math.min(...hrValues)}-${Math.max(...hrValues)} bpm (delta ${Math.max(...hrValues) - Math.min(...hrValues)})`
      : `${hrValues[0]} bpm`;

  const rpeProgression = state.data.map(d => d.rpe).join(' -> ');

  // Pre-computed analytics
  const hrTrend = computeHRTrend(state.data);
  const finalLevel = state.data[state.data.length - 1];
  const rpeCalibration = computeRPECalibration(finalLevel.hr, finalLevel.rpe, state.maxHR);
  const training = getTrainingParams(classification.name);
  const hrZones = computeHRZones(state.maxHR);

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

--- PRE-COMPUTED ANALYTICS ---

HR Efficiency Assessment: ${hrTrend}
RPE Calibration Assessment: ${rpeCalibration}

HR Training Zones (actual bpm for this patient):
${hrZones}

VO2 improvement target: ${vo2Target} ml/kg/min (9% improvement)

--- CLASSIFICATION-DRIVEN PROTOCOL REQUIREMENTS ---

This user's classification is: ${classification.name}
Training focus MUST be: ${training.focus}
Primary training zone: ${training.primaryZone}
Interval-ready: ${training.intervalReady ? 'Yes' : 'No -- do NOT prescribe intervals until specified in the approach below'}
Weekly frequency: ${training.weeklyFrequency}
Session length: ${training.sessionLength}
Protocol approach (YOU MUST FOLLOW THIS): ${training.protocolApproach}

--- INSTRUCTIONS ---

You are writing a strictly personalized 8-week protocol. You MUST use the pre-computed training focus, approach, and zones provided above. Do NOT default to generic walking or jogging advice if the classification indicates the user is ready for intervals. The protocol must be meaningfully different for a Poor classification vs a Good classification.

Given the HR efficiency assessment and RPE calibration above, incorporate those findings into your observations and adjust the protocol emphasis accordingly. For example, if RPE is higher than expected, emphasize aerobic base work even more; if HR rise is gradual, lean toward threshold work.

Write 4 specific 2-week training blocks (Weeks 1-2, 3-4, 5-6, 7-8) that progressively build on each other. Each block must specify:
- Exact exercise type (not just "cardio")
- Duration in minutes
- Intensity in BOTH % max HR AND actual bpm range AND RPE (CR10)
- Frequency (sessions per week)
- One sentence on the specific physiological adaptation being targeted in this block

Use the actual bpm training zone values provided above in every intensity specification. The protocol should feel like it was written by a personal trainer who knows this specific person's test results, not a template with numbers filled in.

Respond with this exact JSON structure:
{
  "score_meaning": "3-4 sentences about their specific VO2 max score, what it means physiologically, and how it compares to norms for their age/sex. Reference the HR efficiency and RPE calibration findings.",
  "observations": [
    "observation referencing actual HR numbers and the HR efficiency trend",
    "observation about RPE calibration and what it means for training",
    "observation about aerobic capacity relative to classification",
    "observation about anything clinically notable from the test data"
  ],
  "protocol": [
    {
      "weeks": "Weeks 1-2",
      "phase": "Foundation",
      "exercise": "specific activity -- e.g. brisk walking, cycling, swimming, tempo runs",
      "duration": "e.g. 25 minutes",
      "intensity": "use format: XX-YY% max HR (AAA-BBB bpm) / RPE N-N",
      "frequency": "Nx per week",
      "focus": "one sentence on the specific physiological adaptation goal"
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
    "closing": "motivating sentence specific to this patient that references their current classification and what they can achieve"
  }
}

Use actual HR values from the data in your observations. Use actual bpm zone values in every protocol intensity field.`;

  return toAscii(prompt);
}
