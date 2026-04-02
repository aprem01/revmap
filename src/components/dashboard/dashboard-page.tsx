import { Building2, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Territory intelligence overview"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Accounts"
          value="—"
          icon={Building2}
        />
        <StatCard
          label="Active Reps"
          value="—"
          icon={Users}
        />
        <StatCard
          label="Pending Recommendations"
          value="—"
          icon={Lightbulb}
        />
        <StatCard
          label="Avg Account Score"
          value="—"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Top Scored Accounts</h2>
          <p className="mt-2 text-sm text-gray-500">
            Connect your Salesforce instance to see scored accounts.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Recommendations</h2>
          <p className="mt-2 text-sm text-gray-500">
            Recommendations will appear here after your first sync.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Territory Health</h2>
        <p className="mt-2 text-sm text-gray-500">
          Territory balance scores, coverage gaps, and stale accounts will be displayed after data ingestion.
        </p>
      </div>
    </div>
  );
}
