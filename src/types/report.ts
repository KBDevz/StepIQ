export interface ReportData {
  userId: string;
  reportToken: string;

  vo2Max: number;
  classification: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Foundation Building';
  percentile: number;
  fitnessAge: number;

  actualAge: number;
  biologicalSex: 'male' | 'female';
  weightLb: number;
  weightKg: number;
  ageBand: string;
  ageBandLabel: string;

  hrLevel1: number;
  hrLevel2: number;
  hrLevel3: number;
  hrLevel4: number;
  hrMaxEstimated: number;
  rpeLevel1: number;
  rpeLevel2: number;
  rpeLevel3: number;
  rpeLevel4: number;

  zone1Low: number;
  zone1High: number;
  zone2Low: number;
  zone2High: number;
  zone3Low: number;
  zone3High: number;
  zone4Low: number;
  zone4High: number;
  zone5Low: number;
  zone5High: number;

  averageForAgeBand: number;
  deltaFromAverage: number;

  estimatedTdeeLow: number;
  estimatedTdeeHigh: number;
  proteinLowG: number;
  proteinHighG: number;

  protocolTier: 'beginner' | 'intermediate' | 'advanced';

  testDate: string;
  retestDate: string;

  tierParagraph: string;
  callout: string;
  whyParagraph: string;
  howToRead: string;
  translatingToSport: string;
  zoneTwoCommentary: string;

  goals: string[] | null;
  sport: string | null;
  freeTextGoal: string | null;
  whatThisPlanBecomesV2: string | null;
}
