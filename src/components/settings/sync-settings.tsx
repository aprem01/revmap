import { useState } from 'react';
import { Clock, RefreshCcw, Save, CheckCircle2 } from 'lucide-react';

const scheduleOptions = [
  { value: '0 */6 * * *', label: 'Every 6 hours' },
  { value: '0 */12 * * *', label: 'Every 12 hours' },
  { value: '0 2 * * *', label: 'Daily at 2 AM' },
  { value: '0 2 * * 1', label: 'Weekly (Monday 2 AM)' },
  { value: 'manual', label: 'Manual only' },
];

const syncHistory = [
  { timestamp: '2026-04-02T14:00:00Z', type: 'full', accounts: 10, reps: 4, opportunities: 5, duration: '12s', status: 'success' },
  { timestamp: '2026-04-02T02:00:00Z', type: 'delta', accounts: 2, reps: 0, opportunities: 1, duration: '3s', status: 'success' },
  { timestamp: '2026-04-01T14:00:00Z', type: 'delta', accounts: 1, reps: 0, opportunities: 0, duration: '2s', status: 'success' },
  { timestamp: '2026-04-01T02:00:00Z', type: 'full', accounts: 10, reps: 4, opportunities: 5, duration: '14s', status: 'success' },
  { timestamp: '2026-03-31T02:00:00Z', type: 'full', accounts: 9, reps: 4, opportunities: 4, duration: '11s', status: 'success' },
];

export function SyncSettings() {
  const [schedule, setSchedule] = useState('0 2 * * *');
  const [deltaSyncEnabled, setDeltaSyncEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function timeSince(ts: string): string {
    const hours = Math.floor((Date.now() - new Date(ts).getTime()) / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="space-y-4">
      {/* Schedule Config */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">Sync Schedule</h3>
              <p className="text-xs text-gray-500">Configure how often RevMap syncs with your CRM</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              saved ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Sync Frequency</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
              {scheduleOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSchedule(opt.value); setSaved(false); }}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    schedule === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Delta Sync</p>
              <p className="text-xs text-gray-500">Only sync records modified since last sync (faster, lower API usage)</p>
            </div>
            <button
              onClick={() => { setDeltaSyncEnabled(!deltaSyncEnabled); setSaved(false); }}
              className={`relative h-6 w-11 rounded-full transition-colors ${deltaSyncEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${deltaSyncEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Sync History</h3>
          <button className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">
            <RefreshCcw className="h-3.5 w-3.5" /> Sync Now
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-medium uppercase tracking-wider text-gray-500">
              <th className="px-5 py-2">When</th>
              <th className="px-5 py-2">Type</th>
              <th className="px-5 py-2">Accounts</th>
              <th className="px-5 py-2">Reps</th>
              <th className="px-5 py-2">Opps</th>
              <th className="px-5 py-2">Duration</th>
              <th className="px-5 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {syncHistory.map((sync, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-5 py-2 text-gray-600">{timeSince(sync.timestamp)}</td>
                <td className="px-5 py-2">
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${sync.type === 'full' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {sync.type}
                  </span>
                </td>
                <td className="px-5 py-2 text-gray-600">{sync.accounts}</td>
                <td className="px-5 py-2 text-gray-600">{sync.reps}</td>
                <td className="px-5 py-2 text-gray-600">{sync.opportunities}</td>
                <td className="px-5 py-2 text-gray-600">{sync.duration}</td>
                <td className="px-5 py-2">
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle2 className="h-3 w-3" /> {sync.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
