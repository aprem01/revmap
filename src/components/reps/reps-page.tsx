import { PageHeader } from '@/components/shared/page-header';

export function RepsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reps"
        description="Sales rep profiles, capacity, and performance"
      />

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3">Rep</th>
                <th className="px-5 py-3">Segment</th>
                <th className="px-5 py-3">Territory</th>
                <th className="px-5 py-3">Active Accounts</th>
                <th className="px-5 py-3">Pipeline</th>
                <th className="px-5 py-3">Capacity</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                  Connect your CRM to see rep profiles here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
