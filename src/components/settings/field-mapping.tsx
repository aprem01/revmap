import { useState } from 'react';
import { Save } from 'lucide-react';

interface FieldMap {
  revmap_field: string;
  crm_field: string;
  object: string;
}

const defaultMappings: FieldMap[] = [
  { revmap_field: 'name', crm_field: 'Name', object: 'Account' },
  { revmap_field: 'industry', crm_field: 'Industry', object: 'Account' },
  { revmap_field: 'employee_count', crm_field: 'NumberOfEmployees', object: 'Account' },
  { revmap_field: 'annual_revenue', crm_field: 'AnnualRevenue', object: 'Account' },
  { revmap_field: 'website', crm_field: 'Website', object: 'Account' },
  { revmap_field: 'city', crm_field: 'BillingCity', object: 'Account' },
  { revmap_field: 'state', crm_field: 'BillingState', object: 'Account' },
  { revmap_field: 'country', crm_field: 'BillingCountry', object: 'Account' },
  { revmap_field: 'owner_rep_id', crm_field: 'OwnerId', object: 'Account' },
  { revmap_field: 'last_activity_at', crm_field: 'LastActivityDate', object: 'Account' },
  { revmap_field: 'name', crm_field: 'Name', object: 'Opportunity' },
  { revmap_field: 'amount', crm_field: 'Amount', object: 'Opportunity' },
  { revmap_field: 'stage', crm_field: 'StageName', object: 'Opportunity' },
  { revmap_field: 'close_date', crm_field: 'CloseDate', object: 'Opportunity' },
  { revmap_field: 'name', crm_field: 'Name', object: 'User' },
  { revmap_field: 'email', crm_field: 'Email', object: 'User' },
  { revmap_field: 'role', crm_field: 'UserRole.Name', object: 'User' },
];

export function FieldMapping() {
  const [mappings, setMappings] = useState(defaultMappings);
  const [saved, setSaved] = useState(false);

  const objects = [...new Set(mappings.map(m => m.object))];

  function handleChange(index: number, field: 'crm_field', value: string) {
    setMappings(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">CRM Field Mapping</h3>
          <p className="text-xs text-gray-500 mt-1">Map Salesforce fields to RevMap's normalized schema. Custom field names vary by org.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            saved ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Mapping'}
        </button>
      </div>

      {objects.map(obj => (
        <div key={obj} className="mb-6 last:mb-0">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono">{obj}</span>
          </h4>
          <div className="space-y-2">
            {mappings.map((mapping, i) => {
              if (mapping.object !== obj) return null;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-40">
                    <span className="text-sm text-gray-600 font-mono">{mapping.revmap_field}</span>
                  </div>
                  <span className="text-gray-300">→</span>
                  <input
                    type="text"
                    value={mapping.crm_field}
                    onChange={e => handleChange(i, 'crm_field', e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
