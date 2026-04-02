interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function ScoreBadge({ score, size = 'md', label }: ScoreBadgeProps) {
  const color =
    score >= 80 ? 'bg-green-100 text-green-800 border-green-200' :
    score >= 60 ? 'bg-blue-100 text-blue-800 border-blue-200' :
    score >= 40 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-red-100 text-red-800 border-red-200';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${color} ${sizeClasses[size]}`}>
      {score}
      {label && <span className="font-normal opacity-75">{label}</span>}
    </span>
  );
}
