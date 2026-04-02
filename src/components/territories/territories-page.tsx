import { useState } from 'react';
import { GitBranch, GitMerge, RotateCcw, Eye, Check, Archive, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ScoreBadge } from '@/components/shared/score-badge';
import { mockAccounts, mockAccountScores, mockICPModel } from '@/lib/mock-data';
import {
  mockTerritoryVersions,
  compareTerritoryVersions,
  type TerritoryVersion,
} from '@/lib/mock-territory-versions';

const statusColors = {
  active: 'bg-green-100 text-green-700 border-green-200',
  draft: 'bg-amber-100 text-amber-700 border-amber-200',
  archived: 'bg-gray-100 text-gray-500 border-gray-200',
};

const statusIcons = {
  active: Check,
  draft: GitBranch,
  archived: Archive,
};

export function TerritoriesPage() {
  const [selectedVersion, setSelectedVersion] = useState<TerritoryVersion>(mockTerritoryVersions[0]!);
  const [compareVersion, setCompareVersion] = useState<TerritoryVersion | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const activeVersion = mockTerritoryVersions.find(v => v.status === 'active')!;
  const diff = compareVersion ? compareTerritoryVersions(activeVersion, compareVersion) : null;

  function getAccountName(id: string) {
    return mockAccounts.find(a => a.id === id)?.name ?? id;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Territories"
        description="Git-style territory versioning — branch, compare, and merge territory plans"
        actions={
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
            <Plus className="h-4 w-4" />
            New Branch
          </button>
        }
      />

      {/* ICP Summary */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-900">ICP Profile v{mockICPModel.version}</h3>
            <p className="mt-1 text-sm text-blue-800 leading-relaxed max-w-3xl">{mockICPModel.narrative}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-6">
            {mockICPModel.attributes.industries.slice(0, 4).map(ind => (
              <span key={ind.value} className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                {ind.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Version List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Territory Versions</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {mockTerritoryVersions.map(version => {
                const StatusIcon = statusIcons[version.status];
                const isSelected = selectedVersion.id === version.id;
                return (
                  <button
                    key={version.id}
                    onClick={() => { setSelectedVersion(version); setShowCompare(false); setCompareVersion(null); }}
                    className={`w-full px-5 py-4 text-left transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{version.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                        {version.branch}
                      </code>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[version.status]}`}>
                        {version.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{version.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Version Detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Version Header */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedVersion.name}</h2>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[selectedVersion.status]}`}>
                    {selectedVersion.status}
                  </span>
                </div>
                <code className="text-xs text-gray-500 font-mono">{selectedVersion.branch}</code>
                <p className="text-sm text-gray-600 mt-2">{selectedVersion.description}</p>
              </div>
              <div className="flex gap-2">
                {selectedVersion.status === 'draft' && (
                  <>
                    <button
                      onClick={() => { setShowCompare(!showCompare); if (!showCompare) setCompareVersion(activeVersion); }}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Compare
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                      <GitMerge className="h-3.5 w-3.5" />
                      Merge
                    </button>
                  </>
                )}
                {selectedVersion.status === 'active' && (
                  <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Rollback
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedVersion.stats.total_accounts}</p>
                <p className="text-xs text-gray-500">Accounts</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">${(selectedVersion.stats.total_pipeline / 1_000_000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500">Pipeline</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedVersion.stats.avg_score}</p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className={`text-2xl font-bold ${selectedVersion.stats.balance_score >= 80 ? 'text-green-600' : selectedVersion.stats.balance_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {selectedVersion.stats.balance_score}
                </p>
                <p className="text-xs text-gray-500">Balance Score</p>
              </div>
            </div>
          </div>

          {/* Compare Diff */}
          {showCompare && diff && (
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
              <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Diff: {activeVersion.name} → {selectedVersion.name}
              </h3>
              <div className="space-y-2">
                {diff.moved.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-mono text-blue-700">moved</span>
                    <span className="font-medium">{getAccountName(m.account)}</span>
                    <span className="text-gray-400">from</span>
                    <span className="text-red-600">{m.from_rep}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600">{m.to_rep}</span>
                  </div>
                ))}
                {diff.added.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-mono text-green-700">added</span>
                    <span className="font-medium">{getAccountName(a.account)}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600">{a.to_rep}</span>
                  </div>
                ))}
                {diff.removed.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-mono text-red-700">removed</span>
                    <span className="font-medium">{getAccountName(r.account)}</span>
                    <span className="text-gray-400">from</span>
                    <span className="text-red-600">{r.from_rep}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-purple-200 flex items-center gap-2 text-sm">
                  <span className="text-purple-700 font-medium">Balance score:</span>
                  <span className={`font-bold ${diff.balance_delta > 0 ? 'text-green-600' : diff.balance_delta < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {diff.balance_delta > 0 ? '+' : ''}{diff.balance_delta} points
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Table */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Assignments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-3">Rep</th>
                    <th className="px-5 py-3">Territory</th>
                    <th className="px-5 py-3">Accounts</th>
                    <th className="px-5 py-3">Pipeline</th>
                    <th className="px-5 py-3">Avg Score</th>
                    <th className="px-5 py-3">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVersion.assignments.map(assignment => (
                    <tr key={assignment.rep_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{assignment.rep_name}</td>
                      <td className="px-5 py-3">
                        <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {assignment.territory}
                        </code>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {assignment.accounts.map(accId => (
                            <span key={accId} className="rounded bg-gray-50 px-1.5 py-0.5 text-xs text-gray-600">
                              {getAccountName(accId)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 font-medium">
                        ${(assignment.pipeline_value / 1_000_000).toFixed(1)}M
                      </td>
                      <td className="px-5 py-3">
                        <ScoreBadge score={assignment.avg_account_score} size="sm" />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-14 rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full ${assignment.capacity_score > 60 ? 'bg-green-500' : assignment.capacity_score > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${assignment.capacity_score}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{assignment.capacity_score}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unassigned Accounts */}
          {mockAccounts.filter(a => !a.owner_rep_id).length > 0 && (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5">
              <h3 className="text-sm font-semibold text-amber-900 mb-3">Unassigned Accounts</h3>
              <div className="space-y-2">
                {mockAccounts.filter(a => !a.owner_rep_id).map(account => {
                  const score = mockAccountScores.find(s => s.account_id === account.id);
                  return (
                    <div key={account.id} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-amber-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{account.name}</p>
                        <p className="text-xs text-gray-500">{account.industry} · {account.employee_count?.toLocaleString()} emp</p>
                      </div>
                      {score && <ScoreBadge score={score.total_score} size="sm" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
