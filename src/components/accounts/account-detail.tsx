import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { ScoreBadge } from '@/components/shared/score-badge';
import {
  mockAccounts,
  mockAccountScores,
  mockReps,
  mockRecommendations,
  mockOpportunities,
  getRepById,
} from '@/lib/mock-data';
import { mockRepAccountFit } from '@/lib/mock-data';

export function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const account = mockAccounts.find(a => a.id === id);
  const score = mockAccountScores.find(s => s.account_id === id);
  const owner = account?.owner_rep_id ? getRepById(account.owner_rep_id) : null;
  const recs = mockRecommendations.filter(r => r.account_id === id);
  const opps = mockOpportunities.filter(o => o.account_id === id);
  const fitScores = mockRepAccountFit.filter(f => f.account_id === id);

  if (!account) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Account not found.</p>
        <Link to="/app/accounts" className="text-blue-600 text-sm mt-2 inline-block">← Back to Accounts</Link>
      </div>
    );
  }

  function daysSince(date: string | null): string {
    if (!date) return 'Never';
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/app/accounts" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="h-4 w-4" /> Back to Accounts
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{account.name}</h1>
              {score && <ScoreBadge score={score.total_score} size="lg" />}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{account.industry}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{account.city}, {account.state}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Last activity: {daysSince(account.last_activity_at)}</span>
            </div>
          </div>
          {account.website && (
            <a href={account.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <ExternalLink className="h-4 w-4" /> Website
            </a>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Employees</p>
          <p className="text-xl font-bold text-gray-900">{account.employee_count?.toLocaleString() ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Annual Revenue</p>
          <p className="text-xl font-bold text-gray-900">
            {account.annual_revenue ? `$${(account.annual_revenue / 1_000_000).toFixed(0)}M` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Owner</p>
          <p className="text-xl font-bold text-gray-900">{owner?.name ?? <span className="text-amber-600 text-base">Unassigned</span>}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">CRM Source</p>
          <p className="text-xl font-bold text-gray-900 capitalize">{account.crm_source}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Tech Stack</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {account.tech_stack.map(t => (
              <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Score Breakdown */}
        {score && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Score Breakdown
            </h2>
            <p className="text-sm text-gray-600 mb-4">{score.explanation.summary}</p>

            <div className="space-y-3">
              {Object.entries(score.components).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-medium text-gray-900">{value}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-amber-500' : value > 0 ? 'bg-red-400' : 'bg-gray-200'}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {score.explanation.drivers.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Key Drivers</p>
                {score.explanation.drivers.map((driver, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <span className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      driver.impact === 'high' ? 'bg-blue-100 text-blue-700' :
                      driver.impact === 'medium' ? 'bg-gray-100 text-gray-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {driver.impact}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{driver.signal}</p>
                      <p className="text-xs text-gray-500">{driver.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rep Fit Scores + Recommendations */}
        <div className="space-y-4">
          {/* Rep Fit */}
          {fitScores.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rep Fit Scores</h2>
              <div className="space-y-3">
                {fitScores.map(fit => {
                  const rep = mockReps.find(r => r.id === fit.rep_id);
                  return (
                    <div key={fit.id} className="rounded-lg border border-gray-100 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <Link to={`/app/reps/${fit.rep_id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          {rep?.name ?? fit.rep_id}
                        </Link>
                        <ScoreBadge score={fit.fit_score} size="sm" label="fit" />
                      </div>
                      <p className="text-xs text-gray-500">{fit.rationale}</p>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        {Object.entries(fit.factors).map(([key, val]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {opps.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Opportunities</h2>
              <div className="space-y-2">
                {opps.map(opp => (
                  <div key={opp.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{opp.name}</p>
                      <p className="text-xs text-gray-500">{opp.stage} · {opp.deal_size_bucket}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{opp.amount ? `$${(opp.amount / 1000).toFixed(0)}K` : '—'}</p>
                      <span className={`text-xs font-medium ${
                        opp.status === 'won' ? 'text-green-600' :
                        opp.status === 'lost' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {opp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
              <div className="space-y-2">
                {recs.map(rec => (
                  <div key={rec.id} className="rounded-lg border border-gray-100 px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        rec.type === 'REASSIGN' ? 'bg-purple-100 text-purple-700' :
                        rec.type === 'RE_ENGAGE' ? 'bg-orange-100 text-orange-700' :
                        rec.type === 'RETIRE' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {rec.type.replace('_', ' ')}
                      </span>
                      <span className={`text-xs ${rec.status === 'approved' ? 'text-green-600' : rec.status === 'pending' ? 'text-amber-600' : 'text-gray-400'}`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
