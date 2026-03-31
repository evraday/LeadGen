'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';
import MetricCard from '@/components/dashboard/MetricCard';
import {
  MessageActivityChart,
  ConversionFunnelChart,
  LeadsBySourceChart,
  LeadStatusChart,
} from '@/components/analytics/AnalyticsCharts';
import { AnalyticsData } from '@/types';
import { formatNumber } from '@/lib/utils';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  MegaphoneIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-gray-500">No analytics data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Campaign Performance Insights</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<ArrowDownTrayIcon className="h-4 w-4" />}
          onClick={() => toast.success('Report export coming soon')}
        >
          Export Report
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          title="Total Leads"
          value={formatNumber(data.overview.totalLeads)}
          icon={<UserGroupIcon className="h-6 w-6" />}
          change={12}
          color="blue"
        />
        <MetricCard
          title="Messages Sent"
          value={formatNumber(data.overview.totalMessagesSent)}
          icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
          change={8}
          color="green"
        />
        <MetricCard
          title="Open Rate"
          value={`${data.overview.openRate}%`}
          icon={<ChartBarIcon className="h-6 w-6" />}
          change={3}
          color="orange"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.overview.conversionRate}%`}
          icon={<MegaphoneIcon className="h-6 w-6" />}
          change={-1}
          color="purple"
        />
      </div>

      {/* Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Reply Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.overview.replyRate}%</p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(data.overview.replyRate, 100)}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">of messages sent receive replies</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.overview.activeCampaigns}</p>
          <p className="text-xs text-gray-500 mt-4">Currently running campaigns</p>
        </div>
        <div className="bg-gradient-card text-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-200">Platform Insight</p>
          <p className="font-medium mt-2 text-sm leading-relaxed">
            LinkedIn campaigns show 40% higher response rates compared to other platforms in your account.
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Message Activity (Last 14 Days)</h3>
          {data.messagesByDay.length > 0 ? (
            <MessageActivityChart data={data.messagesByDay} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No message activity yet
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
          {data.conversionFunnel.some((f) => f.count > 0) ? (
            <ConversionFunnelChart data={data.conversionFunnel} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No funnel data yet. Discover leads to see the funnel.
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Leads by Source</h3>
          {data.leadsBySource.length > 0 ? (
            <LeadsBySourceChart data={data.leadsBySource} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No lead source data yet
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Lead Status Distribution</h3>
          {data.leadsByStatus.length > 0 ? (
            <LeadStatusChart data={data.leadsByStatus} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No lead status data yet
            </div>
          )}
        </div>
      </div>

      {/* Top Campaigns Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Top Campaign Performance</h3>
        </div>
        {data.topCampaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No campaign data yet. Create and launch a campaign to see performance metrics.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Campaign', 'Leads', 'Messages', 'Conversions', 'Conv. Rate'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topCampaigns.map((campaign) => (
                  <tr key={campaign.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatNumber(campaign.leads)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatNumber(campaign.messages)}</td>
                    <td className="px-6 py-4 text-sm text-accent-green font-medium">{formatNumber(campaign.conversions)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-16">
                          <div
                            className="h-full bg-accent-green rounded-full"
                            style={{ width: `${Math.min(campaign.rate, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{campaign.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
