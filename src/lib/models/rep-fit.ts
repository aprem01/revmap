import type { Account, Rep, Opportunity, FitFactors } from '@/types';

/**
 * Computes fit score for a rep-account pair.
 * Returns 0-100 fit score with component factors.
 */
export function computeRepAccountFit(params: {
  rep: Rep;
  account: Account;
  repOpportunities: Opportunity[];
}): { fitScore: number; factors: FitFactors } {
  const { rep, account, repOpportunities } = params;

  const factors: FitFactors = {
    segment_match: scoreSegmentMatch(rep, account),
    vertical_match: scoreVerticalMatch(rep, account),
    win_rate_relevance: scoreWinRateRelevance(rep, account, repOpportunities),
    capacity_score: rep.capacity_score,
    relationship_history: scoreRelationshipHistory(rep, account),
    territory_alignment: scoreTerritoryAlignment(rep, account),
  };

  const weights = {
    segment_match: 0.15,
    vertical_match: 0.2,
    win_rate_relevance: 0.25,
    capacity_score: 0.2,
    relationship_history: 0.1,
    territory_alignment: 0.1,
  };

  const fitScore = Math.round(
    Object.entries(weights).reduce(
      (sum, [key, weight]) => sum + factors[key as keyof FitFactors] * weight,
      0
    )
  );

  return { fitScore: Math.min(100, Math.max(0, fitScore)), factors };
}

function scoreSegmentMatch(rep: Rep, account: Account): number {
  const employeeCount = account.employee_count ?? 0;

  const accountSegment =
    employeeCount >= 1000 ? 'enterprise' :
    employeeCount >= 100 ? 'mid-market' :
    employeeCount >= 20 ? 'smb' : 'inside';

  return rep.segment === accountSegment ? 100 : 30;
}

function scoreVerticalMatch(rep: Rep, account: Account): number {
  if (!account.industry || rep.verticals.length === 0) return 50;

  const match = rep.verticals.some(
    v => v.toLowerCase() === account.industry!.toLowerCase()
  );

  return match ? 100 : 25;
}

function scoreWinRateRelevance(
  _rep: Rep,
  account: Account,
  opportunities: Opportunity[]
): number {
  if (opportunities.length === 0) return 50;

  // Filter to opportunities in similar accounts
  const relevantOpps = opportunities.filter(o => {
    if (account.industry && o.industry?.toLowerCase() === account.industry.toLowerCase()) {
      return true;
    }
    return false;
  });

  if (relevantOpps.length === 0) return 40;

  const won = relevantOpps.filter(o => o.status === 'won').length;
  const winRate = won / relevantOpps.length;

  return Math.round(winRate * 100);
}

function scoreRelationshipHistory(_rep: Rep, _account: Account): number {
  void _rep;
  // TODO: check territory_assignments for prior assignment history
  return 50;
}

function scoreTerritoryAlignment(rep: Rep, account: Account): number {
  if (!rep.territory || !account.state) return 50;
  return rep.territory.toLowerCase() === account.state.toLowerCase() ? 100 : 30;
}
