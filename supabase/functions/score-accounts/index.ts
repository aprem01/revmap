// Supabase Edge Function: Score Accounts
// Scores all accounts for an org against their latest ICP model

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

    const { org_id } = await req.json();

    // Get latest ICP model
    const { data: icpModel } = await supabase
      .from('icp_models')
      .select('*')
      .eq('org_id', org_id)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    if (!icpModel) {
      return new Response(JSON.stringify({ error: 'No ICP model found. Run ICP engine first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all accounts
    const { data: accounts } = await supabase
      .from('accounts')
      .select('*')
      .eq('org_id', org_id);

    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ error: 'No accounts found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const icp = icpModel.attributes;
    let scored = 0;

    for (const account of accounts) {
      // Inline scoring logic (mirrors src/lib/models/account-scorer.ts)
      const firmographic = scoreFirmographic(account, icp);
      const technographic = scoreTechnographic(account, icp);
      const engagement = scoreEngagement(account);

      const components = {
        firmographic_fit: firmographic,
        technographic_fit: technographic,
        intent_signals: 0,
        hiring_signals: 0,
        engagement_recency: engagement,
        growth_indicators: 0,
      };

      const totalScore = Math.round(
        firmographic * 0.35 +
        technographic * 0.25 +
        engagement * 0.15
      );

      await supabase.from('account_scores').upsert(
        {
          org_id,
          account_id: account.id,
          icp_model_id: icpModel.id,
          total_score: Math.min(100, Math.max(0, totalScore)),
          components,
          explanation: { summary: '', drivers: [] },
          scored_at: new Date().toISOString(),
        },
        { onConflict: 'org_id,account_id,icp_model_id' }
      );
      scored++;
    }

    return new Response(
      JSON.stringify({ success: true, scored }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function scoreFirmographic(account: Record<string, unknown>, icp: Record<string, unknown>): number {
  let score = 0;
  let factors = 0;

  const industries = (icp.industries as { value: string; weight: number }[]) ?? [];
  if (account.industry) {
    const match = industries.find(
      (i: { value: string }) => i.value.toLowerCase() === (account.industry as string).toLowerCase()
    );
    score += match ? match.weight : 20;
    factors++;
  }

  const empRange = icp.employee_range as { min: number; max: number } | undefined;
  if (account.employee_count && empRange && empRange.max > 0) {
    const emp = account.employee_count as number;
    if (emp >= empRange.min && emp <= empRange.max) {
      score += 90;
    } else {
      score += 30;
    }
    factors++;
  }

  return factors > 0 ? Math.round(score / factors) : 0;
}

function scoreTechnographic(account: Record<string, unknown>, icp: Record<string, unknown>): number {
  const accountTech = (account.tech_stack as string[]) ?? [];
  const icpTech = (icp.tech_stack as { value: string }[]) ?? [];
  if (accountTech.length === 0 || icpTech.length === 0) return 0;

  const icpSet = new Set(icpTech.map((t: { value: string }) => t.value.toLowerCase()));
  const matches = accountTech.filter((t: string) => icpSet.has(t.toLowerCase())).length;
  return Math.round((matches / icpTech.length) * 100);
}

function scoreEngagement(account: Record<string, unknown>): number {
  if (!account.last_activity_at) return 0;
  const days = Math.floor(
    (Date.now() - new Date(account.last_activity_at as string).getTime()) / 86400000
  );
  if (days <= 7) return 100;
  if (days <= 30) return 80;
  if (days <= 90) return 40;
  return 5;
}
