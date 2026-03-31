import CampaignWizard from '@/components/campaigns/CampaignWizard';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/campaigns" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
        <p className="text-sm text-gray-500 mt-1">
          Follow the steps below to set up your AI-powered lead generation campaign
        </p>
      </div>
      <CampaignWizard />
    </div>
  );
}
