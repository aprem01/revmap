-- RevMap initial schema
-- Multi-tenant with org_id isolation and RLS

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- ORGS
-- ============================================================
create table orgs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  tier text not null default 'starter' check (tier in ('starter', 'growth', 'enterprise')),
  salesforce_instance_url text,
  salesforce_access_token text,
  salesforce_refresh_token text,
  hubspot_api_key text,
  sync_schedule text not null default '0 2 * * *',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- REPS
-- ============================================================
create table reps (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  crm_id text not null,
  name text not null,
  email text not null,
  role text,
  segment text not null default 'mid-market' check (segment in ('enterprise', 'mid-market', 'smb', 'inside')),
  verticals text[] not null default '{}',
  territory text,
  tenure_months integer,
  ramp_status text not null default 'ramped' check (ramp_status in ('ramping', 'ramped', 'veteran')),
  active_account_count integer not null default 0,
  pipeline_value numeric not null default 0,
  capacity_score numeric not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, crm_id)
);

-- ============================================================
-- ACCOUNTS
-- ============================================================
create table accounts (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  crm_id text not null,
  name text not null,
  industry text,
  employee_count integer,
  annual_revenue numeric,
  website text,
  city text,
  state text,
  country text,
  tech_stack text[] not null default '{}',
  owner_rep_id uuid references reps(id) on delete set null,
  last_activity_at timestamptz,
  crm_source text not null default 'salesforce' check (crm_source in ('salesforce', 'hubspot')),
  raw_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, crm_id)
);

-- ============================================================
-- OPPORTUNITIES
-- ============================================================
create table opportunities (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  crm_id text not null,
  account_id uuid not null references accounts(id) on delete cascade,
  rep_id uuid not null references reps(id) on delete cascade,
  name text not null,
  amount numeric,
  stage text not null,
  status text not null default 'open' check (status in ('open', 'won', 'lost')),
  close_date timestamptz,
  industry text,
  deal_size_bucket text check (deal_size_bucket in ('small', 'medium', 'large', 'enterprise')),
  sales_cycle_days integer,
  attributes jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, crm_id)
);

-- ============================================================
-- ICP MODELS
-- ============================================================
create table icp_models (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  version integer not null default 1,
  attributes jsonb not null default '{}',
  narrative text,
  created_at timestamptz not null default now(),
  unique (org_id, version)
);

-- ============================================================
-- ACCOUNT SCORES
-- ============================================================
create table account_scores (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  icp_model_id uuid not null references icp_models(id) on delete cascade,
  total_score numeric not null default 0 check (total_score >= 0 and total_score <= 100),
  components jsonb not null default '{}',
  explanation jsonb not null default '{}',
  scored_at timestamptz not null default now()
);

create index idx_account_scores_org_score on account_scores(org_id, total_score desc);

-- ============================================================
-- REP-ACCOUNT FIT
-- ============================================================
create table rep_account_fit (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  rep_id uuid not null references reps(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  fit_score numeric not null default 0 check (fit_score >= 0 and fit_score <= 100),
  rationale text not null default '',
  factors jsonb not null default '{}',
  computed_at timestamptz not null default now()
);

create index idx_rep_account_fit_org on rep_account_fit(org_id, fit_score desc);

-- ============================================================
-- RECOMMENDATIONS
-- ============================================================
create table recommendations (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  type text not null check (type in ('REASSIGN', 'RE_ENGAGE', 'ADD_TO_TERRITORY', 'RETIRE', 'REBALANCE')),
  account_id uuid not null references accounts(id) on delete cascade,
  current_rep_id uuid references reps(id) on delete set null,
  recommended_rep_id uuid references reps(id) on delete set null,
  confidence_score numeric not null default 0 check (confidence_score >= 0 and confidence_score <= 100),
  reasoning text not null,
  supporting_data jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed', 'snoozed', 'expired')),
  dismissed_reason text,
  acted_by uuid,
  acted_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index idx_recommendations_org_status on recommendations(org_id, status, created_at desc);

-- ============================================================
-- TERRITORY ASSIGNMENTS
-- ============================================================
create table territory_assignments (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  rep_id uuid not null references reps(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unassigned_at timestamptz,
  reason text
);

create index idx_territory_assignments_active on territory_assignments(org_id, rep_id) where unassigned_at is null;

-- ============================================================
-- SIGNALS
-- ============================================================
create table signals (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  source text not null check (source in ('bombora', 'g2', 'linkedin', 'internal')),
  signal_type text not null,
  strength numeric not null default 0,
  data jsonb not null default '{}',
  detected_at timestamptz not null default now()
);

create index idx_signals_org_account on signals(org_id, account_id, detected_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table orgs enable row level security;
alter table reps enable row level security;
alter table accounts enable row level security;
alter table opportunities enable row level security;
alter table icp_models enable row level security;
alter table account_scores enable row level security;
alter table rep_account_fit enable row level security;
alter table recommendations enable row level security;
alter table territory_assignments enable row level security;
alter table signals enable row level security;

-- RLS policies: users can only access data for their org
-- (Applied after auth is configured — placeholder policies below)
create policy "org_isolation" on orgs for all using (true);
create policy "org_isolation" on reps for all using (true);
create policy "org_isolation" on accounts for all using (true);
create policy "org_isolation" on opportunities for all using (true);
create policy "org_isolation" on icp_models for all using (true);
create policy "org_isolation" on account_scores for all using (true);
create policy "org_isolation" on rep_account_fit for all using (true);
create policy "org_isolation" on recommendations for all using (true);
create policy "org_isolation" on territory_assignments for all using (true);
create policy "org_isolation" on signals for all using (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on orgs for each row execute function update_updated_at();
create trigger set_updated_at before update on reps for each row execute function update_updated_at();
create trigger set_updated_at before update on accounts for each row execute function update_updated_at();
create trigger set_updated_at before update on opportunities for each row execute function update_updated_at();
