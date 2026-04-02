import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Briefcase, Clock } from 'lucide-react';
import { ScoreBadge } from '@/components/shared/score-badge';
import {
  mockReps,
  mockAccounts,
  mockAccountScores,
  mockOpportunities,
  mockRecommendations,
} from '@/lib/mock-data';

export function RepDetail() {
  const { id } = useParams<{ id: string }>();
  const rep = mockReps.find(r => r.id === id);
  const repAccounts = mockAccounts.filter(a => a.owner_rep_id === id);
  const repOpps = mockOpportunities.filter(o => o.rep_id === id);
  const repRecs = mockRecommendations.filter(r => r.current_rep_id === id || r.recommended_rep_id === id);

  if (!rep) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Rep not found.</p>
        <Link to="/app/reps" className="text-blue-600 text-sm mt-2 inline-block">← Back to Reps</Link>
      </div>
    );
  }

  const wonOpps = repOpps.filter(o => o.status === 'won');
  const lostOpps = repOpps.filter(o => o.status === 'lost');
  const openOpps = repOpps.filter(o => o.status === 'open');
  const winRate = wonOpps.length + lostOpps.length > 0
    ? Math.round((wonOpps.length / (wonOpps.length + lostOpps.length)) * 100)
    : 0;
  const totalWonRevenue = wonOpps.reduce((s, o) => s + (o.amount ?? 0), 0);
  const avgDealSize = wonOpps.length > 0 ? totalWonRevenue / wonOpps.length : 0;

  const rampColors = {
    veteran: 'bg-green-100 text-green-700',
    ramped: 'bg-blue-100 text-blue-700',
    ramping: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/reps" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Reps
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-lg font-bold">
                {rep.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{rep.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{rep.email}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{rep.role ?? 'Account Executive'}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{rep.tenure_months} months</span>
                </div>
              </div>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${rampColors[rep.ramp_status]}`}>
            {rep.ramp_status}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Segment</p>
          <p className="text-lg font-bold text-gray-900 capitalize">{rep.segment}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Territory</p>
          <p className="text-lg font-bold text-gray-900">{rep.territory ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Active Accounts</p>
          <p className="text-lg font-bold text-gray-900">{repAccounts.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Pipeline</p>
          <p className="text-lg font-bold text-gray-900">${(rep.pipeline_value / 1_000_000).toFixed(1)}M</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className={`text-lg font-bold ${winRate >= 50 ? 'text-green-600' : winRate >= 30 ? 'text-amber-600' : 'text-gray-900'}`}>{winRate}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Capacity</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2.5 flex-1 rounded-full bg-gray-200">
              <div
                className={`h-2.5 rounded-full ${rep.capacity_score > 60 ? 'bg-green-500' : rep.capacity_score > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${rep.capacity_score}%` }}
              />
            </div>
            <span className="text-lg font-bold text-gray-900">{rep.capacity_score}%</span>
          </div>
        </div>
      </div>

      {/* Verticals */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Verticals:</span>
        {rep.verticals.map(v => (
          <span key={v} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{v}</span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Accounts */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Accounts ({repAccounts.length})</h2>
          {repAccounts.length === 0 ? (
            <p className="text-sm text-gray-500">No accounts assigned.</p>
          ) : (
            <div className="space-y-2">
              {repAccounts.map(account => {
                const score = mockAccountScores.find(s => s.account_id === account.id);
                return (
                  <Link
                    key={account.id}
                    to={`/app/accounts/${account.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{account.name}</p>
                      <p className="text-xs text-gray-500">{account.industry} · {account.employee_count?.toLocaleString()} emp</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {account.last_activity_at && (
                        <span className="text-xs text-gray-400">
                          {Math.floor((Date.now() - new Date(account.last_activity_at).getTime()) / 86400000)}d ago
                        </span>
                      )}
                      {score && <ScoreBadge score={score.total_score} size="sm" />}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Performance */}
        <div className="space-y-4">
          {/* Deal History */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deal History</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{wonOpps.length}</p>
                <p className="text-xs text-green-700">Won</p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{lostOpps.length}</p>
                <p className="text-xs text-red-700">Lost</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{openOpps.length}</p>
                <p className="text-xs text-blue-700">Open</p>
              </div>
            </div>
            {avgDealSize > 0 && (
              <p className="text-sm text-gray-500">Avg deal size: <span className="font-medium text-gray-900">${(avgDealSize / 1000).toFixed(0)}K</span></p>
            )}

            {repOpps.length > 0 && (
              <div className="mt-4 space-y-2">
                {repOpps.map(opp => (
                  <div key={opp.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{opp.name}</p>
                      <p className="text-xs text-gray-500">{opp.stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{opp.amount ? `$${(opp.amount / 1000).toFixed(0)}K` : '—'}</p>
                      <span className={`text-xs font-medium ${
                        opp.status === 'won' ? 'text-green-600' : opp.status === 'lost' ? 'text-red-600' : 'text-blue-600'
                      }`}>{opp.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Recommendations */}
          {repRecs.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Recommendations</h2>
              <div className="space-y-2">
                {repRecs.map(rec => {
                  const account = mockAccounts.find(a => a.id === rec.account_id);
                  const isIncoming = rec.recommended_rep_id === id;
                  return (
                    <div key={rec.id} className="rounded-lg border border-gray-100 px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          rec.type === 'REASSIGN' ? 'bg-purple-100 text-purple-700' :
                          rec.type === 'RE_ENGAGE' ? 'bg-orange-100 text-orange-700' :
                          rec.type === 'RETIRE' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{rec.type.replace('_', ' ')}</span>
                        <span className="text-xs text-gray-400">{isIncoming ? '← incoming' : '→ outgoing'}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{account?.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{rec.reasoning}</p>
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
