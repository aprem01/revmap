import { TrendingDown, TrendingUp, AlertTriangle, Clock, Zap } from 'lucide-react';
import { ScoreBadge } from '@/components/shared/score-badge';
import { mockAccounts, mockAccountScores, mockReps, mockOpportunities, getRepById } from '@/lib/mock-data';

interface ChurnPrediction {
  account_id: string;
  account_name: string;
  current_score: number;
  days_inactive: number;
  decay_rate: number; // score points lost per week
  predicted_churn_days: number;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  owner: string;
  reason: string;
}

interface DealForecast {
  opp_id: string;
  opp_name: string;
  account_name: string;
  amount: number;
  current_stage: string;
  predicted_close_days: number;
  win_probability: number;
  velocity: 'fast' | 'normal' | 'slow' | 'stalled';
  rep_name: string;
}

interface RepBurnoutRisk {
  rep_id: string;
  rep_name: string;
  risk_score: number;
  signals: string[];
  capacity: number;
  trend: 'improving' | 'stable' | 'declining';
}

// Generate mock predictions
function generateChurnPredictions(): ChurnPrediction[] {
  return mockAccounts
    .filter(a => a.owner_rep_id && a.last_activity_at)
    .map(a => {
      const daysSince = Math.floor((Date.now() - new Date(a.last_activity_at!).getTime()) / 86400000);
      const score = mockAccountScores.find(s => s.account_id === a.id)?.total_score ?? 0;
      const decayRate = daysSince > 90 ? 8 : daysSince > 60 ? 5 : daysSince > 30 ? 2 : 0.5;
      const predictedDays = decayRate > 0 ? Math.round((score - 20) / decayRate * 7) : 365;
      const risk: ChurnPrediction['risk_level'] = predictedDays < 30 ? 'critical' : predictedDays < 60 ? 'high' : predictedDays < 120 ? 'medium' : 'low';
      const owner = getRepById(a.owner_rep_id!)?.name ?? 'Unknown';

      const reasons = [];
      if (daysSince > 90) reasons.push(`${daysSince} days inactive`);
      if (daysSince > 60 && daysSince <= 90) reasons.push(`${daysSince} days since last touch`);
      if (score < 50) reasons.push(`Low ICP score (${score})`);
      if (decayRate > 5) reasons.push('Rapid engagement decay');

      return {
        account_id: a.id,
        account_name: a.name,
        current_score: score,
        days_inactive: daysSince,
        decay_rate: decayRate,
        predicted_churn_days: predictedDays,
        risk_level: risk,
        owner,
        reason: reasons.join(' · ') || 'Stable',
      };
    })
    .filter(p => p.risk_level !== 'low')
    .sort((a, b) => a.predicted_churn_days - b.predicted_churn_days);
}

function generateDealForecasts(): DealForecast[] {
  return mockOpportunities
    .filter(o => o.status === 'open')
    .map(o => {
      const account = mockAccounts.find(a => a.id === o.account_id);
      const rep = mockReps.find(r => r.id === o.rep_id);
      const cycleDays = o.sales_cycle_days ?? 60;
      const elapsed = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 86400000);
      const remaining = Math.max(0, cycleDays - elapsed);
      const progress = elapsed / cycleDays;

      let velocity: DealForecast['velocity'] = 'normal';
      let winProb = 50;

      if (progress > 1.5) { velocity = 'stalled'; winProb = 15; }
      else if (progress > 1.0) { velocity = 'slow'; winProb = 30; }
      else if (progress < 0.5 && o.stage === 'Negotiation') { velocity = 'fast'; winProb = 75; }
      else if (o.stage === 'Proposal') { winProb = 55; }
      else if (o.stage === 'Discovery') { winProb = 25; }
      else if (o.stage === 'Negotiation') { winProb = 65; }

      return {
        opp_id: o.id,
        opp_name: o.name,
        account_name: account?.name ?? 'Unknown',
        amount: o.amount ?? 0,
        current_stage: o.stage,
        predicted_close_days: remaining,
        win_probability: winProb,
        velocity,
        rep_name: rep?.name ?? 'Unknown',
      };
    })
    .sort((a, b) => b.win_probability - a.win_probability);
}

function generateBurnoutRisks(): RepBurnoutRisk[] {
  return mockReps.map(rep => {
    const signals: string[] = [];
    let riskScore = 0;

    if (rep.capacity_score < 30) { signals.push('Very low capacity'); riskScore += 40; }
    else if (rep.capacity_score < 50) { signals.push('Below-average capacity'); riskScore += 20; }

    const repAccounts = mockAccounts.filter(a => a.owner_rep_id === rep.id);
    if (repAccounts.length > 3) { signals.push(`${repAccounts.length} active accounts`); riskScore += 15; }

    if (rep.pipeline_value > 2_000_000) { signals.push('Heavy pipeline ($2M+)'); riskScore += 15; }

    if (rep.ramp_status === 'ramping') { signals.push('Still ramping'); riskScore += 10; }

    const stale = repAccounts.filter(a => {
      if (!a.last_activity_at) return true;
      return Math.floor((Date.now() - new Date(a.last_activity_at).getTime()) / 86400000) > 60;
    });
    if (stale.length > 0) { signals.push(`${stale.length} stale accounts`); riskScore += stale.length * 10; }

    const trend: RepBurnoutRisk['trend'] = riskScore > 50 ? 'declining' : riskScore > 25 ? 'stable' : 'improving';

    return {
      rep_id: rep.id,
      rep_name: rep.name,
      risk_score: Math.min(100, riskScore),
      signals,
      capacity: rep.capacity_score,
      trend,
    };
  }).sort((a, b) => b.risk_score - a.risk_score);
}

export function PredictiveAnalytics() {
  const churnPredictions = generateChurnPredictions();
  const dealForecasts = generateDealForecasts();
  const burnoutRisks = generateBurnoutRisks();

  const totalForecastedRevenue = dealForecasts.reduce(
    (s, d) => s + d.amount * (d.win_probability / 100), 0
  );

  const riskColors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  const velocityColors = {
    fast: 'text-green-600',
    normal: 'text-blue-600',
    slow: 'text-amber-600',
    stalled: 'text-red-600',
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-xs font-medium text-red-700">Churn Risk</p>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {churnPredictions.filter(p => p.risk_level === 'critical' || p.risk_level === 'high').length}
          </p>
          <p className="text-xs text-red-600">accounts at risk</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-blue-700">Open Deals</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{dealForecasts.length}</p>
          <p className="text-xs text-blue-600">in pipeline</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-green-700">Weighted Forecast</p>
          </div>
          <p className="text-2xl font-bold text-green-700">${(totalForecastedRevenue / 1_000).toFixed(0)}K</p>
          <p className="text-xs text-green-600">probability-adjusted</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-amber-500" />
            <p className="text-xs font-medium text-amber-700">Burnout Risk</p>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {burnoutRisks.filter(r => r.risk_score > 40).length}
          </p>
          <p className="text-xs text-amber-600">reps flagged</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Churn Predictions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Churn Predictions
          </h2>
          <p className="text-xs text-gray-500 mb-4">Accounts predicted to disengage based on activity decay patterns</p>
          <div className="space-y-2">
            {churnPredictions.map(p => (
              <div key={p.account_id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{p.account_name}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${riskColors[p.risk_level]}`}>
                      {p.risk_level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.reason}</p>
                  <p className="text-xs text-gray-400">Owner: {p.owner}</p>
                </div>
                <div className="text-right ml-4">
                  <ScoreBadge score={p.current_score} size="sm" />
                  <p className="text-xs text-red-600 mt-1 font-medium">~{p.predicted_churn_days}d to churn</p>
                </div>
              </div>
            ))}
            {churnPredictions.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center">No churn risks detected.</p>
            )}
          </div>
        </div>

        {/* Deal Velocity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Deal Velocity Forecast
          </h2>
          <p className="text-xs text-gray-500 mb-4">Predicted close dates and win probability for open deals</p>
          <div className="space-y-2">
            {dealForecasts.map(d => (
              <div key={d.opp_id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{d.opp_name}</p>
                  <p className="text-xs text-gray-500">{d.account_name} · {d.rep_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{d.current_stage}</span>
                    <span className={`text-xs font-medium capitalize ${velocityColors[d.velocity]}`}>
                      {d.velocity}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-bold text-gray-900">${(d.amount / 1_000).toFixed(0)}K</p>
                  <p className={`text-xs font-medium ${d.win_probability >= 60 ? 'text-green-600' : d.win_probability >= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                    {d.win_probability}% win prob
                  </p>
                  <p className="text-xs text-gray-400">{d.predicted_close_days}d to close</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rep Burnout Risk */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Rep Burnout Detection
          </h2>
          <p className="text-xs text-gray-500 mb-4">Early warning signals based on capacity, workload, and engagement patterns</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {burnoutRisks.map(r => (
              <div key={r.rep_id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{r.rep_name}</p>
                    <span className={`flex items-center gap-1 text-xs ${
                      r.trend === 'declining' ? 'text-red-600' :
                      r.trend === 'stable' ? 'text-gray-500' :
                      'text-green-600'
                    }`}>
                      {r.trend === 'declining' ? <TrendingDown className="h-3 w-3" /> :
                       r.trend === 'improving' ? <TrendingUp className="h-3 w-3" /> : null}
                      {r.trend}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {r.signals.map((s, i) => (
                      <span key={i} className="rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-500">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    r.risk_score > 50 ? 'bg-red-100 text-red-700' :
                    r.risk_score > 25 ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    <span className="text-sm font-bold">{r.risk_score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
