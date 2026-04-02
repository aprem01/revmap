// Supabase Edge Function: Approve Recommendation
// Approves a recommendation and writes back to Salesforce

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

    const { recommendation_id, acted_by } = await req.json();

    // Fetch recommendation with related data
    const { data: rec, error: recError } = await supabase
      .from('recommendations')
      .select('*, accounts(*)')
      .eq('id', recommendation_id)
      .single();

    if (recError || !rec) {
      return new Response(JSON.stringify({ error: 'Recommendation not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (rec.status !== 'pending') {
      return new Response(JSON.stringify({ error: `Cannot approve: status is ${rec.status}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update recommendation status
    const { error: updateError } = await supabase
      .from('recommendations')
      .update({
        status: 'approved',
        acted_by,
        acted_at: new Date().toISOString(),
      })
      .eq('id', recommendation_id);

    if (updateError) throw updateError;

    // For REASSIGN type, write back to Salesforce
    if (rec.type === 'REASSIGN' && rec.recommended_rep_id) {
      const { data: org } = await supabase
        .from('orgs')
        .select('*')
        .eq('id', rec.org_id)
        .single();

      if (org?.salesforce_instance_url && org?.salesforce_access_token) {
        const account = rec.accounts;
        const { data: newRep } = await supabase
          .from('reps')
          .select('crm_id')
          .eq('id', rec.recommended_rep_id)
          .single();

        if (account?.crm_id && newRep?.crm_id) {
          await fetch(
            `${org.salesforce_instance_url}/services/data/v59.0/sobjects/Account/${account.crm_id}`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${org.salesforce_access_token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ OwnerId: newRep.crm_id }),
            }
          );

          // Log territory assignment
          await supabase.from('territory_assignments').insert({
            org_id: rec.org_id,
            account_id: rec.account_id,
            rep_id: rec.recommended_rep_id,
            reason: `Approved recommendation: ${rec.type}`,
          });

          // Close old assignment
          if (rec.current_rep_id) {
            await supabase
              .from('territory_assignments')
              .update({ unassigned_at: new Date().toISOString() })
              .eq('org_id', rec.org_id)
              .eq('account_id', rec.account_id)
              .eq('rep_id', rec.current_rep_id)
              .is('unassigned_at', null);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, status: 'approved' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
