import { Cloud } from 'lucide-react';

export function HubSpotConnect() {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
          <Cloud className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">HubSpot</h3>
          <p className="text-xs text-gray-500">Coming soon — bi-directional sync via HubSpot API</p>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        HubSpot integration is on the roadmap. You'll be able to connect your HubSpot instance with the same sync, scoring, and recommendation capabilities as Salesforce.
      </p>
      <button disabled className="mt-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
        Coming Soon
      </button>
    </div>
  );
}
