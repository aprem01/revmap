import { useState } from 'react';
import { FlaskConical, Plus, Play, RotateCcw, Users, Building2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';

interface Scenario {
  id: string;
  name: string;
  description: string;
  changes: ScenarioChange[];
  status: 'draft' | 'simulated';
  result: ScenarioResult | null;
}

interface ScenarioChange {
  type: 'add_rep' | 'remove_rep' | 'move_accounts' | 'create_pod';
  description: string;
  details: Record<string, string>;
}

interface ScenarioResult {
  balance_score_before: number;
  balance_score_after: number;
  coverage_gaps_before: number;
  coverage_gaps_after: number;
  avg_capacity_before: number;
  avg_capacity_after: number;
  rep_impacts: { rep_name: string; accounts_before: number; accounts_after: number; capacity_before: number; capacity_after: number }[];
  warnings: string[];
}

const mockScenarios: Scenario[] = [
  {
    id: 'sc-001',
    name: 'Add East Coast Rep',
    description: 'Hire a new mid-market AE to handle East Coast accounts and reduce Priya\'s load.',
    changes: [
      { type: 'add_rep', description: 'Add new rep: Alex Torres (Mid-Market, East)', details: { name: 'Alex Torres', segment: 'mid-market', territory: 'East' } },
      { type: 'move_accounts', description: 'Move Vela Commerce & PulsePoint Media to Alex Torres', details: { accounts: 'Vela Commerce, PulsePoint Media', from: 'Priya Patel', to: 'Alex Torres' } },
    ],
    status: 'simulated',
    result: {
      balance_score_before: 72,
      balance_score_after: 86,
      coverage_gaps_before: 3,
      coverage_gaps_after: 1,
      avg_capacity_before: 57,
      avg_capacity_after: 68,
      rep_impacts: [
        { rep_name: 'Sarah Chen', accounts_before: 2, accounts_after: 2, capacity_before: 42, capacity_after: 42 },
        { rep_name: 'Marcus Johnson', accounts_before: 2, accounts_after: 2, capacity_before: 65, capacity_after: 65 },
        { rep_name: 'Priya Patel', accounts_before: 3, accounts_after: 1, capacity_before: 82, capacity_after: 90 },
        { rep_name: 'David Kim', accounts_before: 2, accounts_after: 2, capacity_before: 38, capacity_after: 38 },
        { rep_name: 'Alex Torres (New)', accounts_before: 0, accounts_after: 2, capacity_before: 100, capacity_after: 85 },
      ],
      warnings: ['Alex Torres is a new hire — ramp period expected (3-6 months)', 'PulsePoint Media scores 22/100 — consider retiring instead of reassigning'],
    },
  },
  {
    id: 'sc-002',
    name: 'Vertical Pod Structure',
    description: 'Reorganize from geography-based territories to vertical-based pods: SaaS/FinTech, Healthcare/Insurance, Manufacturing/Logistics.',
    changes: [
      { type: 'create_pod', description: 'Create SaaS/FinTech pod → Sarah Chen', details: { pod: 'SaaS/FinTech', rep: 'Sarah Chen' } },
      { type: 'create_pod', description: 'Create Healthcare/Insurance pod → Marcus Johnson', details: { pod: 'Healthcare/Insurance', rep: 'Marcus Johnson' } },
      { type: 'create_pod', description: 'Create Manufacturing/Logistics pod → David Kim', details: { pod: 'Manufacturing/Logistics', rep: 'David Kim' } },
      { type: 'move_accounts', description: 'Move BrightLoop SaaS, Quantum Analytics to Sarah Chen', details: { accounts: 'BrightLoop SaaS, Quantum Analytics', from: 'Priya Patel / Unassigned', to: 'Sarah Chen' } },
      { type: 'move_accounts', description: 'Move TrueNorth Insurance stays with Marcus', details: { accounts: 'TrueNorth Insurance', from: 'Marcus Johnson', to: 'Marcus Johnson' } },
    ],
    status: 'simulated',
    result: {
      balance_score_before: 72,
      balance_score_after: 81,
      coverage_gaps_before: 3,
      coverage_gaps_after: 0,
      avg_capacity_before: 57,
      avg_capacity_after: 52,
      rep_impacts: [
        { rep_name: 'Sarah Chen', accounts_before: 2, accounts_after: 4, capacity_before: 42, capacity_after: 28 },
        { rep_name: 'Marcus Johnson', accounts_before: 2, accounts_after: 2, capacity_before: 65, capacity_after: 60 },
        { rep_name: 'Priya Patel', accounts_before: 3, accounts_after: 2, capacity_before: 82, capacity_after: 88 },
        { rep_name: 'David Kim', accounts_before: 2, accounts_after: 3, capacity_before: 38, capacity_after: 30 },
      ],
      warnings: ['Sarah Chen capacity drops to 28% — risk of overload with 4 accounts', 'David Kim capacity drops to 30% — monitor pipeline closely', 'Priya Patel left with only E-commerce/AdTech — consider expanding scope'],
    },
  },
  {
    id: 'sc-003',
    name: 'Retire Low-Score Accounts',
    description: 'Remove accounts scoring below 30 from active territories to free rep capacity for higher-value targets.',
    changes: [
      { type: 'move_accounts', description: 'Retire PulsePoint Media (score: 22) from Priya Patel', details: { accounts: 'PulsePoint Media', from: 'Priya Patel', to: 'Retired' } },
      { type: 'move_accounts', description: 'Assign Quantum Analytics (score: 82, unassigned) to Priya Patel', details: { accounts: 'Quantum Analytics', from: 'Unassigned', to: 'Priya Patel' } },
    ],
    status: 'simulated',
    result: {
      balance_score_before: 72,
      balance_score_after: 78,
      coverage_gaps_before: 3,
      coverage_gaps_after: 2,
      avg_capacity_before: 57,
      avg_capacity_after: 60,
      rep_impacts: [
        { rep_name: 'Sarah Chen', accounts_before: 2, accounts_after: 2, capacity_before: 42, capacity_after: 42 },
        { rep_name: 'Marcus Johnson', accounts_before: 2, accounts_after: 2, capacity_before: 65, capacity_after: 65 },
        { rep_name: 'Priya Patel', accounts_before: 3, accounts_after: 3, capacity_before: 82, capacity_after: 75 },
        { rep_name: 'David Kim', accounts_before: 2, accounts_after: 2, capacity_before: 38, capacity_after: 38 },
      ],
      warnings: ['Net account count stays at 9 (1 retired, 1 assigned)', 'Greenfield Energy (score: 45) is next candidate for retirement'],
    },
  },
];

export function ScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(mockScenarios[0]!);
  const [showCreate, setShowCreate] = useState(false);

  const result = selectedScenario.result;

  return (
    <div className="space-y-6">
      <PageHeader
        title="What-If Scenarios"
        description="Model territory changes before committing them to Salesforce"
        actions={
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Scenario
          </button>
        }
      />

      {/* New Scenario Form */}
      {showCreate && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Create New Scenario</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Scenario Name</label>
              <input type="text" placeholder="e.g., Q3 Territory Rebalance" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input type="text" placeholder="What are you modeling?" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Changes to Model</label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Users className="h-4 w-4 text-blue-500" /> Add Rep
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Building2 className="h-4 w-4 text-purple-500" /> Move Accounts
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <FlaskConical className="h-4 w-4 text-emerald-500" /> Create Pod
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <RotateCcw className="h-4 w-4 text-red-500" /> Retire Accounts
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Play className="h-4 w-4" /> Run Simulation
            </button>
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Scenario List */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Scenarios</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {mockScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`w-full px-5 py-4 text-left transition-colors ${selectedScenario.id === scenario.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{scenario.name}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${scenario.status === 'simulated' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {scenario.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedScenario.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedScenario.description}</p>
              </div>
              {selectedScenario.status === 'simulated' && (
                <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                  Apply to Salesforce
                </button>
              )}
            </div>

            {/* Changes */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</p>
              {selectedScenario.changes.map((change, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium ${
                    change.type === 'add_rep' ? 'bg-green-100 text-green-700' :
                    change.type === 'remove_rep' ? 'bg-red-100 text-red-700' :
                    change.type === 'move_accounts' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {change.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-700">{change.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Before/After Comparison */}
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Projected Impact</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-500 mb-2">Balance Score</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">{result.balance_score_before}</span>
                      <span className="text-gray-300">→</span>
                      <span className={`text-lg font-bold ${result.balance_score_after > result.balance_score_before ? 'text-green-600' : 'text-red-600'}`}>
                        {result.balance_score_after}
                      </span>
                      <span className={`text-xs font-medium ${result.balance_score_after > result.balance_score_before ? 'text-green-600' : 'text-red-600'}`}>
                        ({result.balance_score_after > result.balance_score_before ? '+' : ''}{result.balance_score_after - result.balance_score_before})
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-500 mb-2">Coverage Gaps</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">{result.coverage_gaps_before}</span>
                      <span className="text-gray-300">→</span>
                      <span className={`text-lg font-bold ${result.coverage_gaps_after < result.coverage_gaps_before ? 'text-green-600' : 'text-red-600'}`}>
                        {result.coverage_gaps_after}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-500 mb-2">Avg Capacity</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-400">{result.avg_capacity_before}%</span>
                      <span className="text-gray-300">→</span>
                      <span className={`text-lg font-bold ${result.avg_capacity_after > result.avg_capacity_before ? 'text-green-600' : 'text-amber-600'}`}>
                        {result.avg_capacity_after}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rep Impact Table */}
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-5 py-3">
                  <h3 className="text-sm font-semibold text-gray-900">Rep Impact</h3>
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
                      <th className="px-5 py-3">Rep</th>
                      <th className="px-5 py-3">Accounts (Before → After)</th>
                      <th className="px-5 py-3">Capacity (Before → After)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rep_impacts.map(impact => {
                      const accountDelta = impact.accounts_after - impact.accounts_before;
                      const capacityDelta = impact.capacity_after - impact.capacity_before;
                      return (
                        <tr key={impact.rep_name} className="border-b border-gray-100">
                          <td className="px-5 py-3 font-medium text-gray-900">{impact.rep_name}</td>
                          <td className="px-5 py-3">
                            <span className="text-gray-400">{impact.accounts_before}</span>
                            <span className="text-gray-300 mx-1">→</span>
                            <span className="font-medium text-gray-900">{impact.accounts_after}</span>
                            {accountDelta !== 0 && (
                              <span className={`ml-2 text-xs font-medium ${accountDelta > 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                                ({accountDelta > 0 ? '+' : ''}{accountDelta})
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">{impact.capacity_before}%</span>
                              <span className="text-gray-300">→</span>
                              <span className="font-medium text-gray-900">{impact.capacity_after}%</span>
                              {capacityDelta !== 0 && (
                                <span className={`text-xs font-medium ${capacityDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  ({capacityDelta > 0 ? '+' : ''}{capacityDelta})
                                </span>
                              )}
                              <div className="h-2 w-16 rounded-full bg-gray-200 ml-2">
                                <div
                                  className={`h-2 rounded-full ${impact.capacity_after > 60 ? 'bg-green-500' : impact.capacity_after > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${impact.capacity_after}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Warnings
                  </h3>
                  <ul className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
