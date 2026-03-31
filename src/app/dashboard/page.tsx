'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import MetricCard from '@/components/dashboard/MetricCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  MegaphoneIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { formatNumber, formatDate, getStatusColor } from '@/lib/utils';
import { Campaign } from '@/types';

interface DashboardStats {
  overview: {
    totalLeads: number;
    totalMessagesSent: number;
    openRate: number;
    conversionRate: number;
    activeCampaigns: number;
    replyRate: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, campaignsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/campaigns?limit=5'),
        ]);
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setStats(analyticsData);
        }
        if (campaignsRes.ok) {
          const campaignsData = await campaignsRes.json();
          setCampaigns(campaignsData.data || []);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const mockActivities = [
    { id: '1', type: 'lead_discovered' as const, description: '15 new leads discovered in Healthcare campaign', platform: 'linkedin', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', type: 'message_sent' as const, description: '8 personalized messages sent and approved', platform: 'linkedin', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: '3', type: 'reply_received' as const, description: 'Sarah Johnson replied to your outreach', platform: 'twitter', timestamp: new Date(Date.now() - 10800000).toISOString() },
    { id: '4', type: 'campaign_started' as const, description: 'Professional Services Q1 campaign launched', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: '5', type: 'conversion' as const, description: 'Lead converted: Apex Consulting signed up', timestamp: new Date(Date.now() - 172800000).toISOString() },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0]}!{' '}
            <span className="text-gray-400 text-xl">ð</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your leads are waiting. Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button variant="accent" icon={<PlusIcon className="h-4 w-4" />}>
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          title="Total Leads Discovered"
          value={formatNumber(stats?.overview.totalLeads || 0)}
          icon={<UserGroupIcon className="h-6 w-6" />}
          change={12}
          color="blue"
          subtitle="All campaigns"
        />
        <MetricCard
          title="Messages Sent"
          value={formatNumber(stats?.overview.totalMessagesSent || 0)}
          icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
          change={8}
          color="green"
          subtitle="Total outreach"
        />
        <MetricCard
          title="Open Rate"
          value={`${stats?.overview.openRate || 0}%`}
          icon={<ChartBarIcon className="h-6 w-6" />}
          change={3}
          color="orange"
          subtitle="Avg across campaigns"
        />
        <MetricCard
          title="Active Campaigns"
          value={stats?.overview.activeCampaigns || 0}
          icon={<MegaphoneIcon className="h-6 w-6" />}
          color="purple"
          subtitle="Currently running"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Reply Rate</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.overview.replyRate || 0}%</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(stats?.overview.replyRate || 0, 100)}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.overview.conversionRate || 0}%</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
            <div className="h-full bg-accent-green rounded-full" style={{ width: `${Math.min(stats?.overview.conversionRate || 0, 100)}%` }} />
          </div>
        </div>
        <div className="bg-gradient-card text-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-200 mb-1">Pro Tip</p>
          <p className="font-medium text-sm leading-relaxed">
            Campaigns with personalized messages get 3x higher reply rates. Use AI message generation!
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Campaigns</h2>
            <Link href="/dashboard/campaigns" className="text-sm text-primary-blue hover:text-blue-800 flex items-center gap-1">
              View all <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center">
                <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-900 mb-1">No campaigns yet</p>
                <p className="text-sm text-gray-500 mb-4">Create your first AI-powered lead generation campaign</p>
                <Link href="/dashboard/campaigns/new">
                  <Button variant="primary" size="sm">Create Campaign</Button>
                </Link>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/dashboard/campaigns/${campaign._id}`} className="font-medium text-gray-900 hover:text-primary-blue text-sm truncate">
                          {campaign.name}
                        </Link>
                        <Badge status={campaign.status} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>ð¤ {campaign.stats?.leadsDiscovered || 0} leads</span>
                        <span>ð¤ {campaign.stats?.messagesSent || 0} sent</span>
                        <span>â {campaign.stats?.conversions || 0} converted</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 ml-4">
                      {formatDate(campaign.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <ActivityFeed activities={mockActivities} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/dashboard/campaigns/new">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-blue hover:bg-blue-50 transition-all cursor-pointer group">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-primary-blue transition-colors">
                <PlusIcon className="h-5 w-5 text-primary-blue group-hover:text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Start New Campaign</p>
                <p className="text-xs text-gray-500">AI-powered lead gen</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/messages?status=pending_approval">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-accent-orange hover:bg-orange-50 transition-all cursor-pointer group">
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-accent-orange transition-colors">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-accent-orange group-hover:text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Review Messages</p>
                <p className="text-xs text-gray-500">Pending approval</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/analytics">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-accent-green hover:bg-green-50 transition-all cursor-pointer group">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-accent-green transition-colors">
                <ChartBarIcon className="h-5 w-5 text-accent-green group-hover:text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">View Analytics</p>
                <p className="text-xs text-gray-500">Campaign performance</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
