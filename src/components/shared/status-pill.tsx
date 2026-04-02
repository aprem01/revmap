import type { RecommendationStatus, RecommendationType } from '@/types';

const statusColors: Record<RecommendationStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-600',
  snoozed: 'bg-blue-100 text-blue-700',
  expired: 'bg-red-100 text-red-600',
};

const typeColors: Record<RecommendationType, string> = {
  REASSIGN: 'bg-purple-100 text-purple-800',
  RE_ENGAGE: 'bg-orange-100 text-orange-800',
  ADD_TO_TERRITORY: 'bg-teal-100 text-teal-800',
  RETIRE: 'bg-red-100 text-red-800',
  REBALANCE: 'bg-indigo-100 text-indigo-800',
};

const typeLabels: Record<RecommendationType, string> = {
  REASSIGN: 'Reassign',
  RE_ENGAGE: 'Re-engage',
  ADD_TO_TERRITORY: 'Add to Territory',
  RETIRE: 'Retire',
  REBALANCE: 'Rebalance',
};

export function StatusPill({ status }: { status: RecommendationStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[status]}`}>
      {status}
    </span>
  );
}

export function TypePill({ type }: { type: RecommendationType }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[type]}`}>
      {typeLabels[type]}
    </span>
  );
}
