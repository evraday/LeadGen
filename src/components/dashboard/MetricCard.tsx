import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  subtitle?: string;
  className?: string;
}

const colorConfig = {
  blue: { bg: 'bg-blue-50', icon: 'text-primary-blue', badge: 'bg-blue-100' },
  green: { bg: 'bg-green-50', icon: 'text-accent-green', badge: 'bg-green-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-accent-orange', badge: 'bg-orange-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', badge: 'bg-red-100' },
};

export default function MetricCard({
  title,
  value,
  icon,
  change,
  changeLabel,
  color = 'blue',
  subtitle,
  className,
}: MetricCardProps) {
  const config = colorConfig[color];
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn('p-3 rounded-xl', config.bg)}>
          <div className={cn('h-6 w-6', config.icon)}>{icon}</div>
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded',
              isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            )}
          >
            {isPositive ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" />
            )}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-gray-500">{changeLabel || 'vs last month'}</span>
        </div>
      )}
    </div>
  );
}
