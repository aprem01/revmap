import { Check, X, Clock } from 'lucide-react';
import { ScoreBadge } from '@/components/shared/score-badge';
import { TypePill, StatusPill } from '@/components/shared/status-pill';
import type { Recommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  accountName?: string;
  currentRepName?: string;
  recommendedRepName?: string;
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
  onSnooze: (id: string) => void;
}

export function RecommendationCard({
  recommendation,
  accountName,
  currentRepName,
  recommendedRepName,
  onApprove,
  onDismiss,
  onSnooze,
}: RecommendationCardProps) {
  const isPending = recommendation.status === 'pending';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <TypePill type={recommendation.type} />
            <StatusPill status={recommendation.status} />
            <ScoreBadge score={recommendation.confidence_score} size="sm" label="confidence" />
          </div>

          <h3 className="text-base font-semibold text-gray-900">
            {accountName ?? 'Unknown Account'}
          </h3>

          {currentRepName && (
            <p className="text-sm text-gray-500">
              Current: <span className="font-medium text-gray-700">{currentRepName}</span>
              {recommendedRepName && (
                <>
                  {' → '}
                  <span className="font-medium text-primary">{recommendedRepName}</span>
                </>
              )}
            </p>
          )}

          <p className="text-sm text-gray-600 leading-relaxed">
            {recommendation.reasoning}
          </p>
        </div>

        {isPending && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onApprove(recommendation.id)}
              className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              onClick={() => onSnooze(recommendation.id)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Clock className="h-3.5 w-3.5" />
              Snooze
            </button>
            <button
              onClick={() => onDismiss(recommendation.id)}
              className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
