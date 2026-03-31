import { cn } from '@/lib/utils';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

interface BadgeProps {
  status?: string;
  label?: string;
  color?: string;
  className?: string;
  dot?: boolean;
}

export default function Badge({ status, label, color, className, dot = false }: BadgeProps) {
  const colorClass = color || (status ? getStatusColor(status) : 'bg-gray-100 text-gray-800');
  const displayLabel = label || (status ? getStatusLabel(status) : '');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClass,
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      )}
      {displayLabel}
    </span>
  );
}
