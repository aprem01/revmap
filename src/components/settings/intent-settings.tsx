import { useState } from 'react';
import { Zap, CheckCircle2, AlertCircle } from 'lucide-react';

interface IntentProvider {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'coming_soon';
  tier: 'starter' | 'growth' | 'enterprise';
  apiKeyField?: string;
  signals: string[];
}

const providers: IntentProvider[] = [
  {
    id: 'bombora',
    name: 'Bombora',
    description: 'Topic-level intent data — know which accounts are actively researching your category.',
    status: 'disconnected',
    tier: 'enterprise',
    apiKeyField: 'BOMBORA_API_KEY',
    signals: ['Topic surge', 'Category research', 'Competitive evaluation'],
  },
  {
    id: 'g2',
    name: 'G2 Buyer Intent',
    description: 'Product comparison and review activity — see which accounts are evaluating solutions like yours.',
    status: 'disconnected',
    tier: 'enterprise',
    apiKeyField: 'G2_API_KEY',
    signals: ['Product page views', 'Category comparisons', 'Alternative searches'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Job Postings',
    description: 'Hiring signals — detect when accounts are hiring for roles that indicate buying intent.',
    status: 'connected',
    tier: 'growth',
    signals: ['Sales hiring', 'Engineering hiring', 'Leadership changes'],
  },
  {
    id: 'funding',
    name: 'Funding & News',
    description: 'Track funding rounds, M&A activity, and growth events that signal buying readiness.',
    status: 'connected',
    tier: 'growth',
    signals: ['Funding rounds', 'Acquisitions', 'IPO activity', 'Executive hires'],
  },
  {
    id: 'technographic',
    name: 'PredictLeads / Technographics',
    description: 'Technology stack detection — identify accounts using complementary or competitive tools.',
    status: 'coming_soon',
    tier: 'enterprise',
    signals: ['Stack changes', 'Tool adoption', 'Migration signals'],
  },
  {
    id: 'reddit',
    name: 'Reddit / Community Sentiment',
    description: 'Monitor community discussions for mentions of your category, pain points, and competitor sentiment.',
    status: 'coming_soon',
    tier: 'enterprise',
    signals: ['Category mentions', 'Pain point discussions', 'Competitor sentiment'],
  },
];

export function IntentSettings() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const tierColors = {
    starter: 'bg-gray-100 text-gray-600',
    growth: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Intent signals enrich your account scores with real-time buying signals. Available providers depend on your plan tier.
      </div>

      {providers.map(provider => (
        <div key={provider.id} className={`rounded-xl border bg-white p-6 ${provider.status === 'coming_soon' ? 'border-dashed border-gray-300 opacity-70' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                provider.status === 'connected' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Zap className={`h-5 w-5 ${provider.status === 'connected' ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900">{provider.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tierColors[provider.tier]}`}>
                    {provider.tier}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{provider.description}</p>
              </div>
            </div>
            {provider.status === 'connected' && (
              <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active
              </span>
            )}
            {provider.status === 'coming_soon' && (
              <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                <AlertCircle className="h-3.5 w-3.5" /> Coming Soon
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {provider.signals.map(signal => (
              <span key={signal} className="rounded-full bg-gray-50 border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600">
                {signal}
              </span>
            ))}
          </div>

          {provider.status === 'disconnected' && provider.apiKeyField && (
            <div className="flex gap-2">
              <input
                type="password"
                placeholder={`Enter ${provider.apiKeyField}`}
                value={apiKeys[provider.id] ?? ''}
                onChange={e => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-mono placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                disabled={!apiKeys[provider.id]}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Connect
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
