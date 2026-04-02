import { PageHeader } from '@/components/shared/page-header';
import { ScoreBadge } from '@/components/shared/score-badge';
import { mockReps, mockAccounts, mockAccountScores, mockICPModel } from '@/lib/mock-data';

export function TerritoriesPage() {
  const territories = [...new Set(mockReps.map(r => r.territory).filter(Boolean))] as string[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Territories"
        description="Territory balance, coverage, and assignment overview"
      />

      {/* ICP Summary */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">ICP Profile (v{mockICPModel.version})</h2>
        <p className="text-sm text-gray-700 leading-relaxed">{mockICPModel.narrative}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {mockICPModel.attributes.industries.map(ind => (
            <span key={ind.value} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
              {ind.value} ({ind.weight})
            </span>
          ))}
        </div>
      </div>

      {/* Territory Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {territories.map(territory => {
          const reps = mockReps.filter(r => r.territory === territory);
          const accounts = mockAccounts.filter(a =>
            reps.some(r => r.id === a.owner_rep_id)
          );
          const scores = mockAccountScores.filter(s =>
            accounts.some(a => a.id === s.account_id)
          );
          const avgScore = scores.length > 0
            ? Math.round(scores.reduce((s, a) => s + a.total_score, 0) / scores.length)
            : 0;
          const totalPipeline = reps.reduce((s, r) => s + r.pipeline_value, 0);
          const avgCapacity = Math.round(reps.reduce((s, r) => s + r.capacity_score, 0) / reps.length);

          const staleAccounts = accounts.filter(a => {
            if (!a.last_activity_at) return true;
            const days = Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000);
            return days > 60;
          });

          return (
            <div key={territory} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{territory}</h3>
                <ScoreBadge score={avgScore} label="avg" />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Reps</span>
                  <span className="font-medium">{reps.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Accounts</span>
                  <span className="font-medium">{accounts.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pipeline</span>
                  <span className="font-medium">${(totalPipeline / 1_000_000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Avg Capacity</span>
                  <span className={`font-medium ${avgCapacity > 60 ? 'text-green-600' : avgCapacity > 30 ? 'text-amber-600' : 'text-red-600'}`}>
                    {avgCapacity}%
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Stale Accounts</span>
                  <span className={`font-medium ${staleAccounts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {staleAccounts.length}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Reps</p>
                {reps.map(rep => (
                  <div key={rep.id} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-700">{rep.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 rounded-full bg-gray-200">
                        <div
                          className={`h-1.5 rounded-full ${rep.capacity_score > 60 ? 'bg-green-500' : rep.capacity_score > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${rep.capacity_score}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{rep.capacity_score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Unassigned */}
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unassigned</h3>
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
            {mockAccounts.filter(a => !a.owner_rep_id).length === 0 && (
              <p className="text-sm text-gray-500">All accounts are assigned.</p>
            )}
          </div>
        </div>
      </div>

      {/* Coverage Gaps */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Coverage Gaps</h2>
        <div className="space-y-2">
          {mockAccounts.filter(a => {
            if (!a.last_activity_at) return false;
            const days = Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000);
            return days > 60 && a.owner_rep_id;
          }).map(account => {
            const score = mockAccountScores.find(s => s.account_id === account.id);
            const days = Math.floor((Date.now() - new Date(account.last_activity_at!).getTime()) / 86400000);
            return (
              <div key={account.id} className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{account.name}</p>
                  <p className="text-xs text-red-600">{days} days without activity</p>
                </div>
                {score && <ScoreBadge score={score.total_score} size="sm" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
