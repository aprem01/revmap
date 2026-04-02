export interface Org {
  id: string;
  name: string;
  tier: 'starter' | 'growth' | 'enterprise';
  salesforce_instance_url: string | null;
  salesforce_access_token: string | null;
  salesforce_refresh_token: string | null;
  hubspot_api_key: string | null;
  sync_schedule: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  org_id: string;
  crm_id: string;
  name: string;
  industry: string | null;
  employee_count: number | null;
  annual_revenue: number | null;
  website: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  tech_stack: string[];
  owner_rep_id: string | null;
  last_activity_at: string | null;
  crm_source: 'salesforce' | 'hubspot';
  raw_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Rep {
  id: string;
  org_id: string;
  crm_id: string;
  name: string;
  email: string;
  role: string | null;
  segment: 'enterprise' | 'mid-market' | 'smb' | 'inside';
  verticals: string[];
  territory: string | null;
  tenure_months: number | null;
  ramp_status: 'ramping' | 'ramped' | 'veteran';
  active_account_count: number;
  pipeline_value: number;
  capacity_score: number;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  org_id: string;
  crm_id: string;
  account_id: string;
  rep_id: string;
  name: string;
  amount: number | null;
  stage: string;
  status: 'open' | 'won' | 'lost';
  close_date: string | null;
  industry: string | null;
  deal_size_bucket: 'small' | 'medium' | 'large' | 'enterprise';
  sales_cycle_days: number | null;
  attributes: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ICPModel {
  id: string;
  org_id: string;
  version: number;
  attributes: ICPAttributes;
  narrative: string | null;
  created_at: string;
}

export interface ICPAttributes {
  industries: WeightedAttribute[];
  employee_range: { min: number; max: number; weight: number };
  revenue_range: { min: number; max: number; weight: number };
  tech_stack: WeightedAttribute[];
  geographies: WeightedAttribute[];
  growth_signals: WeightedAttribute[];
}

export interface WeightedAttribute {
  value: string;
  weight: number;
}

export interface AccountScore {
  id: string;
  org_id: string;
  account_id: string;
  icp_model_id: string;
  total_score: number;
  components: ScoreComponents;
  explanation: ScoreExplanation;
  scored_at: string;
}

export interface ScoreComponents {
  firmographic_fit: number;
  technographic_fit: number;
  intent_signals: number;
  hiring_signals: number;
  engagement_recency: number;
  growth_indicators: number;
}

export interface ScoreExplanation {
  summary: string;
  drivers: { signal: string; impact: 'high' | 'medium' | 'low'; detail: string }[];
}

export interface RepAccountFit {
  id: string;
  org_id: string;
  rep_id: string;
  account_id: string;
  fit_score: number;
  rationale: string;
  factors: FitFactors;
  computed_at: string;
}

export interface FitFactors {
  segment_match: number;
  vertical_match: number;
  win_rate_relevance: number;
  capacity_score: number;
  relationship_history: number;
  territory_alignment: number;
}

export type RecommendationType =
  | 'REASSIGN'
  | 'RE_ENGAGE'
  | 'ADD_TO_TERRITORY'
  | 'RETIRE'
  | 'REBALANCE';

export type RecommendationStatus =
  | 'pending'
  | 'approved'
  | 'dismissed'
  | 'snoozed'
  | 'expired';

export interface Recommendation {
  id: string;
  org_id: string;
  type: RecommendationType;
  account_id: string;
  current_rep_id: string | null;
  recommended_rep_id: string | null;
  confidence_score: number;
  reasoning: string;
  supporting_data: Record<string, unknown>;
  status: RecommendationStatus;
  dismissed_reason: string | null;
  acted_by: string | null;
  acted_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface TerritoryAssignment {
  id: string;
  org_id: string;
  account_id: string;
  rep_id: string;
  assigned_at: string;
  unassigned_at: string | null;
  reason: string | null;
}

export interface Signal {
  id: string;
  org_id: string;
  account_id: string;
  source: 'bombora' | 'g2' | 'linkedin' | 'internal';
  signal_type: string;
  strength: number;
  data: Record<string, unknown>;
  detected_at: string;
}
