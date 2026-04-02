import { PageHeader } from '@/components/shared/page-header';
import { RecommendationCard } from './recommendation-card';
import type { Recommendation } from '@/types';

// Placeholder — will be replaced with real data from Supabase
const EMPTY_RECS: Recommendation[] = [];

export function RecommendationsPage() {
  const recommendations = EMPTY_RECS;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommendations"
        description="AI-powered territory recommendations. Approve, dismiss, or snooze each action."
        actions={
          <div className="flex items-center gap-2">
            <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
              <option value="all">All types</option>
              <option value="REASSIGN">Reassign</option>
              <option value="RE_ENGAGE">Re-engage</option>
              <option value="ADD_TO_TERRITORY">Add to Territory</option>
              <option value="RETIRE">Retire</option>
              <option value="REBALANCE">Rebalance</option>
            </select>
            <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
              <option value="pending">Pending</option>
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        }
      />

      {recommendations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">
            No recommendations yet. Connect your CRM and run a sync to generate recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map(rec => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onApprove={() => {}}
              onDismiss={() => {}}
              onSnooze={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
