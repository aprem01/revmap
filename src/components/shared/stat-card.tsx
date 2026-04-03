import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
}

export function StatCard({ label, value, change, changeType = 'neutral', icon: Icon }: StatCardProps) {
  const changeColor =
    changeType === 'positive' ? 'text-green-600' :
    changeType === 'negative' ? 'text-red-600' :
    'text-gray-500';

  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      {change && (
        <p className={`mt-1.5 text-xs font-medium ${changeColor}`}>{change}</p>
      )}
    </div>
  );
}
