import { z } from 'zod';

export const OrgTierSchema = z.enum(['starter', 'growth', 'enterprise']);
export const CRMSourceSchema = z.enum(['salesforce', 'hubspot']);
export const SegmentSchema = z.enum(['enterprise', 'mid-market', 'smb', 'inside']);
export const RampStatusSchema = z.enum(['ramping', 'ramped', 'veteran']);
export const OpportunityStatusSchema = z.enum(['open', 'won', 'lost']);
export const DealSizeBucketSchema = z.enum(['small', 'medium', 'large', 'enterprise']);
export const RecommendationTypeSchema = z.enum([
  'REASSIGN', 'RE_ENGAGE', 'ADD_TO_TERRITORY', 'RETIRE', 'REBALANCE',
]);
export const RecommendationStatusSchema = z.enum([
  'pending', 'approved', 'dismissed', 'snoozed', 'expired',
]);
export const SignalSourceSchema = z.enum(['bombora', 'g2', 'linkedin', 'internal']);

export const AccountSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  crm_id: z.string(),
  name: z.string().min(1),
  industry: z.string().nullable(),
  employee_count: z.number().int().positive().nullable(),
  annual_revenue: z.number().positive().nullable(),
  website: z.string().url().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  tech_stack: z.array(z.string()),
  owner_rep_id: z.string().uuid().nullable(),
  last_activity_at: z.string().datetime().nullable(),
  crm_source: CRMSourceSchema,
  raw_data: z.record(z.string(), z.unknown()),
});

export const RepSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  crm_id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().nullable(),
  segment: SegmentSchema,
  verticals: z.array(z.string()),
  territory: z.string().nullable(),
  tenure_months: z.number().int().nonnegative().nullable(),
  ramp_status: RampStatusSchema,
  active_account_count: z.number().int().nonnegative(),
  pipeline_value: z.number().nonnegative(),
  capacity_score: z.number().min(0).max(100),
});

export const OpportunitySchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  crm_id: z.string(),
  account_id: z.string().uuid(),
  rep_id: z.string().uuid(),
  name: z.string().min(1),
  amount: z.number().positive().nullable(),
  stage: z.string(),
  status: OpportunityStatusSchema,
  close_date: z.string().datetime().nullable(),
  industry: z.string().nullable(),
  deal_size_bucket: DealSizeBucketSchema,
  sales_cycle_days: z.number().int().positive().nullable(),
  attributes: z.record(z.string(), z.unknown()),
});

export const RecommendationSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  type: RecommendationTypeSchema,
  account_id: z.string().uuid(),
  current_rep_id: z.string().uuid().nullable(),
  recommended_rep_id: z.string().uuid().nullable(),
  confidence_score: z.number().min(0).max(100),
  reasoning: z.string(),
  supporting_data: z.record(z.string(), z.unknown()),
  status: RecommendationStatusSchema,
  dismissed_reason: z.string().nullable(),
  acted_by: z.string().uuid().nullable(),
  acted_at: z.string().datetime().nullable(),
  expires_at: z.string().datetime(),
});

export const ApproveRecommendationSchema = z.object({
  recommendation_id: z.string().uuid(),
  acted_by: z.string().uuid(),
});

export const DismissRecommendationSchema = z.object({
  recommendation_id: z.string().uuid(),
  acted_by: z.string().uuid(),
  reason: z.string().optional(),
});

export const ScoreComponentsSchema = z.object({
  firmographic_fit: z.number().min(0).max(100),
  technographic_fit: z.number().min(0).max(100),
  intent_signals: z.number().min(0).max(100),
  hiring_signals: z.number().min(0).max(100),
  engagement_recency: z.number().min(0).max(100),
  growth_indicators: z.number().min(0).max(100),
});

export type ApproveRecommendationInput = z.infer<typeof ApproveRecommendationSchema>;
export type DismissRecommendationInput = z.infer<typeof DismissRecommendationSchema>;
