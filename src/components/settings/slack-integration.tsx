import { useState } from 'react';
import { MessageSquare, CheckCircle2, Bell, Hash, Zap } from 'lucide-react';

interface SlackConfig {
  connected: boolean;
  workspace: string;
  channels: { id: string; name: string; type: 'digest' | 'alerts' | 'approvals' }[];
  notifications: {
    daily_digest: boolean;
    new_recommendations: boolean;
    high_score_accounts: boolean;
    stale_account_alerts: boolean;
    approval_reminders: boolean;
  };
}

const mockConfig: SlackConfig = {
  connected: false,
  workspace: '',
  channels: [],
  notifications: {
    daily_digest: true,
    new_recommendations: true,
    high_score_accounts: true,
    stale_account_alerts: true,
    approval_reminders: false,
  },
};

export function SlackIntegration() {
  const [config, setConfig] = useState(mockConfig);
  const [webhookUrl, setWebhookUrl] = useState('');

  function handleConnect() {
    if (!webhookUrl) return;
    setConfig(prev => ({
      ...prev,
      connected: true,
      workspace: 'Acme Sales Ops',
      channels: [
        { id: 'ch-001', name: '#revmap-digest', type: 'digest' },
        { id: 'ch-002', name: '#revmap-alerts', type: 'alerts' },
        { id: 'ch-003', name: '#territory-approvals', type: 'approvals' },
      ],
    }));
  }

  function toggleNotification(key: keyof SlackConfig['notifications']) {
    setConfig(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  }

  const notificationTypes = [
    { key: 'daily_digest' as const, label: 'Daily Territory Digest', desc: 'Morning summary of territory health, top recommendations, and key metrics', icon: Hash },
    { key: 'new_recommendations' as const, label: 'New Recommendations', desc: 'Alert when AI generates new REASSIGN, RE_ENGAGE, or RETIRE recommendations', icon: Zap },
    { key: 'high_score_accounts' as const, label: 'High Score Account Alerts', desc: 'Notify when a new account scores 80+ against your ICP', icon: Bell },
    { key: 'stale_account_alerts' as const, label: 'Stale Account Warnings', desc: 'Alert when a high-score account goes 60+ days without activity', icon: Bell },
    { key: 'approval_reminders' as const, label: 'Approval Reminders', desc: 'Remind managers about pending recommendations approaching expiry', icon: Bell },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <MessageSquare className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Slack Integration</h3>
            <p className="text-xs text-gray-500">Get territory alerts, approve recommendations, and daily digests in Slack</p>
          </div>
        </div>
        {config.connected && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Connected to {config.workspace}
          </span>
        )}
      </div>

      {!config.connected ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Slack Webhook URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/T.../B.../..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono placeholder:text-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleConnect}
            disabled={!webhookUrl}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MessageSquare className="h-4 w-4" /> Connect Slack
          </button>
          <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 text-xs text-purple-700 space-y-1">
            <p className="font-medium">What you'll get:</p>
            <p>• Daily territory health digest in your Slack channel</p>
            <p>• Real-time alerts when high-score accounts are detected</p>
            <p>• Approve/dismiss recommendations with Slack buttons</p>
            <p>• Stale account warnings before opportunities go cold</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected channels */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Connected Channels</p>
            <div className="flex flex-wrap gap-2">
              {config.channels.map(ch => (
                <span key={ch.id} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  <Hash className="h-3 w-3 text-gray-400" /> {ch.name}
                  <span className="rounded bg-gray-200 px-1 py-0.5 text-[10px] text-gray-500">{ch.type}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Notification toggles */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Notifications</p>
            <div className="space-y-2">
              {notificationTypes.map(nt => (
                <div key={nt.key} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <nt.icon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{nt.label}</p>
                      <p className="text-xs text-gray-500">{nt.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification(nt.key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${config.notifications[nt.key] ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${config.notifications[nt.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview message */}
          <div className="rounded-lg bg-gray-900 p-4 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">R</div>
              <span className="text-white font-medium text-xs">RevMap</span>
              <span className="text-gray-500 text-xs">9:00 AM</span>
            </div>
            <div className="space-y-1 text-gray-300 text-xs leading-relaxed">
              <p className="font-medium text-white">🗺️ Daily Territory Digest — April 2, 2026</p>
              <p>• 5 pending recommendations (2 new)</p>
              <p>• Ironclad Manufacturing is 148 days stale (score: 71)</p>
              <p>• Quantum Analytics (score: 82) needs assignment</p>
              <p>• Highest priority: Assign Quantum Analytics to Priya Patel</p>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="rounded border border-green-700 bg-green-900/30 px-2.5 py-1 text-xs text-green-400 font-medium">✓ Approve</span>
              <span className="rounded border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-400 font-medium">✕ Dismiss</span>
              <span className="rounded border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-400 font-medium">⏰ Snooze</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
