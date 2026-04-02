// Supabase Edge Function: Run Recommendations
// Generates recommendations based on account scores and rep fit

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

    // Fetch scored accounts (top 50)
    const { data: scores } = await supabase
      .from('account_scores')
      .select('*, accounts(*)')
      .eq('org_id', org_id)
      .order('total_score', { ascending: false })
      .limit(50);

    // Fetch reps
    const { data: reps } = await supabase
      .from('reps')
      .select('*')
      .eq('org_id', org_id);

    if (!scores || !reps || scores.length === 0) {
      return new Response(JSON.stringify({ error: 'Insufficient data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    let created = 0;

    for (const score of scores) {
      const account = score.accounts;
      if (!account) continue;

      // RE_ENGAGE: high score, stale activity
      if (score.total_score >= 70 && account.last_activity_at) {
        const daysSince = Math.floor(
          (Date.now() - new Date(account.last_activity_at).getTime()) / 86400000
        );
        if (daysSince > 60) {
          const reasoning = await generateReasoning(anthropicKey, {
            type: 'RE_ENGAGE',
            account,
            score: score.total_score,
            daysSince,
          });

          await supabase.from('recommendations').insert({
            org_id,
            type: 'RE_ENGAGE',
            account_id: account.id,
            current_rep_id: account.owner_rep_id,
            confidence_score: Math.min(score.total_score, 95),
            reasoning,
            supporting_data: { days_stale: daysSince, score: score.total_score },
            status: 'pending',
            expires_at: expiresAt,
          });
          created++;
        }
      }

      // RETIRE: low score accounts consuming capacity
      if (score.total_score < 25 && account.owner_rep_id) {
        const reasoning = await generateReasoning(anthropicKey, {
          type: 'RETIRE',
          account,
          score: score.total_score,
        });

        await supabase.from('recommendations').insert({
          org_id,
          type: 'RETIRE',
          account_id: account.id,
          current_rep_id: account.owner_rep_id,
          confidence_score: 90 - score.total_score,
          reasoning,
          supporting_data: { score: score.total_score },
          status: 'pending',
          expires_at: expiresAt,
        });
        created++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, recommendations_created: created }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateReasoning(
  apiKey: string | undefined,
  context: Record<string, unknown>
): Promise<string> {
  if (!apiKey) {
    return `${context.type} recommendation for ${(context.account as Record<string, unknown>)?.name ?? 'account'} based on score of ${context.score ?? 'N/A'}.`;
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `You are a territory intelligence analyst. Write a 2-3 sentence explanation for a ${context.type} recommendation for this account: ${JSON.stringify(context.account)}. Account score: ${context.score}/100. ${context.daysSince ? `Days since last activity: ${context.daysSince}.` : ''} Be specific and data-driven. No fluff.`,
          },
        ],
      }),
    });

    const data = await res.json();
    return data.content?.[0]?.text ?? 'Recommendation generated based on account scoring.';
  } catch {
    return `${context.type} recommendation generated based on scoring model.`;
  }
}
