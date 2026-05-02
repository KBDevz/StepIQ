import type { ReportData } from '../types/report';

type Tier = ReportData['protocolTier'];

interface TierTemplate {
  tierParagraph: string;
  callout: string;
  whyParagraph: string;
  howToRead: string;
  translatingToSport: string;
  zoneTwoCommentary: string;
}

const TEMPLATES: Record<Tier, TierTemplate> = {
  beginner: {
    tierParagraph:
      'Your score places you in the foundation-building tier. This isn\'t a limitation — it\'s a starting line with the steepest improvement curve. Research shows that individuals in this range typically see the largest VO₂ gains (5-8 ml/kg/min) in their first 8-12 weeks of structured training. Your body is primed to respond.',
    callout:
      'The biggest gains happen at the beginning. Your first 8 weeks will deliver more measurable improvement than any other period in your training lifetime.',
    whyParagraph:
      'VO₂ max measures the maximum volume of oxygen your body can use during intense exercise — milliliters of oxygen per kilogram of body weight per minute. It\'s the single strongest predictor of cardiovascular longevity. A 2018 JAMA study of 122,007 patients found that extremely high cardiorespiratory fitness was associated with the greatest survival benefit, with no upper limit.',
    howToRead:
      'The bell curve below shows where your score falls relative to others in your age and sex group. The highlighted zone is your current position. The dashed line marks the population average.',
    translatingToSport:
      'At your current level, the goal is building aerobic base. You\'ll notice improved recovery between daily activities, easier stair climbing, and the ability to sustain moderate effort (brisk walking, easy cycling) for longer periods. These are the first signs your cardiovascular system is adapting.',
    zoneTwoCommentary:
      'Zone 2 is where the magic happens for foundation builders. This low-intensity zone stimulates mitochondrial biogenesis — your cells literally build more powerplants. Aim for 3-4 sessions per week of 30-45 minutes where you can maintain a conversation. It should feel easy. If you\'re breathing hard, slow down.',
  },
  intermediate: {
    tierParagraph:
      'Your score places you in the intermediate tier — above the population median and demonstrating solid cardiovascular fitness. You\'ve built a meaningful aerobic base. The protocol below is designed to push you into the next classification bracket by introducing structured intensity alongside continued base building.',
    callout:
      'You\'re already ahead of most people your age. The next bracket is within reach — targeted Zone 3-4 work is what separates "fit" from "very fit."',
    whyParagraph:
      'VO₂ max measures the maximum volume of oxygen your body can use during intense exercise — milliliters of oxygen per kilogram of body weight per minute. It\'s the single strongest predictor of cardiovascular longevity. A 2018 JAMA study of 122,007 patients found that extremely high cardiorespiratory fitness was associated with the greatest survival benefit, with no upper limit.',
    howToRead:
      'The bell curve below shows where your score falls relative to others in your age and sex group. The highlighted zone is your current position. The dashed line marks the population average.',
    translatingToSport:
      'At your level, you can sustain moderate-to-vigorous exercise for extended periods. You\'ll perform well in recreational sports, long hikes, and cycling. To move to the next tier, you need to challenge your body with intervals — short bursts at higher intensities that expand your oxygen ceiling.',
    zoneTwoCommentary:
      'Zone 2 remains your primary training zone — 70-80% of your weekly volume should stay here. But now we add targeted Zone 3-4 intervals 1-2x per week. Think of Zone 2 as the highway and intervals as the on-ramps to higher fitness. Both are essential; neither works alone.',
  },
  advanced: {
    tierParagraph:
      'Your score places you in the advanced tier — significantly above the population median and in the upper echelon of cardiovascular fitness for your demographic. Improvement at this level requires precision. The protocol below uses polarized training principles: high volume at low intensity with targeted high-intensity intervals.',
    callout:
      'Gains at the top are harder-earned. Every point of VO₂ improvement at your level is worth more — and requires more deliberate training.',
    whyParagraph:
      'VO₂ max measures the maximum volume of oxygen your body can use during intense exercise — milliliters of oxygen per kilogram of body weight per minute. It\'s the single strongest predictor of cardiovascular longevity. A 2018 JAMA study of 122,007 patients found that extremely high cardiorespiratory fitness was associated with the greatest survival benefit, with no upper limit.',
    howToRead:
      'The bell curve below shows where your score falls relative to others in your age and sex group. The highlighted zone is your current position. The dashed line marks the population average.',
    translatingToSport:
      'At your level, you\'re performing in the upper percentiles. Sport-specific gains come from pushing lactate threshold higher and improving economy. You\'ll notice the ability to sustain higher paces, recover faster between efforts, and maintain performance deeper into endurance events.',
    zoneTwoCommentary:
      'At the advanced level, 80% of your training volume stays in Zone 2 (polarized model). This feels counterintuitively easy — that\'s the point. Your 1-2 weekly high-intensity sessions (Zone 4-5 intervals) drive adaptation, while Zone 2 builds the aerobic machinery that supports it. Resist the temptation to train in the "gray zone" (Zone 3) too often.',
  },
};

export function getTemplatesForTier(tier: Tier): TierTemplate {
  return TEMPLATES[tier];
}
