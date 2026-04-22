// ── Chester Step Test Types ──

export type HRCaptureMethod = 'manual' | 'wearable';

export interface LevelTiming {
  level: number;
  startTime: string;
  endTime: string;
  spm: number;
}

export interface HRReading {
  timestamp: string;
  value: number;
}

export interface TestState {
  name: string;
  age: number;
  sex: 'male' | 'female';
  betaBlocker: boolean;
  maxHR: number;
  stopHR: number;
  restingHR: number | null;
  currentLevel: number;
  data: LevelResult[];
  devMode: boolean;
  hrCaptureMethod: HRCaptureMethod;
  wearableConnected: boolean;
  testStartTime: string | null;
  levelTimings: LevelTiming[];
  overallRpe: number | null;
}

export interface LevelResult {
  level: number;
  hr: number;
  rpe: number;
  vo2Estimate: number;
  hrSource?: HRCaptureMethod;
}

export interface LevelProtocol {
  n: number;
  spm: number;
  bpm: number;
  vo2: number;
}

export interface ClassificationResult {
  name: 'Poor' | 'Below Average' | 'Average' | 'Good' | 'Excellent';
  color: string;
  bgColor: string;
}

export interface AIReport {
  score_meaning: string;
  observations: string[];
  protocol: ProtocolWeek[];
  next_target: NextTarget;
}

export interface ProtocolWeek {
  weeks: string;
  phase: string;
  exercise: string;
  duration: string;
  intensity: string;
  frequency: string;
  focus: string;
}

export interface NextTarget {
  vo2_target: number;
  timeframe: string;
  classification: string;
  improvement_needed: number;
  closing: string;
}

export interface RpeEntry {
  value: number;
  label: string;
  description: string;
}

export type Screen =
  | 'landing'
  | 'howItWorks'
  | 'setup'
  | 'instructions'
  | 'checklist'
  | 'restingHR'
  | 'preLevel'
  | 'activeLevel'
  | 'postTestRPE'
  | 'syncing'
  | 'syncFallback'
  | 'manualHREntry'
  | 'results'
  | 'setPassword';
