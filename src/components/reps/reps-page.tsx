import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { ScoreBadge } from '@/components/shared/score-badge';
import { mockReps, mockAccounts, mockAccountScores } from '@/lib/mock-data';

export function RepsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reps"
        description={`${mockReps.length} active sales reps`}
      />

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3">Rep</th>
                <th className="px-5 py-3">Segment</th>
                <th className="px-5 py-3">Territory</th>
                <th className="px-5 py-3">Verticals</th>
                <th className="px-5 py-3">Active Accounts</th>
                <th className="px-5 py-3">Avg Score</th>
                <th className="px-5 py-3">Pipeline</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReps.map(rep => {
                const repAccounts = mockAccounts.filter(a => a.owner_rep_id === rep.id);
                const repScores = mockAccountScores.filter(s =>
                  repAccounts.some(a => a.id === s.account_id)
                );
                const avgScore = repScores.length > 0
                  ? Math.round(repScores.reduce((s, a) => s + a.total_score, 0) / repScores.length)
                  : 0;

                const capacityColor =
                  rep.capacity_score > 60 ? 'text-green-600' :
                  rep.capacity_score > 30 ? 'text-amber-600' :
                  'text-red-600';

                const rampColors = {
                  veteran: 'bg-green-100 text-green-700',
                  ramped: 'bg-blue-100 text-blue-700',
                  ramping: 'bg-amber-100 text-amber-700',
                };

                return (
                  <tr key={rep.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/app/reps/${rep.id}`} className="block">
                        <p className="font-medium text-blue-600 hover:text-blue-700">{rep.name}</p>
                        <p className="text-xs text-gray-400">{rep.email}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
                        {rep.segment}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{rep.territory ?? '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {rep.verticals.map(v => (
                          <span key={v} className="rounded bg-gray-50 px-1.5 py-0.5 text-xs text-gray-500">
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{repAccounts.length}</td>
                    <td className="px-5 py-3">
                      {avgScore > 0 ? <ScoreBadge score={avgScore} size="sm" /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-medium">
                      ${(rep.pipeline_value / 1_000_000).toFixed(1)}M
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${rep.capacity_score > 60 ? 'bg-green-500' : rep.capacity_score > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${rep.capacity_score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${capacityColor}`}>
                          {rep.capacity_score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${rampColors[rep.ramp_status]}`}>
                        {rep.ramp_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
