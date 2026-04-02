import { PageHeader } from '@/components/shared/page-header';

export function ScenariosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="What-If Scenarios"
        description="Model territory changes before committing them to Salesforce"
      />

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-700">Coming Soon</h3>
        <p className="mt-2 text-sm text-gray-500">
          Define hypothetical changes — add reps, move accounts, create new vertical pods —
          and see projected territory balance, coverage gaps, and capacity impact before making changes live.
        </p>
      </div>
    </div>
  );
}
