import type { Account, ICPAttributes, ScoreComponents } from '@/types';

/**
 * Scores an account 0-100 against an org's ICP model.
 * Returns component scores and a weighted total.
 */
export function scoreAccount(
  account: Account,
  icp: ICPAttributes
): { totalScore: number; components: ScoreComponents } {
  const components: ScoreComponents = {
    firmographic_fit: scoreFirmographic(account, icp),
    technographic_fit: scoreTechnographic(account, icp),
    intent_signals: 0, // requires external data — enterprise tier
    hiring_signals: 0, // requires external data
    engagement_recency: scoreEngagement(account),
    growth_indicators: 0, // requires external data
  };

  // Weighted average — firmographic and technographic dominate in starter tier
  const weights = {
    firmographic_fit: 0.35,
    technographic_fit: 0.25,
    intent_signals: 0.15,
    hiring_signals: 0.05,
    engagement_recency: 0.15,
    growth_indicators: 0.05,
  };

  const totalScore = Math.round(
    Object.entries(weights).reduce(
      (sum, [key, weight]) => sum + components[key as keyof ScoreComponents] * weight,
      0
    )
  );

  return { totalScore: Math.min(100, Math.max(0, totalScore)), components };
}

function scoreFirmographic(account: Account, icp: ICPAttributes): number {
  let score = 0;
  let factors = 0;

  // Industry match
  if (account.industry) {
    const match = icp.industries.find(
      i => i.value.toLowerCase() === account.industry!.toLowerCase()
    );
    score += match ? match.weight : 20;
    factors++;
  }

  // Employee count in ICP range
  if (account.employee_count && icp.employee_range.max > 0) {
    const { min, max } = icp.employee_range;
    if (account.employee_count >= min && account.employee_count <= max) {
      score += 90;
    } else {
      const distance = account.employee_count < min
        ? (min - account.employee_count) / min
        : (account.employee_count - max) / max;
      score += Math.max(0, 90 - distance * 100);
    }
    factors++;
  }

  // Revenue in ICP range
  if (account.annual_revenue && icp.revenue_range.max > 0) {
    const { min, max } = icp.revenue_range;
    if (account.annual_revenue >= min && account.annual_revenue <= max) {
      score += 90;
    } else {
      const distance = account.annual_revenue < min
        ? (min - account.annual_revenue) / min
        : (account.annual_revenue - max) / max;
      score += Math.max(0, 90 - distance * 100);
    }
    factors++;
  }

  // Geography match
  if (account.country) {
    const match = icp.geographies.find(
      g => g.value.toLowerCase() === account.country!.toLowerCase()
    );
    score += match ? match.weight : 30;
    factors++;
  }

  return factors > 0 ? Math.round(score / factors) : 0;
}

function scoreTechnographic(account: Account, icp: ICPAttributes): number {
  if (account.tech_stack.length === 0 || icp.tech_stack.length === 0) return 0;

  const icpTech = new Set(icp.tech_stack.map(t => t.value.toLowerCase()));
  const matchCount = account.tech_stack.filter(t => icpTech.has(t.toLowerCase())).length;
  const overlapRatio = matchCount / Math.max(icp.tech_stack.length, 1);

  return Math.round(overlapRatio * 100);
}

function scoreEngagement(account: Account): number {
  if (!account.last_activity_at) return 0;

  const daysSince = Math.floor(
    (Date.now() - new Date(account.last_activity_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince <= 7) return 100;
  if (daysSince <= 30) return 80;
  if (daysSince <= 60) return 60;
  if (daysSince <= 90) return 40;
  if (daysSince <= 180) return 20;
  return 5;
}
