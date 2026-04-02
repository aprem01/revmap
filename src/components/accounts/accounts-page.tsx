import { PageHeader } from '@/components/shared/page-header';

export function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description="CRM accounts scored against your ICP model"
      />

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-3">
          <input
            type="text"
            placeholder="Search accounts..."
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
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  Connect your CRM to see accounts here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
