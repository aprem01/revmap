import type { ICPAttributes } from '@/types';

export function buildICPNarrativePrompt(params: {
  orgName: string;
  attributes: ICPAttributes;
  wonCount: number;
  lostCount: number;
}): string {
  const { orgName, attributes, wonCount, lostCount } = params;

  return `You are a territory intelligence analyst. Based on the following ICP model derived from ${wonCount} won and ${lostCount} lost opportunities for ${orgName}, write a clear, human-readable summary of what their ideal customer looks like.

ICP MODEL:
${JSON.stringify(attributes, null, 2)}

Write 3-4 sentences that a VP of Sales could read and immediately understand. Reference specific industries, company sizes, and signals. Be concrete, not generic. No bullet points.`;
}
