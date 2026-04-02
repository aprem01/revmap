import type { Opportunity, ICPAttributes, WeightedAttribute } from '@/types';

/**
 * Extracts ICP attributes from historical won/lost opportunities.
 * Compares winning vs losing patterns to build a weighted attribute model.
 */
export function extractICPFromOpportunities(
  opportunities: Opportunity[],
  accounts: { id: string; industry: string | null; employee_count: number | null; annual_revenue: number | null; tech_stack: string[]; country: string | null }[]
): ICPAttributes {
  const won = opportunities.filter(o => o.status === 'won');
  const lost = opportunities.filter(o => o.status === 'lost');

  const accountMap = new Map(accounts.map(a => [a.id, a]));

  const wonAccounts = won.map(o => accountMap.get(o.account_id)).filter(Boolean);
  const lostAccounts = lost.map(o => accountMap.get(o.account_id)).filter(Boolean);

  return {
    industries: computeWeightedAttributes(
      wonAccounts.map(a => a!.industry).filter(Boolean) as string[],
      lostAccounts.map(a => a!.industry).filter(Boolean) as string[]
    ),
    employee_range: computeRange(
      wonAccounts.map(a => a!.employee_count).filter(Boolean) as number[]
    ),
    revenue_range: computeRange(
      wonAccounts.map(a => a!.annual_revenue).filter(Boolean) as number[]
    ),
    tech_stack: computeWeightedAttributes(
      wonAccounts.flatMap(a => a!.tech_stack),
      lostAccounts.flatMap(a => a!.tech_stack)
    ),
    geographies: computeWeightedAttributes(
      wonAccounts.map(a => a!.country).filter(Boolean) as string[],
      lostAccounts.map(a => a!.country).filter(Boolean) as string[]
    ),
    growth_signals: [],
  };
}

function computeWeightedAttributes(
  wonValues: string[],
  lostValues: string[]
): WeightedAttribute[] {
  const wonCounts = countOccurrences(wonValues);
  const lostCounts = countOccurrences(lostValues);
  const allKeys = new Set([...Object.keys(wonCounts), ...Object.keys(lostCounts)]);

  const totalWon = wonValues.length || 1;
  const totalLost = lostValues.length || 1;

  const results: WeightedAttribute[] = [];

  for (const key of allKeys) {
    const wonRate = (wonCounts[key] ?? 0) / totalWon;
    const lostRate = (lostCounts[key] ?? 0) / totalLost;
    const weight = Math.round(Math.max(0, Math.min(100, (wonRate - lostRate + 1) * 50)));
    results.push({ value: key, weight });
  }

  return results.sort((a, b) => b.weight - a.weight);
}

function computeRange(values: number[]): { min: number; max: number; weight: number } {
  if (values.length === 0) {
    return { min: 0, max: 0, weight: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const p25 = sorted[Math.floor(sorted.length * 0.25)] ?? sorted[0]!;
  const p75 = sorted[Math.floor(sorted.length * 0.75)] ?? sorted[sorted.length - 1]!;
  return { min: p25, max: p75, weight: 80 };
}

function countOccurrences(values: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of values) {
    counts[v] = (counts[v] ?? 0) + 1;
  }
  return counts;
}
