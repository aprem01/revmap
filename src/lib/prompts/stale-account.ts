import type { Account, Signal } from '@/types';

export function buildStaleAccountPrompt(params: {
  account: Account;
  daysSinceLastActivity: number;
  accountScore: number;
  signals: Signal[];
}): string {
  const { account, daysSinceLastActivity, accountScore, signals } = params;

  return `You are a territory intelligence analyst. This high-scoring account has gone stale and needs a re-engagement rationale.

ACCOUNT:
- Name: ${account.name}
- Industry: ${account.industry ?? 'Unknown'}
- Employees: ${account.employee_count ?? 'Unknown'}
- Revenue: ${account.annual_revenue ? `$${account.annual_revenue.toLocaleString()}` : 'Unknown'}
- Days since last activity: ${daysSinceLastActivity}
- Account score: ${accountScore}/100

RECENT SIGNALS:
${signals.length > 0 ? signals.map(s => `- ${s.source}/${s.signal_type}: strength ${s.strength} (${s.detected_at})`).join('\n') : 'No recent signals.'}

Write 2-3 sentences explaining why this account deserves immediate attention and suggest a specific re-engagement approach. Be concrete.`;
}
