import { supabase } from './supabase';
import type { TestState, ClassificationResult } from '../types';
import { linReg, calcR2, detectAerobicThreshold, calcHREfficiency } from '../utils/scoring';

export async function saveTestResult(
  userId: string,
  state: TestState,
  vo2Max: number,
  classification: ClassificationResult,
  stopReason: string,
): Promise<{ id: string | null; error: string | null }> {
  const levels = state.data;
  let zoneMethod: 'data-derived' | 'karvonen' = 'karvonen';
  let regressionR2: number | null = null;
  let regressionSlope: number | null = null;

  if (levels.length >= 3) {
    const pts = levels.map(d => ({ x: d.hr, y: d.vo2Estimate }));
    const reg = linReg(pts);
    const r2 = calcR2(pts);
    regressionR2 = Math.round(r2 * 1000) / 1000;
    regressionSlope = reg ? Math.round(reg.slope * 1000000) / 1000000 : null;
    if (reg && reg.slope > 0 && r2 >= 0.85) {
      zoneMethod = 'data-derived';
    }
  }

  const aerobicThreshold = detectAerobicThreshold(levels);
  const hrEfficiency = calcHREfficiency(levels);

  const { data, error } = await supabase
    .from('test_results')
    .insert({
      user_id: userId,
      age: state.age,
      sex: state.sex,
      beta_blocker: state.betaBlocker,
      max_hr: state.maxHR,
      stop_hr: state.stopHR,
      resting_hr: state.restingHR,
      levels_completed: levels.length,
      level_data: levels,
      vo2_max: Math.round(vo2Max * 10) / 10,
      classification: classification.name,
      stop_reason: stopReason,
      tested_at_hour: state.testedAtHour,
      tested_at_time_of_day: state.testedAtTimeOfDay,
      zone_method: zoneMethod,
      aerobic_threshold: aerobicThreshold,
      hr_efficiency: hrEfficiency ? Math.round(hrEfficiency * 10000) / 10000 : null,
      regression_r2: regressionR2,
      regression_slope: regressionSlope,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to save test result:', error);
    return { id: null, error: error.message };
  }

  return { id: data.id, error: null };
}
