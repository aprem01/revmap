export type PipelineStage = 'discover' | 'classify' | 'score' | 'assign' | 'sync';

export interface PipelineAccount {
  id: string;
  name: string;
  industry: string;
  employee_count: number;
  revenue: number;
  stage: PipelineStage;
  score: number | null;
  assigned_rep: string | null;
  signals: string[];
  entered_stage_at: string;
  source: string;
}

export const mockPipelineAccounts: PipelineAccount[] = [
  // Discover stage — net-new accounts found by engine
  {
    id: 'pipe-001', name: 'Apex Cloud Systems', industry: 'SaaS', employee_count: 450, revenue: 62_000_000,
    stage: 'discover', score: null, assigned_rep: null,
    signals: ['Job posting: Senior Salesforce Admin', 'Series B: $18M'],
    entered_stage_at: '2026-04-01T08:00:00Z', source: 'Web crawl',
  },
  {
    id: 'pipe-002', name: 'Harbor Health Group', industry: 'Healthcare', employee_count: 1200, revenue: 290_000_000,
    stage: 'discover', score: null, assigned_rep: null,
    signals: ['Hiring 12 engineers', 'G2 category research'],
    entered_stage_at: '2026-04-01T10:00:00Z', source: 'Industry directory',
  },
  {
    id: 'pipe-003', name: 'FinEdge Analytics', industry: 'FinTech', employee_count: 280, revenue: 38_000_000,
    stage: 'discover', score: null, assigned_rep: null,
    signals: ['Seed round: $5M', 'Tech blog: migrating to Snowflake'],
    entered_stage_at: '2026-04-02T06:00:00Z', source: 'Funding alert',
  },

  // Classify stage — segmented and enriched
  {
    id: 'pipe-004', name: 'Ridgeline Manufacturing', industry: 'Manufacturing', employee_count: 3800, revenue: 720_000_000,
    stage: 'classify', score: null, assigned_rep: null,
    signals: ['SAP customer', 'Headcount +22% YoY'],
    entered_stage_at: '2026-03-30T14:00:00Z', source: 'Firmographic match',
  },
  {
    id: 'pipe-005', name: 'PayStream Solutions', industry: 'FinTech', employee_count: 520, revenue: 78_000_000,
    stage: 'classify', score: null, assigned_rep: null,
    signals: ['Bombora surge: CRM migration', 'Competitor eval on G2'],
    entered_stage_at: '2026-03-29T11:00:00Z', source: 'Intent signal',
  },

  // Score stage — scored against ICP
  {
    id: 'pipe-006', name: 'CloudNine DevOps', industry: 'SaaS', employee_count: 340, revenue: 52_000_000,
    stage: 'score', score: 87, assigned_rep: null,
    signals: ['AWS + Snowflake stack', 'Series C: $40M', 'Hiring 8 AEs'],
    entered_stage_at: '2026-03-28T09:00:00Z', source: 'Web crawl',
  },
  {
    id: 'pipe-007', name: 'Sentinel Insurance Tech', industry: 'Insurance', employee_count: 1600, revenue: 310_000_000,
    stage: 'score', score: 74, assigned_rep: null,
    signals: ['Guidewire + Salesforce', 'Posted RFP for analytics platform'],
    entered_stage_at: '2026-03-28T09:00:00Z', source: 'Industry directory',
  },
  {
    id: 'pipe-008', name: 'Neon Labs', industry: 'SaaS', employee_count: 150, revenue: 18_000_000,
    stage: 'score', score: 41, assigned_rep: null,
    signals: ['Small team', 'No CRM detected'],
    entered_stage_at: '2026-03-28T09:00:00Z', source: 'Web crawl',
  },

  // Assign stage — matched to rep
  {
    id: 'pipe-009', name: 'Westfield Data', industry: 'SaaS', employee_count: 680, revenue: 95_000_000,
    stage: 'assign', score: 91, assigned_rep: 'Priya Patel',
    signals: ['Snowflake + dbt + AWS', 'Series D: $60M', 'Bombora surge'],
    entered_stage_at: '2026-03-27T15:00:00Z', source: 'Multi-signal',
  },
  {
    id: 'pipe-010', name: 'MedCore Systems', industry: 'Healthcare', employee_count: 2100, revenue: 440_000_000,
    stage: 'assign', score: 86, assigned_rep: 'Marcus Johnson',
    signals: ['Epic + Workday stack', 'Expanding to 3 new states'],
    entered_stage_at: '2026-03-27T15:00:00Z', source: 'Firmographic match',
  },

  // Sync stage — pushed to CRM
  {
    id: 'pipe-011', name: 'TechBridge Partners', industry: 'SaaS', employee_count: 400, revenue: 58_000_000,
    stage: 'sync', score: 89, assigned_rep: 'Sarah Chen',
    signals: ['Salesforce + HubSpot dual CRM', 'Hiring VP Sales'],
    entered_stage_at: '2026-03-26T10:00:00Z', source: 'Web crawl',
  },
  {
    id: 'pipe-012', name: 'Atlas Logistics Corp', industry: 'Logistics', employee_count: 2800, revenue: 650_000_000,
    stage: 'sync', score: 79, assigned_rep: 'David Kim',
    signals: ['Oracle + SAP migration', '$200M contract win'],
    entered_stage_at: '2026-03-26T10:00:00Z', source: 'News alert',
  },
];

export const stageConfig: Record<PipelineStage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  discover: { label: 'Discover', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  classify: { label: 'Classify', color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  score: { label: 'Score', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  assign: { label: 'Assign', color: 'text-violet-700', bgColor: 'bg-violet-50', borderColor: 'border-violet-200' },
  sync: { label: 'Sync', color: 'text-fuchsia-700', bgColor: 'bg-fuchsia-50', borderColor: 'border-fuchsia-200' },
};
