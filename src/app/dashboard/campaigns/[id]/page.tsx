'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import LeadTable from '@/components/leads/LeadTable';
import { Campaign, Lead } from '@/types';
import { formatDate, formatNumber, getPlatformIcon } from '@/lib/utils';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isSendingMessages, setIsSendingMessages] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'icp'>('leads');

  const fetchData = async () => {
    try {
      const [campaignRes, leadsRes] = await Promise.all([
        fetch(`/api/campaigns/${campaignId}`),
        fetch(`/api/leads?campaignId=${campaignId}&limit=100`),
      ]);
      if (campaignRes.ok) setCampaign(await campaignRes.json());
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.data || []);
      }
    } catch {
      toast.error('Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  const handleDiscoverLeads = async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch('/api/leads/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, platform: 'all', count: 20 }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.count} new leads discovered!`);
        fetchData();
      } else {
        throw new Error('Discovery failed');
      }
    } catch {
      toast.error('Lead discovery failed. Please try again.');
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleSendMessages = async () => {
    const newLeads = leads.filter((l) => l.status === 'new');
    if (newLeads.length === 0) {
      toast.error('No new leads to message');
      return;
    }
    setIsSendingMessages(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          leadIds: newLeads.slice(0, 10).map((l) => l._id),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.count} messages created! Go to Messages to approve.`);
      }
    } catch {
      toast.error('Failed to create messages');
    } finally {
      setIsSendingMessages(false);
    }
  };

  const handleStatusChange = async (leadId: string, status: Lead['status']) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l._id === leadId ? { ...l, status } : l)));
        toast.success('Lead status updated');
      }
    } catch {
      toast.error('Failed to update lead');
    }
  };

  const handleCampaignStatusChange = async (status: Campaign['status']) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setCampaign((prev) => prev ? { ...prev, status } : null);
        toast.success(`Campaign ${status}`);
      }
    } catch {
      toast.error('Failed to update campaign');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Campaign not found</p>
        <Link href="/dashboard/campaigns" className="text-primary-blue mt-2 block">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/campaigns" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
              <Badge status={campaign.status} dot />
            </div>
            <p className="text-sm text-gray-500">
              {campaign.product?.name} â¢ Created {formatDate(campaign.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {campaign.status === 'draft' && (
              <Button
                variant="accent"
                size="sm"
                onClick={() => handleCampaignStatusChange('active')}
                icon={<PlayIcon className="h-4 w-4" />}
              >
                Launch Campaign
              </Button>
            )}
            {campaign.status === 'active' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCampaignStatusChange('paused')}
                icon={<PauseIcon className="h-4 w-4" />}
              >
                Pause
              </Button>
            )}
            {campaign.status === 'paused' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCampaignStatusChange('active')}
                icon={<PlayIcon className="h-4 w-4" />}
              >
                Resume
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Leads Found', value: campaign.stats?.leadsDiscovered || 0, icon: UserGroupIcon, color: 'bg-blue-50 text-primary-blue' },
          { label: 'Messages Sent', value: campaign.stats?.messagesSent || 0, icon: ChatBubbleLeftRightIcon, color: 'bg-purple-50 text-purple-600' },
          { label: 'Opened', value: campaign.stats?.messagesOpened || 0, icon: ChartBarIcon, color: 'bg-orange-50 text-accent-orange' },
          { label: 'Replies', value: campaign.stats?.replies || 0, icon: SparklesIcon, color: 'bg-green-50 text-accent-green' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stat.value)}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          loading={isDiscovering}
          onClick={handleDiscoverLeads}
          icon={<MagnifyingGlassIcon className="h-4 w-4" />}
        >
          Discover Leads
        </Button>
        <Button
          variant="accent"
          loading={isSendingMessages}
          onClick={handleSendMessages}
          icon={<ChatBubbleLeftRightIcon className="h-4 w-4" />}
          disabled={leads.filter((l) => l.status === 'new').length === 0}
        >
          Send Messages ({leads.filter((l) => l.status === 'new').length} new leads)
        </Button>
        <Link href="/dashboard/messages?status=pending_approval">
          <Button variant="secondary">Review Pending Messages</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {[
            { id: 'leads', label: `Leads (${leads.length})` },
            { id: 'icp', label: 'ICP Profile' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-blue border-primary-blue'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'leads' && (
        <LeadTable leads={leads} onStatusChange={handleStatusChange} />
      )}

      {activeTab === 'icp' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ideal Customer Profile</h3>
            {campaign.icp?.title && (
              <p className="text-sm text-gray-600 mb-4">{campaign.icp.description}</p>
            )}
            <div className="grid sm:grid-cols-2 gap-6">
              {campaign.icp?.targetRoles?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Target Roles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.icp.targetRoles.map((role) => (
                      <span key={role} className="text-xs bg-blue-100 text-primary-blue px-2 py-1 rounded-full">{role}</span>
                    ))}
                  </div>
                </div>
              )}
              {campaign.icp?.industries?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Industries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.icp.industries.map((ind) => (
                      <span key={ind} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{ind}</span>
                    ))}
                  </div>
                </div>
              )}
              {campaign.icp?.painPoints?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pain Points</p>
                  <ul className="space-y-1">
                    {campaign.icp.painPoints.map((pain) => (
                      <li key={pain} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0 mt-1.5" />
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {campaign.icp?.keywords?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.icp.keywords.map((kw) => (
                      <span key={kw} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Product</p>
                <p className="font-medium text-gray-900">{campaign.product?.name}</p>
                <p className="text-sm text-gray-500">{campaign.product?.usp}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Target Channels</p>
                <div className="flex flex-wrap gap-2">
                  {campaign.channels?.map((ch) => (
                    <span key={ch.platform} className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2.5 py-1 rounded-full">
                      {getPlatformIcon(ch.platform)} {ch.platform}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Message Template</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200">
                  {campaign.messageTemplate?.body || 'No message template set'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
