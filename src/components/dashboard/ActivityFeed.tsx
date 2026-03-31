import { timeAgo, getPlatformIcon } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface Activity {
  id: string;
  type: 'lead_discovered' | 'message_sent' | 'reply_received' | 'campaign_started' | 'conversion';
  description: string;
  platform?: string;
  timestamp: string;
  status?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

const activityConfig: Record<string, { color: string; icon: string }> = {
  lead_discovered: { color: 'bg-blue-100 text-blue-800', icon: 'ð¤' },
  message_sent: { color: 'bg-purple-100 text-purple-800', icon: 'ð¤' },
  reply_received: { color: 'bg-green-100 text-green-800', icon: 'ð¬' },
  campaign_started: { color: 'bg-orange-100 text-orange-800', icon: 'ð' },
  conversion: { color: 'bg-green-100 text-green-800', icon: 'â' },
};

export default function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayItems = activities.slice(0, maxItems);

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No recent activity</p>
        <p className="text-xs mt-1">Activity will appear here as your campaigns run</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-6">
        {displayItems.map((activity, idx) => {
          const config = activityConfig[activity.type] || { color: 'bg-gray-100 text-gray-800', icon: 'â¢' };
          return (
            <li key={activity.id}>
              <div className="relative pb-6">
                {idx < displayItems.length - 1 && (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${config.color}`}>
                      {config.icon}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 leading-snug">{activity.description}</p>
                      <span className="text-xs text-gray-400 shrink-0 mt-0.5">{timeAgo(activity.timestamp)}</span>
                    </div>
                    {activity.platform && (
                      <span className="text-xs text-gray-500 mt-0.5 block">
                        {getPlatformIcon(activity.platform)} {activity.platform}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
