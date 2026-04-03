import { useState } from 'react';
import { Cloud, CheckCircle2, ExternalLink, RefreshCcw } from 'lucide-react';

export function SalesforceConnect() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [instanceUrl, setInstanceUrl] = useState('');

  function handleConnect() {
    if (!instanceUrl) return;
    setStatus('connecting');
    // In production: redirect to Salesforce OAuth2 authorize URL
    // GET https://login.salesforce.com/services/oauth2/authorize
    //   ?response_type=code
    //   &client_id={SALESFORCE_CLIENT_ID}
    //   &redirect_uri={SALESFORCE_REDIRECT_URI}
    //   &scope=api+refresh_token
    setTimeout(() => setStatus('connected'), 1500);
  }

  function handleDisconnect() {
    setStatus('disconnected');
    setInstanceUrl('');
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Cloud className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Salesforce</h3>
            <p className="text-xs text-gray-500">Bi-directional sync via REST API</p>
          </div>
        </div>
        {status === 'connected' && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" /> Connected
          </span>
        )}
      </div>

      {status === 'disconnected' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Salesforce Instance URL</label>
            <input
              type="text"
              value={instanceUrl}
              onChange={e => setInstanceUrl(e.target.value)}
              placeholder="https://yourcompany.my.salesforce.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleConnect}
            disabled={!instanceUrl}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Connect via OAuth
          </button>
          <p className="text-xs text-gray-400">
            You'll be redirected to Salesforce to authorize access. We request API and refresh_token scopes.
          </p>
        </div>
      )}

      {status === 'connecting' && (
        <div className="flex items-center gap-3 py-4">
          <RefreshCcw className="h-5 w-5 text-blue-500 animate-spin" />
          <span className="text-sm text-gray-600">Connecting to Salesforce...</span>
        </div>
      )}

      {status === 'connected' && (
        <div className="space-y-3">
          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Instance</span>
              <span className="font-medium text-gray-900">{instanceUrl || 'https://acme.my.salesforce.com'}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Last Sync</span>
              <span className="font-medium text-gray-900">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Objects Synced</span>
              <span className="font-medium text-gray-900">Accounts, Users, Opportunities</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">
              <RefreshCcw className="h-3.5 w-3.5" /> Sync Now
            </button>
            <button
              onClick={handleDisconnect}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
