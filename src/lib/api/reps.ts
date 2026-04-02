import { supabase } from '@/lib/utils/supabase';
import type { Rep, RepAccountFit } from '@/types';

export async function fetchReps(orgId: string): Promise<Rep[]> {
  const { data, error } = await supabase
    .from('reps')
    .select('*')
    .eq('org_id', orgId)
    .order('name');

  if (error) throw error;
  return data as Rep[];
}

export async function fetchRepFitScores(
  orgId: string,
  accountId: string
): Promise<RepAccountFit[]> {
  const { data, error } = await supabase
    .from('rep_account_fit')
    .select('*')
    .eq('org_id', orgId)
    .eq('account_id', accountId)
    .order('fit_score', { ascending: false });

  if (error) throw error;
  return data as RepAccountFit[];
}
