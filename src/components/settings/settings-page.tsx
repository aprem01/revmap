import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { isDemo } from '@/lib/utils/supabase';
import { SalesforceConnect } from './salesforce-connect';
import { HubSpotConnect } from './hubspot-connect';
import { FieldMapping } from './field-mapping';
import { SyncSettings } from './sync-settings';
import { IntentSettings } from './intent-settings';

type Tab = 'crm' | 'mapping' | 'sync' | 'intent';

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('crm');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'crm', label: 'CRM Connections' },
    { id: 'mapping', label: 'Field Mapping' },
    { id: 'sync', label: 'Sync Schedule' },
    { id: 'intent', label: 'Intent Signals' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure CRM connections, field mapping, sync schedules, and data sources"
      />

      {isDemo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          Running in demo mode — connect a Supabase project and add environment variables to enable live data.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'crm' && (
        <div className="space-y-4">
          <SalesforceConnect />
          <HubSpotConnect />
        </div>
      )}
      {tab === 'mapping' && <FieldMapping />}
      {tab === 'sync' && <SyncSettings />}
      {tab === 'intent' && <IntentSettings />}
    </div>
  );
}
