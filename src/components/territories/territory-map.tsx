import { useState } from 'react';
import { ScoreBadge } from '@/components/shared/score-badge';
import { mockAccounts, mockAccountScores, mockReps, getRepById } from '@/lib/mock-data';

// US state coordinates (simplified centroid positions for SVG map)
const stateCoords: Record<string, { x: number; y: number }> = {
  CA: { x: 8, y: 42 }, WA: { x: 12, y: 12 }, TX: { x: 42, y: 70 },
  IL: { x: 60, y: 35 }, NY: { x: 82, y: 25 }, MA: { x: 88, y: 22 },
  CT: { x: 86, y: 27 }, MI: { x: 66, y: 28 }, PA: { x: 78, y: 30 },
  FL: { x: 75, y: 72 }, OH: { x: 70, y: 33 }, GA: { x: 72, y: 58 },
  CO: { x: 30, y: 40 }, AZ: { x: 18, y: 55 }, NV: { x: 12, y: 35 },
  OR: { x: 10, y: 18 }, UT: { x: 20, y: 40 }, NM: { x: 25, y: 58 },
};

const repColors: Record<string, string> = {
  'rep-001': '#3b82f6', // Sarah - blue
  'rep-002': '#10b981', // Marcus - emerald
  'rep-003': '#8b5cf6', // Priya - violet
  'rep-004': '#f59e0b', // David - amber
};

interface HoveredAccount {
  account: typeof mockAccounts[0];
  score: number;
  rep: string;
  x: number;
  y: number;
}

export function TerritoryMap() {
  const [hovered, setHovered] = useState<HoveredAccount | null>(null);
  const [selectedRep, setSelectedRep] = useState<string | null>(null);

  const accountsWithCoords = mockAccounts
    .map(a => {
      const coords = stateCoords[a.state ?? ''];
      const score = mockAccountScores.find(s => s.account_id === a.id);
      return coords ? { ...a, coords, score: score?.total_score ?? 0 } : null;
    })
    .filter(Boolean) as (typeof mockAccounts[0] & { coords: { x: number; y: number }; score: number })[];

  const filtered = selectedRep
    ? accountsWithCoords.filter(a => a.owner_rep_id === selectedRep)
    : accountsWithCoords;

  function getSize(revenue: number | null): number {
    if (!revenue) return 8;
    if (revenue >= 500_000_000) return 18;
    if (revenue >= 100_000_000) return 14;
    if (revenue >= 50_000_000) return 11;
    return 8;
  }

  function getColor(account: typeof mockAccounts[0]): string {
    if (account.owner_rep_id && repColors[account.owner_rep_id]) {
      return repColors[account.owner_rep_id]!;
    }
    return '#6b7280'; // unassigned
  }

  return (
    <div className="space-y-4">
      {/* Rep filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Filter by rep:</span>
        <button
          onClick={() => setSelectedRep(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !selectedRep ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {mockReps.map(rep => (
          <button
            key={rep.id}
            onClick={() => setSelectedRep(selectedRep === rep.id ? null : rep.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedRep === rep.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={selectedRep === rep.id ? { backgroundColor: repColors[rep.id] } : undefined}
          >
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: repColors[rep.id] }} />
            {rep.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <svg viewBox="0 0 100 85" className="w-full h-full">
          {/* US outline (simplified) */}
          <path
            d="M5,15 L5,70 L95,70 L95,15 Z"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.3"
            strokeDasharray="1,1"
          />

          {/* Grid lines */}
          {[20, 40, 60, 80].map(x => (
            <line key={`vx${x}`} x1={x} y1={10} x2={x} y2={75} stroke="#f3f4f6" strokeWidth="0.2" />
          ))}
          {[20, 35, 50, 65].map(y => (
            <line key={`hy${y}`} x1={5} y1={y} x2={95} y2={y} stroke="#f3f4f6" strokeWidth="0.2" />
          ))}

          {/* Territory regions */}
          <rect x="5" y="10" width="30" height="65" rx="2" fill={selectedRep === 'rep-001' || selectedRep === 'rep-004' ? 'rgba(59,130,246,0.05)' : 'transparent'} stroke={selectedRep === 'rep-001' || selectedRep === 'rep-004' ? 'rgba(59,130,246,0.2)' : 'transparent'} strokeWidth="0.3" strokeDasharray="2,2" />
          <rect x="35" y="10" width="30" height="65" rx="2" fill={selectedRep === 'rep-002' ? 'rgba(16,185,129,0.05)' : 'transparent'} stroke={selectedRep === 'rep-002' ? 'rgba(16,185,129,0.2)' : 'transparent'} strokeWidth="0.3" strokeDasharray="2,2" />
          <rect x="65" y="10" width="30" height="65" rx="2" fill={selectedRep === 'rep-003' ? 'rgba(139,92,246,0.05)' : 'transparent'} stroke={selectedRep === 'rep-003' ? 'rgba(139,92,246,0.2)' : 'transparent'} strokeWidth="0.3" strokeDasharray="2,2" />

          {/* Territory labels */}
          <text x="20" y="8" textAnchor="middle" className="text-[3px] fill-gray-400 font-medium">WEST</text>
          <text x="50" y="8" textAnchor="middle" className="text-[3px] fill-gray-400 font-medium">CENTRAL</text>
          <text x="80" y="8" textAnchor="middle" className="text-[3px] fill-gray-400 font-medium">EAST</text>

          {/* Account dots */}
          {filtered.map(account => {
            const size = getSize(account.annual_revenue);
            const color = getColor(account);
            const opacity = account.score >= 70 ? 1 : account.score >= 40 ? 0.7 : 0.4;

            return (
              <g key={account.id}>
                {/* Glow ring for high-score */}
                {account.score >= 80 && (
                  <circle
                    cx={account.coords.x}
                    cy={account.coords.y}
                    r={size / 2 + 2}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.3"
                    opacity={0.3}
                  >
                    <animate attributeName="r" from={size / 2 + 1} to={size / 2 + 3} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={account.coords.x}
                  cy={account.coords.y}
                  r={size / 2}
                  fill={color}
                  opacity={opacity}
                  className="cursor-pointer transition-all duration-200 hover:opacity-100"
                  onMouseEnter={() => setHovered({
                    account,
                    score: account.score,
                    rep: account.owner_rep_id ? getRepById(account.owner_rep_id)?.name ?? 'Unknown' : 'Unassigned',
                    x: account.coords.x,
                    y: account.coords.y,
                  })}
                  onMouseLeave={() => setHovered(null)}
                />
                {/* Score label for large dots */}
                {size >= 14 && (
                  <text
                    x={account.coords.x}
                    y={account.coords.y + 1}
                    textAnchor="middle"
                    className="text-[2.5px] fill-white font-bold pointer-events-none"
                  >
                    {account.score}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute z-10 rounded-lg border border-gray-200 bg-white p-3 shadow-xl pointer-events-none"
            style={{
              left: `${hovered.x}%`,
              top: `${hovered.y}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <p className="text-sm font-semibold text-gray-900">{hovered.account.name}</p>
            <p className="text-xs text-gray-500">{hovered.account.industry} · {hovered.account.city}, {hovered.account.state}</p>
            <div className="flex items-center gap-2 mt-1">
              <ScoreBadge score={hovered.score} size="sm" />
              <span className="text-xs text-gray-500">{hovered.rep}</span>
            </div>
            {hovered.account.annual_revenue && (
              <p className="text-xs text-gray-400 mt-0.5">${(hovered.account.annual_revenue / 1_000_000).toFixed(0)}M revenue</p>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 right-3 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm px-3 py-2">
          <p className="text-[10px] font-medium text-gray-500 mb-1">Dot size = Revenue</p>
          <p className="text-[10px] font-medium text-gray-500">Opacity = Score</p>
          <div className="flex items-center gap-1 mt-1.5">
            <div className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-[10px] text-gray-400">Unassigned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
