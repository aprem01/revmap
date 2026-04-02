import { supabase } from '@/lib/utils/supabase';
import type { Account, AccountScore } from '@/types';

export async function fetchAccounts(orgId: string): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('org_id', orgId)
    .order('name');

  if (error) throw error;
  return data as Account[];
}

export async function fetchAccountWithScore(
  accountId: string
): Promise<{ account: Account; score: AccountScore | null }> {
  const [accountRes, scoreRes] = await Promise.all([
    supabase.from('accounts').select('*').eq('id', accountId).single(),
    supabase
      .from('account_scores')
      .select('*')
      .eq('account_id', accountId)
      .order('scored_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (accountRes.error) throw accountRes.error;

  return {
    account: accountRes.data as Account,
    score: (scoreRes.data as AccountScore) ?? null,
  };
}

export async function fetchTopScoredAccounts(
  orgId: string,
  limit = 20
): Promise<AccountScore[]> {
  const { data, error } = await supabase
    .from('account_scores')
    .select('*')
    .eq('org_id', orgId)
    .order('total_score', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AccountScore[];
}
