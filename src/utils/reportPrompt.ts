import type { TestState, ClassificationResult } from '../types';
import { linReg, calcR2, detectAerobicThreshold, calcHREfficiency, calculateHRZones } from './scoring';

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

// ── Format HR Training Zones for prompt ──
function formatHRZones(maxHR: number, restingHR: number | null, vo2Max: number, betaBlocker: boolean, data: { level: number; hr: number; rpe: number; vo2Estimate: number }[]): string {
  const zones = calculateHRZones(maxHR, vo2Max, restingHR, betaBlocker, data);
  const zoneList = [
    { name: 'Zone 1', label: 'Recovery', z: zones.zone1 },
    { name: 'Zone 2', label: 'Fat Burning', z: zones.zone2 },
    { name: 'Zone 3', label: 'Aerobic', z: zones.zone3 },
    { name: 'Zone 4', label: 'Threshold', z: zones.zone4 },
    { name: 'Zone 5', label: 'Maximum', z: zones.zone5 },
  ];

  const lines = zoneList.map(z => `  ${z.name}: ${z.z.min}-${z.z.max} bpm (${z.label})`).join('\n');
  return lines + `\n  Fat Burning Zone: ${zones.fatBurnMin}-${zones.fatBurnMax} bpm (Zone 2)` +
    `\n  Method: ${zones.method === 'data-derived' ? 'Data-derived from regression (individual HR-VO2 response)' : 'Karvonen heart rate reserve (resting HR: ' + (restingHR || 60) + ' bpm)'}` +
    (betaBlocker ? '\n  Note: Zones adjusted -12 bpm for beta blocker medication' : '');
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
  const hrZones = formatHRZones(state.maxHR, state.restingHR, vo2Max, state.betaBlocker, state.data);

  // New data-derived metrics
  const pts = state.data.map(d => ({ x: d.hr, y: d.vo2Estimate }));
  const reg = state.data.length >= 2 ? linReg(pts) : null;
  const r2 = state.data.length >= 2 ? calcR2(pts) : 0;
  const aerobicThresh = detectAerobicThreshold(state.data);
  const hrEff = calcHREfficiency(state.data);
  const zoneMethod = state.data.length >= 3 && reg && reg.slope > 0 && r2 >= 0.85 ? 'data-derived' : 'karvonen';

  const hrJumps: number[] = [];
  for (let i = 1; i < state.data.length; i++) {
    hrJumps.push(state.data[i].hr - state.data[i - 1].hr);
  }

  const prompt = `You are a clinical exercise physiologist analyzing a Chester Step Test result.
Return ONLY raw JSON (no markdown, no code fences, no extra text).

Patient:
  Name: ${state.name || 'Not provided'}
  Age: ${state.age}
  Sex: ${state.sex}
  Resting HR: ${state.restingHR ?? 'Not recorded'}
  Predicted Max HR: ${state.maxHR} bpm
  Beta blocker: ${state.betaBlocker ? 'Yes (Londeree formula)' : 'No (standard 220-age)'}
  Test time: ${state.testedAtHour !== null ? `${state.testedAtHour}:00 (${state.testedAtTimeOfDay})` : 'Not recorded'}

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

HR Efficiency Score: ${hrEff !== null ? hrEff.toFixed(4) + ' ml/kg/min per bpm' : 'N/A'}
Zone Calculation Method: ${zoneMethod}${zoneMethod === 'data-derived' ? ` (R2=${r2.toFixed(3)}, slope=${reg?.slope.toFixed(4)})` : ''}
Aerobic Threshold Estimate: ${aerobicThresh ? '~' + aerobicThresh + ' bpm' : 'not detected'}
Regression slope: ${reg ? reg.slope.toFixed(4) + ' (steeper = less cardiovascular efficiency)' : 'N/A'}
HR response pattern: ${hrJumps.length > 0 ? 'jumps of ' + hrJumps.join(', ') + ' bpm between levels' : 'N/A'}

HR Efficiency Assessment: ${hrTrend}
RPE Calibration Assessment: ${rpeCalibration}

HR Training Zones (Karvonen method, personalized from test data):
${hrZones}

IMPORTANT: Use these EXACT bpm numbers in all protocol intensity specifications. Never use generic percentages alone. Format intensity as: "Zone N - [min]-[max] bpm - RPE X-Y"

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

export function repairTruncatedJSON(json: string): string {
  let s = json.trim();
  // Remove trailing partial key-value or comma
  s = s.replace(/,\s*"[^"]*$/, '');
  s = s.replace(/,\s*$/, '');
  // Close unclosed strings
  const quotes = (s.match(/(?<!\\)"/g) || []).length;
  if (quotes % 2 !== 0) s += '"';
  // Balance brackets and braces
  const opens = { '{': 0, '[': 0 };
  const close: Record<string, '{' | '['> = { '}': '{', ']': '[' };
  let inString = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' && (i === 0 || s[i - 1] !== '\\')) { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{' || c === '[') opens[c]++;
    if (c === '}' || c === ']') opens[close[c]]--;
  }
  for (let i = 0; i < opens['[']; i++) s += ']';
  for (let i = 0; i < opens['{']; i++) s += '}';
  return s;
}
