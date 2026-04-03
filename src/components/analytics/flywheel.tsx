import { RefreshCcw, TrendingUp, Brain, CheckCircle2, XCircle } from 'lucide-react';
import { mockRecommendations } from '@/lib/mock-data';

interface FlyWheelMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  detail: string;
}

export function DataFlywheel() {
  const approved = mockRecommendations.filter(r => r.status === 'approved');
  const dismissed = mockRecommendations.filter(r => r.status === 'dismissed');
  const totalActioned = approved.length + dismissed.length;

  // Simulate model learning metrics
  const metrics: FlyWheelMetric[] = [
    {
      label: 'Model Training Signals',
      value: String(totalActioned),
      trend: 'up',
      detail: `${approved.length} approvals + ${dismissed.length} dismissals fed back into scoring weights`,
    },
    {
      label: 'Score Accuracy (v1)',
      value: '72%',
      trend: 'up',
      detail: 'Accounts scored ≥70 that progressed to opportunity within 90 days',
    },
    {
      label: 'Recommendation Precision',
      value: totalActioned > 0 ? `${Math.round((approved.length / totalActioned) * 100)}%` : '—',
      trend: approved.length > dismissed.length ? 'up' : 'down',
      detail: 'Approved ÷ (Approved + Dismissed) — higher = model aligns with manager judgment',
    },
    {
      label: 'ICP Drift',
      value: 'Low',
      trend: 'stable',
      detail: 'Winning customer profile has not significantly shifted since last model update',
    },
  ];

  // Dismiss patterns (what the model should learn from)
  const dismissPatterns = analyzeDismissPatterns();

  return (
    <div className="space-y-6">
      {/* Flywheel visual */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <RefreshCcw className="h-5 w-5 text-blue-500" />
          Data Flywheel
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Every action you take trains the model. Approvals validate scoring. Dismissals correct it. The more you use RevMap, the smarter it gets.
        </p>

        {/* Cycle visualization */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
          {[
            { step: 'CRM Data', icon: '📊', desc: 'Sync accounts & opportunities' },
            { step: 'ICP Model', icon: '🎯', desc: 'Extract winning patterns' },
            { step: 'Score', icon: '📈', desc: 'Score every account 0-100' },
            { step: 'Recommend', icon: '💡', desc: 'AI generates actions' },
            { step: 'Act', icon: '✅', desc: 'Manager approves/dismisses' },
            { step: 'Learn', icon: '🧠', desc: 'Feedback improves model' },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center text-center w-24">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm text-xl mb-1">
                  {item.icon}
                </div>
                <p className="text-xs font-semibold text-gray-900">{item.step}</p>
                <p className="text-[10px] text-gray-500">{item.desc}</p>
              </div>
              {i < 5 && <span className="text-gray-300 mx-1">→</span>}
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {metrics.map(m => (
            <div key={m.label} className="rounded-lg bg-white p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500">{m.label}</p>
                {m.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {m.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
              </div>
              <p className="text-xl font-bold text-gray-900">{m.value}</p>
              <p className="text-[10px] text-gray-400 mt-1">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dismiss Patterns — what the model is learning */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          What the Model is Learning
        </h2>
        <p className="text-xs text-gray-500 mb-4">Patterns extracted from manager approve/dismiss decisions</p>

        <div className="space-y-3">
          {dismissPatterns.map((pattern, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 px-4 py-3">
              <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${pattern.type === 'positive' ? 'bg-green-100' : 'bg-amber-100'}`}>
                {pattern.type === 'positive'
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  : <XCircle className="h-3.5 w-3.5 text-amber-600" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{pattern.insight}</p>
                <p className="text-xs text-gray-500 mt-0.5">{pattern.evidence}</p>
                <p className="text-xs text-blue-600 mt-1">Model adjustment: {pattern.adjustment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function analyzeDismissPatterns() {
  return [
    {
      type: 'positive' as const,
      insight: 'RE_ENGAGE recommendations for Healthcare accounts are always approved',
      evidence: '1/1 approved — managers trust the model on healthcare stale-account detection',
      adjustment: 'Increase confidence score for RE_ENGAGE + Healthcare by 5%',
    },
    {
      type: 'positive' as const,
      insight: 'RETIRE recommendations for accounts <30 score are approved quickly',
      evidence: '1/1 approved with avg 1-day response time',
      adjustment: 'Auto-flag sub-25 accounts for retirement without waiting for manual trigger',
    },
    {
      type: 'negative' as const,
      insight: 'REASSIGN recommendations may overweight capacity vs. relationship history',
      evidence: 'TrueNorth Insurance REASSIGN is pending — manager may value existing relationship over optimal fit',
      adjustment: 'Increase relationship_history weight from 0.1 to 0.15 in fit model',
    },
    {
      type: 'positive' as const,
      insight: 'ADD_TO_TERRITORY recs for high-score unassigned SaaS accounts get immediate attention',
      evidence: 'Quantum Analytics (score 82) assignment pending — high engagement from manager',
      adjustment: 'Prioritize unassigned accounts with score >75 in SaaS vertical',
    },
  ];
}
