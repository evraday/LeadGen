'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/Input';
import { Lead } from '@/types';
import { formatDate, formatDateTime, getPlatformIcon, generateInitials, getStatusColor } from '@/lib/utils';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  TagIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const STATUS_OPTIONS: { value: Lead['status']; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'replied', label: 'Replied' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'converted', label: 'Converted' },
  { value: 'unqualified', label: 'Unqualified' },
  { value: 'do_not_contact', label: 'Do Not Contact' },
];

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Lead['status']>('new');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await fetch(`/api/leads/${leadId}`);
        if (res.ok) {
          const data = await res.json();
          setLead(data);
          setNotes(data.notes || '');
          setStatus(data.status);
        }
      } catch {
        toast.error('Failed to load lead');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLead();
  }, [leadId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLead(updated);
        toast.success('Lead updated');
      }
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Lead not found</p>
        <Link href="/dashboard/leads" className="text-primary-blue mt-2 block">Back to Leads</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/dashboard/leads" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Leads
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lead Profile */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-blue to-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                {generateInitials(lead.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900">{lead.name}</h1>
                <p className="text-gray-600">{lead.title}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge status={lead.status} dot />
                  <span className="text-xs text-gray-500">
                    {getPlatformIcon(lead.source)} Found on {lead.source}
                  </span>
                  {lead.score !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      lead.score >= 70 ? 'bg-green-100 text-green-700' :
                      lead.score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      Score: {lead.score}/100
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                  {lead.industry && <p className="text-xs text-gray-500">{lead.industry}</p>}
                </div>
              </div>
              {lead.email && (
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-sm font-medium text-primary-blue hover:underline">{lead.email}</a>
                  </div>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-start gap-3">
                  <PhoneIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{lead.phone}</p>
                  </div>
                </div>
              )}
              {lead.location && (
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{lead.location}</p>
                  </div>
                </div>
              )}
              {lead.companySize && (
                <div className="flex items-start gap-3">
                  <TagIcon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Company Size</p>
                    <p className="text-sm font-medium text-gray-900">{lead.companySize} employees</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-4 flex gap-3 flex-wrap">
              {lead.linkedinUrl && (
                <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-primary-blue px-3 py-1.5 rounded-full hover:bg-blue-100">
                  ð¼ LinkedIn <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              )}
              {lead.twitterUrl && (
                <a href={lead.twitterUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-sky-50 text-sky-600 px-3 py-1.5 rounded-full hover:bg-sky-100">
                  ð¦ Twitter <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={5}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                  status === opt.value ? 'bg-blue-50 border border-primary-blue' : 'hover:bg-gray-50 border border-transparent'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                    className="sr-only"
                  />
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    status === opt.value ? 'border-primary-blue bg-primary-blue' : 'border-gray-300'
                  }`}>
                    {status === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={handleSave}
              loading={isSaving}
              icon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Added</span>
              <span className="font-medium text-gray-900">{formatDate(lead.createdAt)}</span>
            </div>
            {lead.lastActivity && (
              <div className="flex justify-between">
                <span>Last Activity</span>
                <span className="font-medium text-gray-900">{formatDate(lead.lastActivity)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
