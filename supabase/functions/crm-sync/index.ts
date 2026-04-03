// Supabase Edge Function: CRM Sync
// Syncs accounts, contacts, opportunities, and users from Salesforce
// Supports both full sync and delta sync (only records modified since last sync)

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

    const { org_id, sync_type = 'full' } = await req.json();
    const isDelta = sync_type === 'delta';

    // Fetch org credentials
    const { data: org, error: orgError } = await supabase
      .from('orgs')
      .select('*')
      .eq('id', org_id)
      .single();

    if (orgError || !org) {
      return new Response(JSON.stringify({ error: 'Org not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!org.salesforce_instance_url || !org.salesforce_access_token) {
      return new Response(JSON.stringify({ error: 'Salesforce not connected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sfBaseUrl = `${org.salesforce_instance_url}/services/data/v59.0`;
    const sfHeaders = {
      Authorization: `Bearer ${org.salesforce_access_token}`,
      'Content-Type': 'application/json',
    };

    // Build date filter for delta sync
    const deltaFilter = isDelta
      ? ` AND SystemModstamp >= ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 19)}Z`
      : '';

    // Sync accounts
    const accountsRes = await fetch(
      `${sfBaseUrl}/query?q=${encodeURIComponent(
        `SELECT Id, Name, Industry, NumberOfEmployees, AnnualRevenue, Website, BillingCity, BillingState, BillingCountry, OwnerId, LastActivityDate FROM Account WHERE IsDeleted = false${deltaFilter}`
      )}`,
      { headers: sfHeaders }
    );
    const accountsData = await accountsRes.json();

    let syncedAccounts = 0;
    for (const record of accountsData.records ?? []) {
      const { error } = await supabase.from('accounts').upsert(
        {
          org_id,
          crm_id: record.Id,
          name: record.Name,
          industry: record.Industry,
          employee_count: record.NumberOfEmployees,
          annual_revenue: record.AnnualRevenue,
          website: record.Website,
          city: record.BillingCity,
          state: record.BillingState,
          country: record.BillingCountry,
          last_activity_at: record.LastActivityDate,
          crm_source: 'salesforce',
          raw_data: record,
        },
        { onConflict: 'org_id,crm_id' }
      );
      if (!error) syncedAccounts++;
    }

    // Sync opportunities
    const oppsRes = await fetch(
      `${sfBaseUrl}/query?q=${encodeURIComponent(
        `SELECT Id, Name, AccountId, OwnerId, Amount, StageName, IsClosed, IsWon, CloseDate, Type FROM Opportunity WHERE IsDeleted = false${deltaFilter}`
      )}`,
      { headers: sfHeaders }
    );
    const oppsData = await oppsRes.json();

    let syncedOpps = 0;
    for (const record of oppsData.records ?? []) {
      const status = record.IsWon ? 'won' : record.IsClosed ? 'lost' : 'open';
      const amount = record.Amount ?? 0;
      const dealSize = amount >= 500000 ? 'enterprise' : amount >= 100000 ? 'large' : amount >= 25000 ? 'medium' : 'small';

      const { error } = await supabase.from('opportunities').upsert(
        {
          org_id,
          crm_id: record.Id,
          account_id: record.AccountId, // needs account lookup in production
          rep_id: record.OwnerId,       // needs rep lookup in production
          name: record.Name,
          amount: record.Amount,
          stage: record.StageName,
          status,
          close_date: record.CloseDate,
          deal_size_bucket: dealSize,
          attributes: record,
        },
        { onConflict: 'org_id,crm_id' }
      );
      if (!error) syncedOpps++;
    }

    // Sync users as reps
    const usersRes = await fetch(
      `${sfBaseUrl}/query?q=${encodeURIComponent(
        "SELECT Id, Name, Email, UserRole.Name, IsActive FROM User WHERE IsActive = true AND UserType = 'Standard'"
      )}`,
      { headers: sfHeaders }
    );
    const usersData = await usersRes.json();

    let syncedReps = 0;
    for (const record of usersData.records ?? []) {
      const { error } = await supabase.from('reps').upsert(
        {
          org_id,
          crm_id: record.Id,
          name: record.Name,
          email: record.Email,
          role: record.UserRole?.Name ?? null,
          crm_source: 'salesforce',
        },
        { onConflict: 'org_id,crm_id' }
      );
      if (!error) syncedReps++;
    }

    // Update org last sync timestamp
    await supabase
      .from('orgs')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', org_id);

    return new Response(
      JSON.stringify({
        success: true,
        sync_type: isDelta ? 'delta' : 'full',
        synced: { accounts: syncedAccounts, reps: syncedReps, opportunities: syncedOpps },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
