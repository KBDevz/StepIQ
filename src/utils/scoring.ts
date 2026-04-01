import type { LevelResult, ClassificationResult } from '../types';

interface DataPoint {
  x: number;
  y: number;
}

interface RegressionResult {
  slope: number;
  intercept: number;
}

export function linReg(pts: DataPoint[]): RegressionResult | null {
  const n = pts.length;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0;
  pts.forEach(p => { sx += p.x; sy += p.y; sxy += p.x * p.y; sx2 += p.x * p.x; });
  const d = n * sx2 - sx * sx;
  if (!d) return null;
  const slope = (n * sxy - sx * sy) / d;
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

export function calcVO2Max(data: LevelResult[], maxHR: number): number {
  if (data.length === 0) return 0;
  if (data.length === 1) {
    return Math.max(8, data[0].vo2Estimate * (maxHR / data[0].hr));
  }
  const pts = data.map(d => ({ x: d.hr, y: d.vo2Estimate }));
  const reg = linReg(pts);
  if (!reg) return 0;
  return Math.max(8, reg.slope * maxHR + reg.intercept);
}

// K. Sykes CST norms
const MALE_THRESHOLDS: Record<string, number[]> = {
  '15-19': [30, 39, 48, 60],
  '20-29': [28, 35, 44, 55],
  '30-39': [26, 34, 40, 50],
  '40-49': [25, 32, 37, 46],
  '50-59': [23, 29, 35, 44],
  '60-65': [20, 25, 33, 40],
};

const FEMALE_THRESHOLDS: Record<string, number[]> = {
  '15-19': [29, 36, 44, 55],
  '20-29': [27, 32, 40, 50],
  '30-39': [25, 30, 36, 46],
  '40-49': [22, 28, 34, 43],
  '50-59': [21, 26, 33, 41],
  '60-65': [19, 24, 31, 39],
};

function getAgeGroup(age: number): string {
  if (age < 20) return '15-19';
  if (age < 30) return '20-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  return '60-65';
}

const CLASSIFICATION_NAMES = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'] as const;
const CLASSIFICATION_COLORS: Record<string, { color: string; bgColor: string }> = {
  'Poor':          { color: '#FF4444', bgColor: 'rgba(255,68,68,0.15)' },
  'Below Average': { color: '#FF8C42', bgColor: 'rgba(255,140,66,0.15)' },
  'Average':       { color: '#FFD166', bgColor: 'rgba(255,209,102,0.15)' },
  'Good':          { color: '#06D6A0', bgColor: 'rgba(6,214,160,0.15)' },
  'Excellent':     { color: '#00E5A0', bgColor: 'rgba(0,229,160,0.15)' },
};

export function classify(vo2: number, age: number, sex: 'male' | 'female'): ClassificationResult {
  const thresholds = sex === 'male' ? MALE_THRESHOLDS : FEMALE_THRESHOLDS;
  const group = getAgeGroup(age);
  const cuts = thresholds[group];

  let idx = 0;
  if (vo2 >= cuts[3]) idx = 4;
  else if (vo2 >= cuts[2]) idx = 3;
  else if (vo2 >= cuts[1]) idx = 2;
  else if (vo2 >= cuts[0]) idx = 1;

  const name = CLASSIFICATION_NAMES[idx];
  return { name, ...CLASSIFICATION_COLORS[name] };
}
