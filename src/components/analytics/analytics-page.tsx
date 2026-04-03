import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, CheckCircle2, XCircle, Clock, Target } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ScoreBadge } from '@/components/shared/score-badge';
import { PredictiveAnalytics } from './predictive-analytics';
import { DataFlywheel } from './flywheel';
import {
  mockAccounts,
  mockReps,
  mockAccountScores,
  mockRecommendations,
  mockOpportunities,
  getRepById,
} from '@/lib/mock-data';

type AnalyticsTab = 'overview' | 'predictive' | 'flywheel';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  // Compute analytics
  const approved = mockRecommendations.filter(r => r.status === 'approved');
  const dismissed = mockRecommendations.filter(r => r.status === 'dismissed');
  const pending = mockRecommendations.filter(r => r.status === 'pending');
  const acceptanceRate = approved.length + dismissed.length > 0
    ? Math.round((approved.length / (approved.length + dismissed.length)) * 100)
    : 0;

  const wonOpps = mockOpportunities.filter(o => o.status === 'won');
  const lostOpps = mockOpportunities.filter(o => o.status === 'lost');
  const winRate = wonOpps.length + lostOpps.length > 0
    ? Math.round((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100)
    : 0;

  const avgScore = mockAccountScores.length > 0
    ? Math.round(mockAccountScores.reduce((s, a) => s + a.total_score, 0) / mockAccountScores.length)
    : 0;

  const staleAccounts = mockAccounts.filter(a => {
    if (!a.last_activity_at) return true;
    return Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000) > 60;
  });

  const unassigned = mockAccounts.filter(a => !a.owner_rep_id);

  const totalPipeline = mockReps.reduce((s, r) => s + r.pipeline_value, 0);
  const totalWonRevenue = wonOpps.reduce((s, o) => s + (o.amount ?? 0), 0);

  // Rep performance
  const repPerformance = mockReps.map(rep => {
    const repOpps = mockOpportunities.filter(o => o.rep_id === rep.id);
    const repWon = repOpps.filter(o => o.status === 'won');
    const repLost = repOpps.filter(o => o.status === 'lost');
    const repWinRate = repWon.length + repLost.length > 0
      ? Math.round((repWon.length / (repWon.length + repLost.length)) * 100)
      : 0;
    const repAccounts = mockAccounts.filter(a => a.owner_rep_id === rep.id);
    const repScores = mockAccountScores.filter(s => repAccounts.some(a => a.id === s.account_id));
    const repAvgScore = repScores.length > 0
      ? Math.round(repScores.reduce((s, a) => s + a.total_score, 0) / repScores.length)
      : 0;
    return { ...rep, winRate: repWinRate, avgScore: repAvgScore, accountCount: repAccounts.length };
  });

  // CSV export
  function exportCSV(data: Record<string, unknown>[], filename: string) {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]!);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reporting"
        description="Territory health, predictions, and the data flywheel"
        actions={
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button
              onClick={() => exportCSV(
                mockAccounts.map(a => ({
                  name: a.name,
                  industry: a.industry,
                  employees: a.employee_count,
                  revenue: a.annual_revenue,
                  score: mockAccountScores.find(s => s.account_id === a.id)?.total_score ?? '',
                  owner: a.owner_rep_id ? getRepById(a.owner_rep_id)?.name : 'Unassigned',
                  last_activity: a.last_activity_at,
                })),
                'revmap-accounts-export.csv'
              )}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {([
          { id: 'overview' as const, label: 'Overview' },
          { id: 'predictive' as const, label: 'Predictive' },
          { id: 'flywheel' as const, label: 'Data Flywheel' },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'predictive' && <PredictiveAnalytics />}
      {activeTab === 'flywheel' && <DataFlywheel />}

      {activeTab === 'overview' && <>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Accounts</p>
          <p className="text-2xl font-bold text-gray-900">{mockAccounts.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Avg Score</p>
          <p className="text-2xl font-bold text-gray-900">{avgScore}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className={`text-2xl font-bold ${winRate >= 50 ? 'text-green-600' : 'text-amber-600'}`}>{winRate}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Pipeline</p>
          <p className="text-2xl font-bold text-gray-900">${(totalPipeline / 1_000_000).toFixed(1)}M</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Won Revenue</p>
          <p className="text-2xl font-bold text-green-600">${(totalWonRevenue / 1_000).toFixed(0)}K</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Acceptance Rate</p>
          <p className="text-2xl font-bold text-gray-900">{acceptanceRate}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Stale Accounts</p>
          <p className={`text-2xl font-bold ${staleAccounts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>{staleAccounts.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Unassigned</p>
          <p className={`text-2xl font-bold ${unassigned.length > 0 ? 'text-amber-600' : 'text-green-600'}`}>{unassigned.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recommendation Performance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendation Performance</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">{approved.length}</p>
              <p className="text-xs text-green-700">Approved</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600">{dismissed.length}</p>
              <p className="text-xs text-red-700">Dismissed</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center">
              <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
              <p className="text-xs text-amber-700">Pending</p>
            </div>
          </div>

          {/* By type breakdown */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">By Type</p>
            {(['REASSIGN', 'RE_ENGAGE', 'ADD_TO_TERRITORY', 'RETIRE', 'REBALANCE'] as const).map(type => {
              const typeRecs = mockRecommendations.filter(r => r.type === type);
              if (typeRecs.length === 0) return null;
              const typeApproved = typeRecs.filter(r => r.status === 'approved').length;
              return (
                <div key={type} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <span className="text-sm text-gray-700">{type.replace(/_/g, ' ')}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{typeRecs.length} total</span>
                    <span className="text-xs text-green-600">{typeApproved} approved</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rep Performance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Rep Performance</h2>
            <button
              onClick={() => exportCSV(
                repPerformance.map(r => ({
                  name: r.name, segment: r.segment, territory: r.territory,
                  accounts: r.accountCount, pipeline: r.pipeline_value,
                  win_rate: `${r.winRate}%`, avg_score: r.avgScore, capacity: `${r.capacity_score}%`,
                })),
                'revmap-rep-performance.csv'
              )}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="pb-2">Rep</th>
                <th className="pb-2">Accounts</th>
                <th className="pb-2">Win Rate</th>
                <th className="pb-2">Avg Score</th>
                <th className="pb-2">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {repPerformance.map(rep => (
                <tr key={rep.id} className="border-t border-gray-100">
                  <td className="py-2 font-medium text-gray-900">{rep.name}</td>
                  <td className="py-2 text-gray-600">{rep.accountCount}</td>
                  <td className="py-2">
                    <span className={`flex items-center gap-1 ${rep.winRate >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
                      {rep.winRate >= 50 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {rep.winRate}%
                    </span>
                  </td>
                  <td className="py-2"><ScoreBadge score={rep.avgScore} size="sm" /></td>
                  <td className="py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-12 rounded-full bg-gray-200">
                        <div
                          className={`h-1.5 rounded-full ${rep.capacity_score > 60 ? 'bg-green-500' : rep.capacity_score > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${rep.capacity_score}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{rep.capacity_score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ICP Accuracy */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            ICP Accuracy Over Time
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accounts scored ≥80 that converted</span>
              <span className="text-sm font-bold text-green-600">67%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accounts scored ≤30 that were retired</span>
              <span className="text-sm font-bold text-green-600">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Score correlation to close rate</span>
              <span className="text-sm font-bold text-blue-600">0.72</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Model version</span>
              <span className="text-sm font-medium text-gray-900">v1 (March 2026)</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Accuracy improves as more recommendations are approved or dismissed. Each action feeds back into the scoring model.
          </p>
        </div>

        {/* Territory Health Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Territory Health</h2>
          <div className="space-y-3">
            {mockReps.map(rep => {
              const repAccts = mockAccounts.filter(a => a.owner_rep_id === rep.id);
              const stale = repAccts.filter(a => {
                if (!a.last_activity_at) return true;
                return Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000) > 60;
              });
              return (
                <div key={rep.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{rep.name}</p>
                    <p className="text-xs text-gray-500">{rep.territory} · {repAccts.length} accounts</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={stale.length > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {stale.length} stale
                    </span>
                    <span className={`font-medium ${rep.capacity_score > 60 ? 'text-green-600' : rep.capacity_score > 30 ? 'text-amber-600' : 'text-red-600'}`}>
                      {rep.capacity_score}% capacity
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </>}
    </div>
  );
}
