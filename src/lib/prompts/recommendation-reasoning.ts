import type { Account, Rep, Signal, RecommendationType } from '@/types';

export function buildRecommendationReasoningPrompt(params: {
  type: RecommendationType;
  account: Account;
  currentRep: Rep | null;
  recommendedRep: Rep | null;
  signals: Signal[];
  scoreComponents: Record<string, number>;
}): string {
  const { type, account, currentRep, recommendedRep, signals, scoreComponents } = params;

  const accountProfile = JSON.stringify({
    name: account.name,
    industry: account.industry,
    employee_count: account.employee_count,
    annual_revenue: account.annual_revenue,
    tech_stack: account.tech_stack,
    location: [account.city, account.state, account.country].filter(Boolean).join(', '),
    last_activity: account.last_activity_at,
  }, null, 2);

  const currentRepProfile = currentRep
    ? JSON.stringify({
        name: currentRep.name,
        segment: currentRep.segment,
        verticals: currentRep.verticals,
        territory: currentRep.territory,
        ramp_status: currentRep.ramp_status,
        active_accounts: currentRep.active_account_count,
        pipeline_value: currentRep.pipeline_value,
        capacity_score: currentRep.capacity_score,
      }, null, 2)
    : 'None (unassigned)';

  const recommendedRepProfile = recommendedRep
    ? JSON.stringify({
        name: recommendedRep.name,
        segment: recommendedRep.segment,
        verticals: recommendedRep.verticals,
        territory: recommendedRep.territory,
        ramp_status: recommendedRep.ramp_status,
        active_accounts: recommendedRep.active_account_count,
        pipeline_value: recommendedRep.pipeline_value,
        capacity_score: recommendedRep.capacity_score,
      }, null, 2)
    : 'N/A';

  const signalsSummary = signals.length > 0
    ? JSON.stringify(signals.map(s => ({
        source: s.source,
        type: s.signal_type,
        strength: s.strength,
        detected: s.detected_at,
      })), null, 2)
    : 'No external signals available';

  const typeInstructions: Record<RecommendationType, string> = {
    REASSIGN: `Explain why this account should be reassigned from the current rep to the recommended rep. Focus on fit mismatch, capacity, or performance data.`,
    RE_ENGAGE: `Explain why this high-scoring account needs immediate re-engagement. Reference the staleness of activity and the opportunity cost.`,
    ADD_TO_TERRITORY: `Explain why this net-new account should be added to the CRM and assigned to the recommended rep. Focus on ICP fit and rep alignment.`,
    RETIRE: `Explain why this account should be deprioritized or removed from active territory. Focus on low score, poor engagement, and opportunity cost.`,
    REBALANCE: `Explain why accounts in this territory need rebalancing. Reference capacity imbalances and coverage gaps.`,
  };

  return `You are a territory intelligence analyst for a B2B sales operations team.

Given the following data, write a 2-3 sentence explanation for a ${type} recommendation.

${typeInstructions[type]}

Be specific, data-driven, and write for a sales operations leader. No fluff.

ACCOUNT PROFILE:
${accountProfile}

CURRENT REP:
${currentRepProfile}

RECOMMENDED REP:
${recommendedRepProfile}

SCORE COMPONENTS:
${JSON.stringify(scoreComponents, null, 2)}

SUPPORTING SIGNALS:
${signalsSummary}

Write only the explanation. No headers, no bullet points, no preamble.`;
}
