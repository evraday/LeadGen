import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'dark' | 'primary';
  className?: string;
}

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const colors = {
  white: 'border-white border-t-transparent',
  dark: 'border-gray-700 border-t-transparent',
  primary: 'border-primary-blue border-t-transparent',
};

export default function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2',
        sizes[size],
        colors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
