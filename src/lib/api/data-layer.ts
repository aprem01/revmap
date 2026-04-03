/**
 * Unified data layer — uses Supabase when connected, falls back to mock data.
 * Every page should import from here instead of mock-data directly.
 */
import { supabase, isDemo } from '@/lib/utils/supabase';
import {
  mockAccounts,
  mockReps,
  mockAccountScores,
  mockRecommendations,
  mockOpportunities,
  mockICPModel,
  mockRepAccountFit,
  getAccountById as mockGetAccount,
  getRepById as mockGetRep,
  getScoreForAccount as mockGetScore,
} from '@/lib/mock-data';
import { mockPipelineAccounts } from '@/lib/mock-pipeline';
import { mockTerritoryVersions } from '@/lib/mock-territory-versions';
import type {
  Account,
  Rep,
  AccountScore,
  Recommendation,
  Opportunity,
  ICPModel,
  RepAccountFit,
  RecommendationStatus,
} from '@/types';

// ─── Accounts ────────────────────────────────────────────────────────
export async function fetchAccounts(orgId?: string): Promise<Account[]> {
  if (isDemo) return mockAccounts;
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('org_id', orgId!)
    .order('name');
  if (error) throw error;
  return data as Account[];
}

export async function fetchAccountById(id: string): Promise<Account | null> {
  if (isDemo) return mockGetAccount(id) ?? null;
  const { data, error } = await supabase.from('accounts').select('*').eq('id', id).single();
  if (error) return null;
  return data as Account;
}

// ─── Reps ────────────────────────────────────────────────────────────
export async function fetchReps(orgId?: string): Promise<Rep[]> {
  if (isDemo) return mockReps;
  const { data, error } = await supabase
    .from('reps')
    .select('*')
    .eq('org_id', orgId!)
    .order('name');
  if (error) throw error;
  return data as Rep[];
}

export async function fetchRepById(id: string): Promise<Rep | null> {
  if (isDemo) return mockGetRep(id) ?? null;
  const { data, error } = await supabase.from('reps').select('*').eq('id', id).single();
  if (error) return null;
  return data as Rep;
}

// ─── Account Scores ──────────────────────────────────────────────────
export async function fetchAccountScores(orgId?: string): Promise<AccountScore[]> {
  if (isDemo) return mockAccountScores;
  const { data, error } = await supabase
    .from('account_scores')
    .select('*')
    .eq('org_id', orgId!)
    .order('total_score', { ascending: false });
  if (error) throw error;
  return data as AccountScore[];
}

export async function fetchScoreForAccount(accountId: string): Promise<AccountScore | null> {
  if (isDemo) return mockGetScore(accountId) ?? null;
  const { data, error } = await supabase
    .from('account_scores')
    .select('*')
    .eq('account_id', accountId)
    .order('scored_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data as AccountScore | null;
}

// ─── Recommendations ─────────────────────────────────────────────────
export async function fetchRecommendations(orgId?: string, status?: RecommendationStatus): Promise<Recommendation[]> {
  if (isDemo) {
    if (status) return mockRecommendations.filter(r => r.status === status);
    return mockRecommendations;
  }
  let query = supabase
    .from('recommendations')
    .select('*')
    .eq('org_id', orgId!)
    .order('confidence_score', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data as Recommendation[];
}

export async function updateRecommendationStatus(
  id: string,
  status: RecommendationStatus,
  actedBy?: string,
  reason?: string
): Promise<void> {
  if (isDemo) return; // mock mode handles in-component state
  const update: Record<string, unknown> = {
    status,
    acted_at: new Date().toISOString(),
  };
  if (actedBy) update.acted_by = actedBy;
  if (reason) update.dismissed_reason = reason;
  const { error } = await supabase.from('recommendations').update(update).eq('id', id);
  if (error) throw error;
}

// ─── Opportunities ───────────────────────────────────────────────────
export async function fetchOpportunities(orgId?: string): Promise<Opportunity[]> {
  if (isDemo) return mockOpportunities;
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('org_id', orgId!)
    .order('close_date', { ascending: false });
  if (error) throw error;
  return data as Opportunity[];
}

export async function fetchOpportunitiesForAccount(accountId: string): Promise<Opportunity[]> {
  if (isDemo) return mockOpportunities.filter(o => o.account_id === accountId);
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('account_id', accountId)
    .order('close_date', { ascending: false });
  if (error) throw error;
  return data as Opportunity[];
}

export async function fetchOpportunitiesForRep(repId: string): Promise<Opportunity[]> {
  if (isDemo) return mockOpportunities.filter(o => o.rep_id === repId);
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('rep_id', repId)
    .order('close_date', { ascending: false });
  if (error) throw error;
  return data as Opportunity[];
}

// ─── ICP Model ───────────────────────────────────────────────────────
export async function fetchICPModel(orgId?: string): Promise<ICPModel | null> {
  if (isDemo) return mockICPModel;
  const { data, error } = await supabase
    .from('icp_models')
    .select('*')
    .eq('org_id', orgId!)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data as ICPModel | null;
}

// ─── Rep Account Fit ─────────────────────────────────────────────────
export async function fetchRepAccountFit(accountId: string): Promise<RepAccountFit[]> {
  if (isDemo) return mockRepAccountFit.filter(f => f.account_id === accountId);
  const { data, error } = await supabase
    .from('rep_account_fit')
    .select('*')
    .eq('account_id', accountId)
    .order('fit_score', { ascending: false });
  if (error) throw error;
  return data as RepAccountFit[];
}

// ─── Pipeline (mock-only for now) ────────────────────────────────────
export function fetchPipelineAccounts() {
  return mockPipelineAccounts;
}

// ─── Territory Versions (mock-only for now) ──────────────────────────
export function fetchTerritoryVersions() {
  return mockTerritoryVersions;
}

// ─── Signals ─────────────────────────────────────────────────────────
export async function fetchSignalsForAccount(accountId: string, orgId?: string) {
  if (isDemo) return [];
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('account_id', accountId)
    .eq('org_id', orgId!)
    .order('detected_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}

// ─── Analytics helpers ───────────────────────────────────────────────
export async function fetchAnalytics(orgId?: string) {
  const [accounts, reps, scores, recommendations, opportunities] = await Promise.all([
    fetchAccounts(orgId),
    fetchReps(orgId),
    fetchAccountScores(orgId),
    fetchRecommendations(orgId),
    fetchOpportunities(orgId),
  ]);

  const approved = recommendations.filter(r => r.status === 'approved');
  const dismissed = recommendations.filter(r => r.status === 'dismissed');
  const pending = recommendations.filter(r => r.status === 'pending');
  const acceptanceRate = approved.length + dismissed.length > 0
    ? Math.round((approved.length / (approved.length + dismissed.length)) * 100)
    : 0;

  const wonOpps = opportunities.filter(o => o.status === 'won');
  const lostOpps = opportunities.filter(o => o.status === 'lost');
  const overallWinRate = wonOpps.length + lostOpps.length > 0
    ? Math.round((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100)
    : 0;

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((s, a) => s + a.total_score, 0) / scores.length)
    : 0;

  const staleAccounts = accounts.filter(a => {
    if (!a.last_activity_at) return true;
    return Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000) > 60;
  });

  const unassigned = accounts.filter(a => !a.owner_rep_id);

  return {
    accounts,
    reps,
    scores,
    recommendations,
    opportunities,
    approved,
    dismissed,
    pending,
    acceptanceRate,
    wonOpps,
    lostOpps,
    overallWinRate,
    avgScore,
    staleAccounts,
    unassigned,
  };
}
