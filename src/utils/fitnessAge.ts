import friendNorms from '../data/friend-norms.json';

type Sex = 'male' | 'female';

interface NormBand {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

const AGE_BANDS = [
  { band: '20-29', midAge: 25 },
  { band: '30-39', midAge: 35 },
  { band: '40-49', midAge: 45 },
  { band: '50-59', midAge: 55 },
  { band: '60-69', midAge: 65 },
  { band: '70-79', midAge: 75 },
] as const;

function getNorms(sex: Sex): Record<string, NormBand> {
  return friendNorms[sex] as Record<string, NormBand>;
}

function getAgeBand(age: number): string {
  if (age < 20) return '20-29';
  if (age < 30) return '20-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  if (age < 70) return '60-69';
  return '70-79';
}

export function isEdgeAge(age: number): boolean {
  return age < 20 || age > 79;
}

export function calculateFitnessAge(vo2Score: number, sex: Sex): number {
  const norms = getNorms(sex);

  for (let i = 0; i < AGE_BANDS.length; i++) {
    const p50 = norms[AGE_BANDS[i].band].p50;
    if (vo2Score >= p50) {
      if (i === 0) return 25;
      const prevP50 = norms[AGE_BANDS[i - 1].band].p50;
      const ratio = (vo2Score - p50) / (prevP50 - p50);
      const age = AGE_BANDS[i].midAge - (AGE_BANDS[i].midAge - AGE_BANDS[i - 1].midAge) * ratio;
      return Math.round(age);
    }
  }

  return 75;
}

export function calculatePercentile(vo2Score: number, age: number, sex: Sex): number {
  const ageBand = getAgeBand(age);
  const norms = getNorms(sex)[ageBand];

  const points = [
    { score: norms.p10, percentile: 10 },
    { score: norms.p25, percentile: 25 },
    { score: norms.p50, percentile: 50 },
    { score: norms.p75, percentile: 75 },
    { score: norms.p90, percentile: 90 },
  ];

  if (vo2Score <= points[0].score) {
    const ratio = Math.max(0, vo2Score / points[0].score);
    return Math.max(1, Math.round(ratio * 10));
  }

  if (vo2Score >= points[points.length - 1].score) {
    const overshoot = (vo2Score - points[4].score) / (points[4].score - points[3].score);
    return Math.min(99, Math.round(90 + overshoot * 9));
  }

  for (let i = 1; i < points.length; i++) {
    if (vo2Score <= points[i].score) {
      const prev = points[i - 1];
      const curr = points[i];
      const ratio = (vo2Score - prev.score) / (curr.score - prev.score);
      return Math.round(prev.percentile + ratio * (curr.percentile - prev.percentile));
    }
  }

  return 50;
}

export function calculate8WeekTarget(score: number): number {
  let target: number;
  if (score < 30) target = score + 6;
  else if (score < 50) target = score + 4.7;
  else if (score < 60) target = score + 3;
  else target = score + 2;
  return Math.round(target * 10) / 10;
}

export function getAgeBandLabel(age: number): string {
  if (age < 20) return '20-29';
  if (age < 30) return '20-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  if (age < 70) return '60-69';
  return '70-79';
}
