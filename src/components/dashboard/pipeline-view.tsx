import { Search, Layers, TrendingUp, Users, RefreshCcw, ArrowRight } from 'lucide-react';
import { ScoreBadge } from '@/components/shared/score-badge';
import {
  mockPipelineAccounts,
  stageConfig,
  type PipelineStage,
} from '@/lib/mock-pipeline';

const stageIcons: Record<PipelineStage, typeof Search> = {
  discover: Search,
  classify: Layers,
  score: TrendingUp,
  assign: Users,
  sync: RefreshCcw,
};

const stageOrder: PipelineStage[] = ['discover', 'classify', 'score', 'assign', 'sync'];

export function PipelineView() {
  return (
    <div className="space-y-6">
      {/* Stage Summary Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {stageOrder.map((stage, i) => {
          const config = stageConfig[stage];
          const Icon = stageIcons[stage];
          const count = mockPipelineAccounts.filter(a => a.stage === stage).length;

          return (
            <div key={stage} className="flex items-center">
              <div className={`flex items-center gap-2 rounded-xl border ${config.borderColor} ${config.bgColor} px-4 py-2.5 min-w-[140px]`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
                <div>
                  <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
                  <p className="text-xs text-gray-500">{count} account{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {i < stageOrder.length - 1 && (
                <ArrowRight className="mx-1 h-4 w-4 text-gray-300 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Kanban-style columns */}
      <div className="grid grid-cols-5 gap-3 min-h-[500px]">
        {stageOrder.map(stage => {
          const config = stageConfig[stage];
          const accounts = mockPipelineAccounts.filter(a => a.stage === stage);

          return (
            <div key={stage} className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-3`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-semibold ${config.color}`}>{config.label}</h3>
                <span className={`rounded-full ${config.bgColor} border ${config.borderColor} px-2 py-0.5 text-xs font-medium ${config.color}`}>
                  {accounts.length}
                </span>
              </div>

              <div className="space-y-2">
                {accounts.map(account => (
                  <div
                    key={account.id}
                    className="rounded-lg border border-white/80 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm font-medium text-gray-900 leading-tight">{account.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{account.industry}</p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span>{account.employee_count.toLocaleString()} emp</span>
                      <span>·</span>
                      <span>${(account.revenue / 1_000_000).toFixed(0)}M</span>
                    </div>

                    {account.score !== null && (
                      <div className="mt-2">
                        <ScoreBadge score={account.score} size="sm" />
                      </div>
                    )}

                    {account.assigned_rep && (
                      <p className="mt-2 text-xs text-violet-600 font-medium">
                        → {account.assigned_rep}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-1">
                      {account.signals.slice(0, 2).map((signal, i) => (
                        <span key={i} className="rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-500 leading-tight">
                          {signal}
                        </span>
                      ))}
                    </div>

                    <p className="mt-1.5 text-[10px] text-gray-400">via {account.source}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
