import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { RecommendationCard } from './recommendation-card';
import {
  mockRecommendations,
  getAccountById,
  getRepById,
} from '@/lib/mock-data';
import type { RecommendationStatus } from '@/types';

export function RecommendationsPage() {
  const [recs, setRecs] = useState(mockRecommendations);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  const filtered = recs.filter(r => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  function handleApprove(id: string) {
    setRecs(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: 'approved' as RecommendationStatus, acted_at: new Date().toISOString() }
          : r
      )
    );
  }

  function handleDismiss(id: string) {
    setRecs(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: 'dismissed' as RecommendationStatus, acted_at: new Date().toISOString() }
          : r
      )
    );
  }

  function handleSnooze(id: string) {
    setRecs(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, status: 'snoozed' as RecommendationStatus, acted_at: new Date().toISOString() }
          : r
      )
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommendations"
        description="AI-powered territory recommendations. Approve, dismiss, or snooze each action."
        actions={
          <div className="flex items-center gap-2">
            <select
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="all">All types</option>
              <option value="REASSIGN">Reassign</option>
              <option value="RE_ENGAGE">Re-engage</option>
              <option value="ADD_TO_TERRITORY">Add to Territory</option>
              <option value="RETIRE">Retire</option>
              <option value="REBALANCE">Rebalance</option>
            </select>
            <select
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="dismissed">Dismissed</option>
              <option value="snoozed">Snoozed</option>
            </select>
          </div>
        }
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">
            No recommendations match the current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(rec => {
            const account = getAccountById(rec.account_id);
            const currentRep = rec.current_rep_id ? getRepById(rec.current_rep_id) : null;
            const recommendedRep = rec.recommended_rep_id ? getRepById(rec.recommended_rep_id) : null;
            return (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                accountName={account?.name}
                currentRepName={currentRep?.name}
                recommendedRepName={recommendedRep?.name}
                onApprove={handleApprove}
                onDismiss={handleDismiss}
                onSnooze={handleSnooze}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
