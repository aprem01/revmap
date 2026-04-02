import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/shared/page-header';
import { ScoreBadge } from '@/components/shared/score-badge';
import { mockAccounts, mockAccountScores, getRepById } from '@/lib/mock-data';

export function AccountsPage() {
  const [search, setSearch] = useState('');

  const scoreMap = new Map(mockAccountScores.map(s => [s.account_id, s]));

  const filtered = mockAccounts
    .filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.industry?.toLowerCase().includes(search.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      const scoreA = scoreMap.get(a.id)?.total_score ?? 0;
      const scoreB = scoreMap.get(b.id)?.total_score ?? 0;
      return scoreB - scoreA;
    });

  function daysSince(date: string | null): string {
    if (!date) return '—';
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days}d ago`;
  }

  function formatRevenue(rev: number | null): string {
    if (!rev) return '—';
    if (rev >= 1_000_000_000) return `$${(rev / 1_000_000_000).toFixed(1)}B`;
    if (rev >= 1_000_000) return `$${(rev / 1_000_000).toFixed(0)}M`;
    return `$${(rev / 1_000).toFixed(0)}K`;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description={`${mockAccounts.length} accounts scored against your ICP model`}
      />

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <input
            type="text"
            placeholder="Search accounts by name or industry..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3">Industry</th>
                <th className="px-5 py-3">Employees</th>
                <th className="px-5 py-3">Revenue</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(account => {
                const score = scoreMap.get(account.id);
                const rep = account.owner_rep_id ? getRepById(account.owner_rep_id) : null;
                return (
                  <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-5 py-3">
                      <Link to={`/app/accounts/${account.id}`} className="block">
                        <p className="font-medium text-blue-600 hover:text-blue-700">{account.name}</p>
                        <p className="text-xs text-gray-400">{account.city}, {account.state}</p>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{account.industry ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{account.employee_count?.toLocaleString() ?? '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{formatRevenue(account.annual_revenue)}</td>
                    <td className="px-5 py-3">
                      {score ? <ScoreBadge score={score.total_score} size="sm" /> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{rep?.name ?? <span className="text-amber-600 text-xs font-medium">Unassigned</span>}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{daysSince(account.last_activity_at)}</td>
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
