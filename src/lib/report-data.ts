import type { ReportData } from '../types/report';
import { getTemplatesForTier } from './report-templates';

const templates = getTemplatesForTier('advanced');

export const HARDCODED_REPORT: ReportData = {
  userId: 'demo-user-001',
  reportToken: 'demo',

  vo2Max: 47.3,
  classification: 'Excellent',
  percentile: 88,
  fitnessAge: 28,

  actualAge: 41,
  biologicalSex: 'male',
  weightLb: 185,
  weightKg: 84,
  ageBand: '40-44',
  ageBandLabel: 'men age 40-44',

  hrLevel1: 102,
  hrLevel2: 118,
  hrLevel3: 134,
  hrLevel4: 152,
  hrMaxEstimated: 179,
  rpeLevel1: 2,
  rpeLevel2: 4,
  rpeLevel3: 5,
  rpeLevel4: 7,

  zone1Low: 107,
  zone1High: 125,
  zone2Low: 125,
  zone2High: 143,
  zone3Low: 143,
  zone3High: 161,
  zone4Low: 161,
  zone4High: 170,
  zone5Low: 170,
  zone5High: 179,

  averageForAgeBand: 32.5,
  deltaFromAverage: 14.8,

  estimatedTdeeLow: 2400,
  estimatedTdeeHigh: 2800,
  proteinLowG: 134,
  proteinHighG: 168,

  protocolTier: 'advanced',

  testDate: 'April 28, 2026',
  retestDate: 'July 23, 2026',

  ...templates,

  goals: null,
  sport: null,
  freeTextGoal: null,
  whatThisPlanBecomesV2: null,
};
