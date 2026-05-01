import type { AIReport } from '../types';
import { extractJSON } from '../utils/reportPrompt';
import { supabase } from './supabase';

interface GenerateReportResponse {
  text?: string;
  error?: string;
}

export async function generateAIReport(prompt: string): Promise<AIReport> {
  const { data, error } = await supabase.functions.invoke<GenerateReportResponse>('generate-report', {
    body: { prompt },
  });

  if (error) {
    throw new Error(error.message || 'Failed to generate report');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.text) {
    throw new Error('Report response was empty');
  }

  return JSON.parse(extractJSON(data.text)) as AIReport;
}
