import { Building2, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { ScoreBadge } from '@/components/shared/score-badge';
import { TypePill } from '@/components/shared/status-pill';
import {
  mockAccounts,
  mockReps,
  mockRecommendations,
  mockAccountScores,
  getAccountById,
  getRepById,
} from '@/lib/mock-data';

const pendingRecs = mockRecommendations.filter(r => r.status === 'pending');
const avgScore = Math.round(
  mockAccountScores.reduce((s, a) => s + a.total_score, 0) / mockAccountScores.length
);
const topScored = [...mockAccountScores]
  .sort((a, b) => b.total_score - a.total_score)
  .slice(0, 5);

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Territory intelligence overview"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Accounts"
          value={mockAccounts.length}
          change="+2 this week"
          changeType="positive"
          icon={Building2}
        />
        <StatCard
          label="Active Reps"
          value={mockReps.length}
          icon={Users}
        />
        <StatCard
          label="Pending Recommendations"
          value={pendingRecs.length}
          change="5 new"
          changeType="neutral"
          icon={Lightbulb}
        />
        <StatCard
          label="Avg Account Score"
          value={`${avgScore}/100`}
          change="+3 vs last sync"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Scored Accounts */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Scored Accounts</h2>
          <div className="space-y-3">
            {topScored.map(score => {
              const account = getAccountById(score.account_id);
              const rep = account?.owner_rep_id ? getRepById(account.owner_rep_id) : null;
              return (
                <div key={score.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                      {account?.industry} · {account?.employee_count?.toLocaleString()} employees
                      {rep ? ` · ${rep.name}` : ' · Unassigned'}
                    </p>
                  </div>
                  <ScoreBadge score={score.total_score} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Recommendations */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Recommendations</h2>
          <div className="space-y-3">
            {pendingRecs.slice(0, 5).map(rec => {
              const account = getAccountById(rec.account_id);
              return (
                <div key={rec.id} className="rounded-lg border border-gray-100 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TypePill type={rec.type} />
                    <ScoreBadge score={rec.confidence_score} size="sm" label="conf" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{account?.name ?? 'Unknown'}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rec.reasoning}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Territory Health */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Territory Health</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockReps.map(rep => {
            const repAccounts = mockAccounts.filter(a => a.owner_rep_id === rep.id);
            const repScores = mockAccountScores.filter(s =>
              repAccounts.some(a => a.id === s.account_id)
            );
            const repAvg = repScores.length > 0
              ? Math.round(repScores.reduce((s, a) => s + a.total_score, 0) / repScores.length)
              : 0;
            return (
              <div key={rep.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{rep.name}</p>
                  <span className="text-xs text-gray-500">{rep.territory}</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Accounts</span>
                    <span className="font-medium">{repAccounts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Score</span>
                    <span className="font-medium">{repAvg}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity</span>
                    <span className={`font-medium ${rep.capacity_score > 60 ? 'text-green-600' : rep.capacity_score > 30 ? 'text-amber-600' : 'text-red-600'}`}>
                      {rep.capacity_score}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pipeline</span>
                    <span className="font-medium">${(rep.pipeline_value / 1_000_000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
