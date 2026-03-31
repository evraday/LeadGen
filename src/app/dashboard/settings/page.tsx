'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  KeyIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const PLAN_DETAILS = {
  starter: {
    name: 'Starter',
    price: '$29/month',
    leads: '500 leads/month',
    features: ['LinkedIn outreach', 'Basic ICP generation', 'Standard analytics'],
    color: 'bg-gray-100 text-gray-700',
  },
  professional: {
    name: 'Professional',
    price: '$79/month',
    leads: '5,000 leads/month',
    features: ['Multi-channel outreach', 'Advanced AI ICP', 'Advanced analytics', 'Compliance framework'],
    color: 'bg-blue-100 text-primary-blue',
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    leads: 'Unlimited',
    features: ['Everything in Pro', 'Dedicated account manager', 'CRM integration', 'API access'],
    color: 'bg-purple-100 text-purple-700',
  },
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'compliance' | 'billing'>('profile');
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    company: '',
  });

  const plan = ((session?.user as { plan?: string })?.plan as keyof typeof PLAN_DETAILS) || 'starter';
  const planDetails = PLAN_DETAILS[plan] || PLAN_DETAILS.starter;

  const TABS = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheckIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  ];

  const handleSaveProfile = () => {
    toast.success('Profile settings saved');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="sm:w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-primary-blue to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {profileData.name ? profileData.name.slice(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{profileData.name}</p>
                  <p className="text-sm text-gray-500">{profileData.email}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${planDetails.color}`}>
                    {planDetails.name} Plan
                  </span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                />
                <Input
                  label="Email Address"
                  value={profileData.email}
                  onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                  type="email"
                  disabled
                  helperText="Email cannot be changed"
                />
                <Input
                  label="Company"
                  value={profileData.company}
                  onChange={(e) => setProfileData((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              <div className="pt-2">
                <Button variant="primary" onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
              {[
                { id: 'new_leads', label: 'New leads discovered', desc: 'Get notified when new leads are found for your campaigns', default: true },
                { id: 'pending_approval', label: 'Messages awaiting approval', desc: 'Alert when messages are ready for your review', default: true },
                { id: 'replies', label: 'Lead replies', desc: 'Notify when a lead replies to your outreach', default: true },
                { id: 'weekly_summary', label: 'Weekly performance summary', desc: 'Weekly email with your campaign metrics', default: false },
                { id: 'campaign_milestones', label: 'Campaign milestones', desc: 'Alerts for campaign completion or major events', default: false },
              ].map((notif) => (
                <label key={notif.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notif.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.desc}</p>
                  </div>
                  <div className="relative shrink-0">
                    <input type="checkbox" defaultChecked={notif.default} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary-blue transition-colors cursor-pointer" />
                    <div className="absolute left-1 top-1 bg-white rounded-full h-4 w-4 shadow transition-all peer-checked:translate-x-5" />
                  </div>
                </label>
              ))}
              <Button variant="primary" onClick={() => toast.success('Notification preferences saved')}>
                Save Preferences
              </Button>
            </div>
          )}

          {/* Compliance */}
          {activeTab === 'compliance' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Compliance Settings</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-accent-green" />
                  <p className="font-medium text-green-800">Compliance Active</p>
                </div>
                <p className="text-sm text-green-700">Your account is configured with compliance best practices enabled.</p>
              </div>
              {[
                { title: 'GDPR Compliance', desc: 'Ensures all prospect data is handled in accordance with EU General Data Protection Regulation', enabled: true },
                { title: 'CAN-SPAM Compliance', desc: 'All outreach emails include opt-out links and comply with CAN-SPAM requirements', enabled: true },
                { title: 'Opt-Out Management', desc: 'Automatically marks leads as Do Not Contact when they opt out', enabled: true },
                { title: 'Message Rate Limiting', desc: 'Limits daily message volume to comply with platform API terms of service', enabled: true },
                { title: 'Approval Workflow', desc: 'Require human review and approval for all messages before sending', enabled: true },
              ].map((item) => (
                <div key={item.title} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full shrink-0">
                    Active
                  </span>
                </div>
              ))}
              <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                Nexus LeadGen AI is built with compliance-first principles. All outreach is subject to user approval and adheres to GDPR, CAN-SPAM, CCPA regulations and platform-specific API terms of service.
              </p>
            </div>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Billing & Plan</h2>
              <div className={`rounded-xl p-5 border-2 ${plan === 'professional' ? 'border-primary-blue bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${planDetails.color}`}>
                      {planDetails.name}
                    </span>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{planDetails.price}</p>
                    <p className="text-sm text-gray-600">{planDetails.leads}</p>
                  </div>
                  {plan !== 'professional' && (
                    <Button variant="primary" size="sm" onClick={() => toast.success('Upgrade coming soon!')}>
                      Upgrade
                    </Button>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {planDetails.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-accent-green shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {plan !== 'professional' && (
                <div className="grid sm:grid-cols-3 gap-3">
                  {(['starter', 'professional', 'enterprise'] as const).filter((p) => p !== plan).map((planKey) => {
                    const pd = PLAN_DETAILS[planKey];
                    return (
                      <div key={planKey} className="border border-gray-200 rounded-lg p-4 hover:border-primary-blue transition-colors cursor-pointer">
                        <p className="font-semibold text-gray-900">{pd.name}</p>
                        <p className="text-lg font-bold text-primary-blue mt-1">{pd.price}</p>
                        <p className="text-xs text-gray-500">{pd.leads}</p>
                        <Button variant="outline" size="sm" className="mt-3 w-full text-xs" onClick={() => toast.success(`Upgrade to ${pd.name} coming soon!`)}>
                          Upgrade
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-3">API Integrations</h3>
                <div className="space-y-2">
                  {[
                    { name: 'LinkedIn API', status: 'Not Connected', icon: 'ð¼' },
                    { name: 'X.com / Twitter API', status: 'Not Connected', icon: 'ð¦' },
                    { name: 'Google Search API', status: 'Not Connected', icon: 'ð' },
                  ].map((api) => (
                    <div key={api.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span>{api.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{api.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{api.status}</span>
                        <Button variant="outline" size="sm" onClick={() => toast.success('API connection configuration coming soon!')}>
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
