// Supabase Edge Function: Weekly Digest
// Generates a territory health summary using Claude API

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

    const { org_id } = await req.json();

    // Gather stats
    const [orgRes, repsRes, accountsRes, scoresRes, recsRes] = await Promise.all([
      supabase.from('orgs').select('name').eq('id', org_id).single(),
      supabase.from('reps').select('id').eq('org_id', org_id),
      supabase.from('accounts').select('id').eq('org_id', org_id),
      supabase.from('account_scores').select('total_score').eq('org_id', org_id),
      supabase
        .from('recommendations')
        .select('type, reasoning, account_id, accounts(name)')
        .eq('org_id', org_id)
        .eq('status', 'pending')
        .order('confidence_score', { ascending: false })
        .limit(5),
    ]);

    const orgName = orgRes.data?.name ?? 'Unknown Org';
    const repCount = repsRes.data?.length ?? 0;
    const totalAccounts = accountsRes.data?.length ?? 0;
    const scores = scoresRes.data ?? [];
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((s, r) => s + (r.total_score ?? 0), 0) / scores.length)
      : 0;
    const pendingRecs = recsRes.data ?? [];

    const prompt = `You are a territory intelligence analyst generating a weekly digest for ${orgName}.

TERRITORY SNAPSHOT:
- ${repCount} active reps
- ${totalAccounts} accounts in CRM
- Average account score: ${avgScore}/100
- ${pendingRecs.length} pending recommendations

TOP RECOMMENDATIONS:
${pendingRecs.map((r: Record<string, unknown>) => `- ${r.type}: ${(r.accounts as Record<string, unknown>)?.name ?? 'Unknown'} — ${r.reasoning}`).join('\n') || 'None'}

Write a 4-6 sentence executive summary for the CRO or VP Sales. Lead with the most impactful insight. Be specific with numbers. End with the single highest-priority action to take this week.`;

    let digest = '';
    if (anthropicKey) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      digest = data.content?.[0]?.text ?? 'Unable to generate digest.';
    } else {
      digest = `Weekly digest for ${orgName}: ${repCount} reps managing ${totalAccounts} accounts. Average score: ${avgScore}/100. ${pendingRecs.length} pending recommendations.`;
    }

    return new Response(
      JSON.stringify({ success: true, digest, stats: { repCount, totalAccounts, avgScore, pendingRecommendations: pendingRecs.length } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
