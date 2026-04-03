import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import {
  mockAccounts,
  mockReps,
  mockAccountScores,
  mockRecommendations,
  mockOpportunities,
  getRepById,
} from '@/lib/mock-data';

interface QueryResult {
  type: 'accounts' | 'reps' | 'recommendations' | 'insight' | 'action';
  title: string;
  data: Record<string, unknown>[];
  summary: string;
}

// Simple NLQ engine — pattern matching + data filtering
// In production this calls Claude to parse intent and generate a structured query
function processQuery(query: string): QueryResult {
  const q = query.toLowerCase().trim();

  // Account queries
  if (q.includes('account') && (q.includes('above') || q.includes('over') || q.includes('>')) && q.match(/\d+/)) {
    const threshold = parseInt(q.match(/\d+/)![0]!);
    const industryMatch = q.match(/in (\w+)/i);
    let filtered = mockAccountScores.filter(s => s.total_score >= threshold);
    if (industryMatch) {
      const industry = industryMatch[1]!;
      filtered = filtered.filter(s => {
        const acc = mockAccounts.find(a => a.id === s.account_id);
        return acc?.industry?.toLowerCase().includes(industry.toLowerCase());
      });
    }
    const accounts = filtered.map(s => {
      const acc = mockAccounts.find(a => a.id === s.account_id);
      return { name: acc?.name, industry: acc?.industry, score: s.total_score, owner: acc?.owner_rep_id ? getRepById(acc.owner_rep_id)?.name : 'Unassigned' };
    });
    return { type: 'accounts', title: `Accounts scoring above ${threshold}`, data: accounts, summary: `Found ${accounts.length} accounts scoring ${threshold}+ against your ICP.` };
  }

  // Stale accounts
  if (q.includes('stale') || q.includes('inactive') || q.includes('no activity')) {
    const daysMatch = q.match(/(\d+)\s*day/);
    const days = daysMatch ? parseInt(daysMatch[1]!) : 60;
    const stale = mockAccounts.filter(a => {
      if (!a.last_activity_at) return true;
      return Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000) > days;
    }).map(a => {
      const score = mockAccountScores.find(s => s.account_id === a.id);
      const daysSince = a.last_activity_at ? Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000) : 999;
      return { name: a.name, industry: a.industry, score: score?.total_score ?? 0, days_inactive: daysSince, owner: a.owner_rep_id ? getRepById(a.owner_rep_id)?.name : 'Unassigned' };
    });
    return { type: 'accounts', title: `Stale accounts (>${days} days)`, data: stale, summary: `${stale.length} accounts have been inactive for more than ${days} days. ${stale.filter(s => (s.score as number) >= 70).length} of them score 70+ — high-value accounts going cold.` };
  }

  // Unassigned
  if (q.includes('unassigned') || q.includes('no owner') || q.includes('no rep')) {
    const unassigned = mockAccounts.filter(a => !a.owner_rep_id).map(a => {
      const score = mockAccountScores.find(s => s.account_id === a.id);
      return { name: a.name, industry: a.industry, employees: a.employee_count, score: score?.total_score ?? 0 };
    });
    return { type: 'accounts', title: 'Unassigned accounts', data: unassigned, summary: `${unassigned.length} accounts have no rep assigned. Highest scored: ${unassigned.sort((a, b) => (b.score as number) - (a.score as number))[0]?.name ?? 'none'}.` };
  }

  // Rep queries
  if (q.includes('rep') && (q.includes('capacity') || q.includes('overload') || q.includes('available'))) {
    const reps = mockReps.map(r => ({
      name: r.name, segment: r.segment, territory: r.territory,
      capacity: r.capacity_score, accounts: mockAccounts.filter(a => a.owner_rep_id === r.id).length,
      pipeline: `$${(r.pipeline_value / 1_000_000).toFixed(1)}M`,
    })).sort((a, b) => (b.capacity as number) - (a.capacity as number));
    const overloaded = reps.filter(r => (r.capacity as number) < 40);
    return { type: 'reps', title: 'Rep capacity', data: reps, summary: `${overloaded.length} rep(s) below 40% capacity. Most available: ${reps[0]?.name} at ${reps[0]?.capacity}%.` };
  }

  // Win rate
  if (q.includes('win rate') || q.includes('win-rate') || q.includes('performance')) {
    const reps = mockReps.map(r => {
      const opps = mockOpportunities.filter(o => o.rep_id === r.id);
      const won = opps.filter(o => o.status === 'won').length;
      const lost = opps.filter(o => o.status === 'lost').length;
      const rate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
      return { name: r.name, win_rate: `${rate}%`, won, lost, open: opps.filter(o => o.status === 'open').length };
    });
    return { type: 'reps', title: 'Win rates by rep', data: reps, summary: `Highest win rate: ${reps.sort((a, b) => parseInt(b.win_rate as string) - parseInt(a.win_rate as string))[0]?.name}.` };
  }

  // Recommendations
  if (q.includes('recommendation') || q.includes('pending') || q.includes('action')) {
    const pending = mockRecommendations.filter(r => r.status === 'pending').map(r => {
      const acc = mockAccounts.find(a => a.id === r.account_id);
      return { type: r.type, account: acc?.name, confidence: r.confidence_score, status: r.status };
    });
    return { type: 'recommendations', title: 'Pending recommendations', data: pending, summary: `${pending.length} pending recommendations. Highest confidence: ${pending[0]?.account} (${pending[0]?.confidence}%).` };
  }

  // What if / scenario
  if (q.includes('what if') || q.includes('what would happen')) {
    return {
      type: 'insight',
      title: 'Scenario Analysis',
      data: [],
      summary: `To model territory changes, go to the Scenarios page. You can simulate adding reps, moving accounts between territories, creating vertical pods, and retiring low-score accounts — all with projected impact on balance scores and rep capacity before committing anything to Salesforce.`,
    };
  }

  // Territory
  if (q.includes('territory') || q.includes('coverage') || q.includes('balance')) {
    const territories = [...new Set(mockReps.map(r => r.territory).filter(Boolean))];
    const data = territories.map(t => {
      const reps = mockReps.filter(r => r.territory === t);
      const accounts = mockAccounts.filter(a => reps.some(r => r.id === a.owner_rep_id));
      return { territory: t, reps: reps.length, accounts: accounts.length, avg_capacity: `${Math.round(reps.reduce((s, r) => s + r.capacity_score, 0) / reps.length)}%` };
    });
    return { type: 'insight', title: 'Territory overview', data, summary: `${territories.length} territories active. ${mockAccounts.filter(a => !a.owner_rep_id).length} accounts unassigned.` };
  }

  // Fallback — search by name
  const nameMatch = mockAccounts.find(a => a.name.toLowerCase().includes(q));
  if (nameMatch) {
    const score = mockAccountScores.find(s => s.account_id === nameMatch.id);
    const owner = nameMatch.owner_rep_id ? getRepById(nameMatch.owner_rep_id) : null;
    return {
      type: 'accounts',
      title: nameMatch.name,
      data: [{ name: nameMatch.name, industry: nameMatch.industry, employees: nameMatch.employee_count, revenue: nameMatch.annual_revenue, score: score?.total_score ?? 0, owner: owner?.name ?? 'Unassigned' }],
      summary: `${nameMatch.name} — ${nameMatch.industry}, ${nameMatch.employee_count?.toLocaleString()} employees, score ${score?.total_score ?? '?'}/100, owned by ${owner?.name ?? 'nobody'}.`,
    };
  }

  return { type: 'insight', title: 'Ask me anything', data: [], summary: 'Try questions like: "Show me accounts scoring above 80", "Which reps have capacity?", "Stale accounts with no activity in 60 days", "What\'s our win rate?", or search by account name.' };
}

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setResult(null);
        setQuery('');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setIsProcessing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setResult(processQuery(query));
      setIsProcessing(false);
    }, 400);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors shadow-sm"
      >
        <Sparkles className="h-4 w-4" />
        Ask anything...
        <kbd className="ml-4 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">⌘K</kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => { setIsOpen(false); setResult(null); setQuery(''); }} />

      {/* Modal */}
      <div className="fixed inset-x-0 top-[15%] z-50 mx-auto max-w-2xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center border-b border-gray-200 px-5">
            <Sparkles className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything about your territory, accounts, reps..."
              className="flex-1 border-0 px-3 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            {isProcessing ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            ) : query ? (
              <button type="submit" className="text-blue-500 hover:text-blue-600">
                <Send className="h-5 w-5" />
              </button>
            ) : (
              <button type="button" onClick={() => { setIsOpen(false); setResult(null); setQuery(''); }}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </form>

          {/* Results */}
          {result && (
            <div className="max-h-[60vh] overflow-y-auto p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900">{result.title}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{result.summary}</p>
              </div>

              {result.data.length > 0 && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                        {Object.keys(result.data[0]!).map(key => (
                          <th key={key} className="px-4 py-2">{key.replace(/_/g, ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.slice(0, 10).map((row, i) => (
                        <tr
                          key={i}
                          className="border-t border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (row.name && result.type === 'accounts') {
                              const acc = mockAccounts.find(a => a.name === row.name);
                              if (acc) { navigate(`/app/accounts/${acc.id}`); setIsOpen(false); setResult(null); setQuery(''); }
                            }
                          }}
                        >
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-4 py-2 text-gray-700">
                              {typeof val === 'number' ? val.toLocaleString() : String(val ?? '—')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.data.length > 10 && (
                    <p className="px-4 py-2 text-xs text-gray-400 bg-gray-50">
                      Showing 10 of {result.data.length} results
                    </p>
                  )}
                </div>
              )}

              {/* Quick suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {['Stale accounts', 'Rep capacity', 'Pending recommendations', 'Accounts above 80', 'Win rate by rep'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => { setQuery(suggestion); setResult(processQuery(suggestion)); }}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && (
            <div className="p-5">
              <p className="text-xs text-gray-400 mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Show me accounts scoring above 80',
                  'Which reps have capacity?',
                  'Stale accounts with no activity in 60 days',
                  'Unassigned accounts',
                  'What\'s our win rate?',
                  'Territory overview',
                  'Pending recommendations',
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => { setQuery(suggestion); setResult(processQuery(suggestion)); }}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
