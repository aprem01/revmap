import { PageHeader } from '@/components/shared/page-header';

export function TerritoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Territories"
        description="Territory balance, coverage, and assignment history"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Territory Balance</h2>
          <p className="mt-2 text-sm text-gray-500">
            Visualize account distribution across reps and territories after CRM sync.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Coverage Gaps</h2>
          <p className="mt-2 text-sm text-gray-500">
            Identify high-score accounts with no rep coverage or misaligned assignments.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Assignment History</h2>
        <p className="mt-2 text-sm text-gray-500">
          Full audit trail of territory changes and recommendation actions.
        </p>
      </div>
    </div>
  );
}
