import type { LevelProtocol, RpeEntry } from '../types';

export const LEVELS: LevelProtocol[] = [
  { n: 1, spm: 15, bpm: 60,  vo2: 17.3 },
  { n: 2, spm: 20, bpm: 80,  vo2: 21.9 },
  { n: 3, spm: 25, bpm: 100, vo2: 26.5 },
  { n: 4, spm: 30, bpm: 120, vo2: 31.1 },
  { n: 5, spm: 35, bpm: 140, vo2: 35.6 },
];

export const LEVEL_DURATION = 120; // seconds
export const DEV_LEVEL_DURATION = 10;
export const PRE_COUNTDOWN = 10; // seconds for level 1
export const DEV_PRE_COUNTDOWN = 3;
export const INLINE_COUNTDOWN = 3; // seconds for levels 2-5

export const RPE_SCALE: RpeEntry[] = [
  { value: 1,  label: 'Rest',              description: 'No effort at all' },
  { value: 2,  label: 'Really Easy',       description: 'Very light, barely noticeable' },
  { value: 3,  label: 'Easy',              description: 'Comfortable, light activity' },
  { value: 4,  label: 'Moderate',          description: 'Steady effort, easy to talk' },
  { value: 5,  label: 'Challenging',       description: 'Noticeable effort, still talkative' },
  { value: 6,  label: 'Hard',              description: 'Breathing harder, focused effort' },
  { value: 7,  label: 'Hard (stop zone)',  description: 'Difficult to hold conversation' },
  { value: 8,  label: 'Really Hard',       description: 'Very strained, breathing heavily' },
  { value: 9,  label: 'Really Really Hard', description: 'Near maximum, few words possible' },
  { value: 10, label: 'Maximal',           description: 'Absolute max — cannot continue' },
];

export function getLevelProtocol(level: number): LevelProtocol {
  return LEVELS[level - 1];
}
