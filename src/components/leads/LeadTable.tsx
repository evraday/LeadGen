'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lead } from '@/types';
import Badge from '@/components/ui/Badge';
import { cn, formatDate, getPlatformIcon, generateInitials, truncate } from '@/lib/utils';
import {
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

interface LeadTableProps {
  leads: Lead[];
  onStatusChange?: (leadId: string, status: Lead['status']) => void;
  onDelete?: (leadId: string) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: { value: Lead['status']; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'replied', label: 'Replied' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'unqualified', label: 'Unqualified' },
  { value: 'do_not_contact', label: 'Do Not Contact' },
];

export default function LeadTable({ leads, onStatusChange, onDelete, isLoading }: LeadTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-8 text-center text-gray-500">Loading leads...</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 text-center">
          <div className="text-4xl mb-3">ð¤</div>
          <p className="font-medium text-gray-900">No leads found</p>
          <p className="text-sm text-gray-500 mt-1">
            Run a lead discovery campaign to find your first prospects
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">Lead <ChevronUpDownIcon className="h-3.5 w-3.5" /></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-blue to-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {generateInitials(lead.name)}
                    </div>
                    <div>
                      <Link
                        href={`/dashboard/leads/${lead._id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-primary-blue transition-colors"
                      >
                        {lead.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{truncate(lead.title, 40)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{truncate(lead.company, 30)}</p>
                    {lead.industry && <p className="text-xs text-gray-500">{lead.industry}</p>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <span>{getPlatformIcon(lead.source)}</span>
                    <span className="capitalize">{lead.source}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {onStatusChange ? (
                    <select
                      value={lead.status}
                      onChange={(e) => onStatusChange(lead._id, e.target.value as Lead['status'])}
                      className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary-blue"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge status={lead.status} dot />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-16">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          (lead.score || 0) >= 70 ? 'bg-accent-green' :
                          (lead.score || 0) >= 40 ? 'bg-accent-orange' : 'bg-red-400'
                        )}
                        style={{ width: `${lead.score || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{lead.score || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {lead.linkedinUrl && (
                      <a
                        href={lead.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-blue transition-colors"
                        title="View LinkedIn"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </a>
                    )}
                    <Link
                      href={`/dashboard/leads/${lead._id}`}
                      className="text-xs font-medium text-primary-blue hover:text-blue-800"
                    >
                      View
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(lead._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
