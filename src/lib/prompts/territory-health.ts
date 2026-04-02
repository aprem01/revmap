export function buildTerritoryHealthPrompt(params: {
  orgName: string;
  repCount: number;
  totalAccounts: number;
  avgScore: number;
  pendingRecommendations: number;
  topRecommendations: { type: string; accountName: string; reasoning: string }[];
  coverageGaps: { territory: string; gap: string }[];
}): string {
  const { orgName, repCount, totalAccounts, avgScore, pendingRecommendations, topRecommendations, coverageGaps } = params;

  return `You are a territory intelligence analyst generating a weekly digest for ${orgName}.

TERRITORY SNAPSHOT:
- ${repCount} active reps
- ${totalAccounts} accounts in CRM
- Average account score: ${avgScore}/100
- ${pendingRecommendations} pending recommendations

TOP RECOMMENDATIONS:
${topRecommendations.map(r => `- ${r.type}: ${r.accountName} — ${r.reasoning}`).join('\n')}

COVERAGE GAPS:
${coverageGaps.length > 0 ? coverageGaps.map(g => `- ${g.territory}: ${g.gap}`).join('\n') : 'No critical gaps detected.'}

Write a 4-6 sentence executive summary for the CRO or VP Sales. Lead with the most impactful insight. Be specific with numbers. End with the single highest-priority action to take this week.`;
}
