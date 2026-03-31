import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

export function calculateRate(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    replied: 'bg-purple-100 text-purple-800',
    qualified: 'bg-orange-100 text-orange-800',
    converted: 'bg-green-100 text-green-800',
    unqualified: 'bg-gray-100 text-gray-800',
    do_not_contact: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    pending_approval: 'bg-orange-100 text-orange-800',
    approved: 'bg-blue-100 text-blue-800',
    sent: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-teal-100 text-teal-800',
    opened: 'bg-purple-100 text-purple-800',
    failed: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    replied: 'Replied',
    qualified: 'Qualified',
    converted: 'Converted',
    unqualified: 'Unqualified',
    do_not_contact: 'Do Not Contact',
    draft: 'Draft',
    active: 'Active',
    paused: 'Paused',
    completed: 'Completed',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    sent: 'Sent',
    delivered: 'Delivered',
    opened: 'Opened',
    failed: 'Failed',
    rejected: 'Rejected',
  };
  return labels[status] || status;
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    linkedin: 'ð¼',
    twitter: 'ð¦',
    google: 'ð',
    instagram: 'ð·',
    tiktok: 'ðµ',
    email: 'ð§',
  };
  return icons[platform] || 'ð';
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    linkedin: 'bg-blue-700',
    twitter: 'bg-sky-500',
    google: 'bg-red-500',
    instagram: 'bg-pink-500',
    tiktok: 'bg-black',
    email: 'bg-gray-600',
  };
  return colors[platform] || 'bg-gray-500';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
