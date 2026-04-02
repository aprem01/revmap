import { supabase } from '@/lib/utils/supabase';
import type { Recommendation, RecommendationStatus } from '@/types';

export async function fetchRecommendations(
  orgId: string,
  status?: RecommendationStatus
): Promise<Recommendation[]> {
  let query = supabase
    .from('recommendations')
    .select('*')
    .eq('org_id', orgId)
    .order('confidence_score', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Recommendation[];
}

export async function approveRecommendation(
  recommendationId: string,
  actedBy: string
): Promise<void> {
  const { error } = await supabase
    .from('recommendations')
    .update({
      status: 'approved',
      acted_by: actedBy,
      acted_at: new Date().toISOString(),
    })
    .eq('id', recommendationId);

  if (error) throw error;
}

export async function dismissRecommendation(
  recommendationId: string,
  actedBy: string,
  reason?: string
): Promise<void> {
  const { error } = await supabase
    .from('recommendations')
    .update({
      status: 'dismissed',
      acted_by: actedBy,
      acted_at: new Date().toISOString(),
      dismissed_reason: reason ?? null,
    })
    .eq('id', recommendationId);

  if (error) throw error;
}

export async function snoozeRecommendation(
  recommendationId: string,
  actedBy: string
): Promise<void> {
  const { error } = await supabase
    .from('recommendations')
    .update({
      status: 'snoozed',
      acted_by: actedBy,
      acted_at: new Date().toISOString(),
    })
    .eq('id', recommendationId);

  if (error) throw error;
}
