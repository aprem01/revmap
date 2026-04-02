export interface TerritoryVersion {
  id: string;
  name: string;
  branch: string;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  created_by: string;
  description: string;
  assignments: TerritoryAssignmentSnapshot[];
  stats: {
    total_accounts: number;
    total_pipeline: number;
    avg_score: number;
    balance_score: number;
  };
}

export interface TerritoryAssignmentSnapshot {
  rep_id: string;
  rep_name: string;
  territory: string;
  accounts: string[];
  account_count: number;
  pipeline_value: number;
  capacity_score: number;
  avg_account_score: number;
}

export const mockTerritoryVersions: TerritoryVersion[] = [
  {
    id: 'tv-001',
    name: 'Q2 2026 Plan',
    branch: 'main',
    status: 'active',
    created_at: '2026-03-01T00:00:00Z',
    created_by: 'RevOps',
    description: 'Current live territory structure — 4 reps across West, Central, East.',
    assignments: [
      { rep_id: 'rep-001', rep_name: 'Sarah Chen', territory: 'West', accounts: ['acc-002', 'acc-009'], account_count: 2, pipeline_value: 1_850_000, capacity_score: 42, avg_account_score: 67 },
      { rep_id: 'rep-002', rep_name: 'Marcus Johnson', territory: 'Central', accounts: ['acc-001', 'acc-007'], account_count: 2, pipeline_value: 920_000, capacity_score: 65, avg_account_score: 80 },
      { rep_id: 'rep-003', rep_name: 'Priya Patel', territory: 'East', accounts: ['acc-004', 'acc-006', 'acc-010'], account_count: 3, pipeline_value: 410_000, capacity_score: 82, avg_account_score: 56 },
      { rep_id: 'rep-004', rep_name: 'David Kim', territory: 'West', accounts: ['acc-003', 'acc-005'], account_count: 2, pipeline_value: 2_340_000, capacity_score: 38, avg_account_score: 74 },
    ],
    stats: { total_accounts: 9, total_pipeline: 5_520_000, avg_score: 66, balance_score: 72 },
  },
  {
    id: 'tv-002',
    name: 'Vertical Pod Experiment',
    branch: 'feature/vertical-pods',
    status: 'draft',
    created_at: '2026-03-25T00:00:00Z',
    created_by: 'RevOps',
    description: 'What if we organize by vertical instead of geography? Move healthcare/insurance to Marcus, SaaS/FinTech to Sarah, Manufacturing/Logistics to David, E-commerce/AdTech to Priya.',
    assignments: [
      { rep_id: 'rep-001', rep_name: 'Sarah Chen', territory: 'SaaS/FinTech', accounts: ['acc-002', 'acc-004', 'acc-008'], account_count: 3, pipeline_value: 1_850_000, capacity_score: 55, avg_account_score: 85 },
      { rep_id: 'rep-002', rep_name: 'Marcus Johnson', territory: 'Healthcare/Insurance', accounts: ['acc-001', 'acc-007'], account_count: 2, pipeline_value: 920_000, capacity_score: 70, avg_account_score: 80 },
      { rep_id: 'rep-003', rep_name: 'Priya Patel', territory: 'E-commerce/AdTech', accounts: ['acc-006', 'acc-010'], account_count: 2, pipeline_value: 410_000, capacity_score: 88, avg_account_score: 42 },
      { rep_id: 'rep-004', rep_name: 'David Kim', territory: 'Manufacturing/Logistics', accounts: ['acc-003', 'acc-005', 'acc-009'], account_count: 3, pipeline_value: 2_340_000, capacity_score: 30, avg_account_score: 64 },
    ],
    stats: { total_accounts: 10, total_pipeline: 5_520_000, avg_score: 70, balance_score: 81 },
  },
  {
    id: 'tv-003',
    name: 'Add 5th Rep (East Expansion)',
    branch: 'feature/east-expansion',
    status: 'draft',
    created_at: '2026-03-28T00:00:00Z',
    created_by: 'RevOps',
    description: 'Model adding a new rep to handle East coast accounts — redistributes from Priya and Marcus to reduce overload.',
    assignments: [
      { rep_id: 'rep-001', rep_name: 'Sarah Chen', territory: 'West', accounts: ['acc-002'], account_count: 1, pipeline_value: 1_850_000, capacity_score: 55, avg_account_score: 88 },
      { rep_id: 'rep-002', rep_name: 'Marcus Johnson', territory: 'Central', accounts: ['acc-001'], account_count: 1, pipeline_value: 920_000, capacity_score: 80, avg_account_score: 92 },
      { rep_id: 'rep-003', rep_name: 'Priya Patel', territory: 'East (North)', accounts: ['acc-004', 'acc-008'], account_count: 2, pipeline_value: 410_000, capacity_score: 75, avg_account_score: 84 },
      { rep_id: 'rep-004', rep_name: 'David Kim', territory: 'West', accounts: ['acc-003', 'acc-005'], account_count: 2, pipeline_value: 2_340_000, capacity_score: 38, avg_account_score: 74 },
      { rep_id: 'rep-005', rep_name: 'New Hire (TBD)', territory: 'East (South)', accounts: ['acc-006', 'acc-007', 'acc-010'], account_count: 3, pipeline_value: 0, capacity_score: 100, avg_account_score: 51 },
    ],
    stats: { total_accounts: 9, total_pipeline: 5_520_000, avg_score: 72, balance_score: 88 },
  },
  {
    id: 'tv-004',
    name: 'Q1 2026 Plan',
    branch: 'archive/q1-2026',
    status: 'archived',
    created_at: '2025-12-15T00:00:00Z',
    created_by: 'RevOps',
    description: 'Previous quarter territory structure. Replaced by Q2 plan.',
    assignments: [
      { rep_id: 'rep-001', rep_name: 'Sarah Chen', territory: 'West', accounts: ['acc-002', 'acc-009'], account_count: 2, pipeline_value: 1_600_000, capacity_score: 50, avg_account_score: 60 },
      { rep_id: 'rep-002', rep_name: 'Marcus Johnson', territory: 'Central', accounts: ['acc-001', 'acc-007'], account_count: 2, pipeline_value: 750_000, capacity_score: 70, avg_account_score: 72 },
      { rep_id: 'rep-004', rep_name: 'David Kim', territory: 'West', accounts: ['acc-003', 'acc-005'], account_count: 2, pipeline_value: 2_100_000, capacity_score: 45, avg_account_score: 68 },
    ],
    stats: { total_accounts: 6, total_pipeline: 4_450_000, avg_score: 65, balance_score: 68 },
  },
];

export interface TerritoryDiff {
  added: { account: string; to_rep: string }[];
  removed: { account: string; from_rep: string }[];
  moved: { account: string; from_rep: string; to_rep: string }[];
  balance_delta: number;
}

export function compareTerritoryVersions(a: TerritoryVersion, b: TerritoryVersion): TerritoryDiff {
  const aMap = new Map<string, string>();
  const bMap = new Map<string, string>();

  for (const assignment of a.assignments) {
    for (const acc of assignment.accounts) {
      aMap.set(acc, assignment.rep_name);
    }
  }
  for (const assignment of b.assignments) {
    for (const acc of assignment.accounts) {
      bMap.set(acc, assignment.rep_name);
    }
  }

  const added: TerritoryDiff['added'] = [];
  const removed: TerritoryDiff['removed'] = [];
  const moved: TerritoryDiff['moved'] = [];

  for (const [acc, rep] of bMap) {
    if (!aMap.has(acc)) {
      added.push({ account: acc, to_rep: rep });
    } else if (aMap.get(acc) !== rep) {
      moved.push({ account: acc, from_rep: aMap.get(acc)!, to_rep: rep });
    }
  }
  for (const [acc, rep] of aMap) {
    if (!bMap.has(acc)) {
      removed.push({ account: acc, from_rep: rep });
    }
  }

  return {
    added,
    removed,
    moved,
    balance_delta: b.stats.balance_score - a.stats.balance_score,
  };
}
