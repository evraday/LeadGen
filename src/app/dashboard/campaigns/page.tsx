'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { Campaign } from '@/types';
import { formatDate, formatNumber } from '@/lib/utils';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const STATUS_FILTERS = [
  { value: '', label: 'All Campaigns' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchCampaigns = async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/campaigns?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.data || []);
      }
    } catch {
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const handleStatusChange = async (campaignId: string, newStatus: Campaign['status']) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c._id === campaignId ? { ...c, status: newStatus } : c))
        );
        toast.success(`Campaign ${newStatus}`);
      }
    } catch {
      toast.error('Failed to update campaign');
    }
  };

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This will also delete all associated leads.')) return;
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c._id !== campaignId));
        toast.success('Campaign deleted');
      }
    } catch {
      toast.error('Failed to delete campaign');
    }
  };

  const filtered = campaigns.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your lead generation campaigns</p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button variant="accent" icon={<PlusIcon className="h-4 w-4" />}>
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">ð</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {search || statusFilter ? 'No campaigns match your filters' : 'No campaigns yet'}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {search || statusFilter
              ? 'Try adjusting your search or filter'
              : 'Create your first AI-powered lead generation campaign to get started'}
          </p>
          {!search && !statusFilter && (
            <Link href="/dashboard/campaigns/new">
              <Button variant="primary">Create Your First Campaign</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((campaign) => (
            <div key={campaign._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Link href={`/dashboard/campaigns/${campaign._id}`} className="text-lg font-semibold text-gray-900 hover:text-primary-blue transition-colors">
                      {campaign.name}
                    </Link>
                    <Badge status={campaign.status} dot />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {campaign.product?.name} â¢ Created {formatDate(campaign.createdAt)}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Leads Found', value: formatNumber(campaign.stats?.leadsDiscovered || 0), color: 'text-primary-blue' },
                      { label: 'Messages Sent', value: formatNumber(campaign.stats?.messagesSent || 0), color: 'text-purple-600' },
                      { label: 'Opened', value: formatNumber(campaign.stats?.messagesOpened || 0), color: 'text-accent-orange' },
                      { label: 'Conversions', value: formatNumber(campaign.stats?.conversions || 0), color: 'text-accent-green' },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {campaign.status === 'draft' && (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleStatusChange(campaign._id, 'active')}
                      icon={<PlayIcon className="h-3.5 w-3.5" />}
                    >
                      Launch
                    </Button>
                  )}
                  {campaign.status === 'active' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange(campaign._id, 'paused')}
                      icon={<PauseIcon className="h-3.5 w-3.5" />}
                    >
                      Pause
                    </Button>
                  )}
                  {campaign.status === 'paused' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(campaign._id, 'active')}
                      icon={<PlayIcon className="h-3.5 w-3.5" />}
                    >
                      Resume
                    </Button>
                  )}
                  <Link href={`/dashboard/campaigns/${campaign._id}`}>
                    <Button variant="ghost" size="sm" icon={<ArrowRightIcon className="h-3.5 w-3.5" />} iconPosition="right">
                      View
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDelete(campaign._id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 justify-center"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
