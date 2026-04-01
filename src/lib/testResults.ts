import { supabase } from './supabase';
import type { TestState, ClassificationResult } from '../types';

export async function saveTestResult(
  userId: string,
  state: TestState,
  vo2Max: number,
  classification: ClassificationResult,
  stopReason: string,
): Promise<{ id: string | null; error: string | null }> {
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
      levels_completed: state.data.length,
      level_data: state.data,
      vo2_max: Math.round(vo2Max * 10) / 10,
      classification: classification.name,
      stop_reason: stopReason,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to save test result:', error);
    return { id: null, error: error.message };
  }

  return { id: data.id, error: null };
}
