'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import {
  CheckCircleIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Your Business', icon: 'ð¢', description: 'Tell us about your product or service' },
  { id: 2, title: 'Ideal Customer', icon: 'ð¯', description: 'Define your target customer profile' },
  { id: 3, title: 'Find Leads', icon: 'ð', description: 'Select discovery channels' },
  { id: 4, title: 'Your Message', icon: 'âï¸', description: 'Craft your outreach message' },
  { id: 5, title: 'Launch', icon: 'ð', description: 'Review and launch your campaign' },
];

interface WizardData {
  campaignName: string;
  product: {
    name: string;
    description: string;
    keyFeatures: string;
    targetIndustries: string;
    usp: string;
    website: string;
  };
  icp: {
    targetRoles: string;
    companySize: string[];
    keywords: string;
    painPoints: string;
  };
  channels: string[];
  messageTemplate: {
    subject: string;
    body: string;
    tone: string;
    platform: string;
  };
}

const initialData: WizardData = {
  campaignName: '',
  product: {
    name: '',
    description: '',
    keyFeatures: '',
    targetIndustries: '',
    usp: '',
    website: '',
  },
  icp: {
    targetRoles: '',
    companySize: [],
    keywords: '',
    painPoints: '',
  },
  channels: ['linkedin'],
  messageTemplate: {
    subject: '',
    body: '',
    tone: 'friendly',
    platform: 'linkedin',
  },
};

export default function CampaignWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isGeneratingICP, setIsGeneratingICP] = useState(false);
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedICP, setGeneratedICP] = useState<Record<string, unknown> | null>(null);

  const updateProduct = (field: string, value: string) => {
    setData((prev) => ({ ...prev, product: { ...prev.product, [field]: value } }));
  };

  const updateICP = (field: string, value: string | string[]) => {
    setData((prev) => ({ ...prev, icp: { ...prev.icp, [field]: value } }));
  };

  const updateMessage = (field: string, value: string) => {
    setData((prev) => ({ ...prev, messageTemplate: { ...prev.messageTemplate, [field]: value } }));
  };

  const toggleChannel = (channel: string) => {
    setData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const toggleCompanySize = (size: string) => {
    setData((prev) => ({
      ...prev,
      icp: {
        ...prev.icp,
        companySize: prev.icp.companySize.includes(size)
          ? prev.icp.companySize.filter((s) => s !== size)
          : [...prev.icp.companySize, size],
      },
    }));
  };

  const handleGenerateICP = async () => {
    if (!data.product.name || !data.product.usp) {
      toast.error('Please fill in product name and unique value proposition first');
      return;
    }
    setIsGeneratingICP(true);
    try {
      const res = await fetch('/api/research/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            name: data.product.name,
            description: data.product.description,
            keyFeatures: data.product.keyFeatures.split(',').map((s) => s.trim()).filter(Boolean),
            targetIndustries: data.product.targetIndustries.split(',').map((s) => s.trim()).filter(Boolean),
            usp: data.product.usp,
            website: data.product.website,
          },
        }),
      });
      const result = await res.json();
      if (result.icp) {
        setGeneratedICP(result.icp);
        setData((prev) => ({
          ...prev,
          icp: {
            ...prev.icp,
            targetRoles: result.icp.targetRoles?.join(', ') || prev.icp.targetRoles,
            keywords: result.icp.keywords?.join(', ') || prev.icp.keywords,
            painPoints: result.icp.painPoints?.join(', ') || prev.icp.painPoints,
          },
        }));
        toast.success('ICP generated successfully!');
      }
    } catch {
      toast.error('Failed to generate ICP. Please try again.');
    } finally {
      setIsGeneratingICP(false);
    }
  };

  const handleGenerateMessage = async () => {
    setIsGeneratingMessage(true);
    try {
      const res = await fetch('/api/research/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            name: data.product.name,
            description: data.product.description,
            keyFeatures: data.product.keyFeatures.split(',').map((s) => s.trim()).filter(Boolean),
            targetIndustries: data.product.targetIndustries.split(',').map((s) => s.trim()).filter(Boolean),
            usp: data.product.usp,
          },
          generateMessage: true,
          platform: data.messageTemplate.platform,
          icp: generatedICP || {
            targetRoles: data.icp.targetRoles.split(',').map((s) => s.trim()),
            industries: data.product.targetIndustries.split(',').map((s) => s.trim()),
            painPoints: data.icp.painPoints.split(',').map((s) => s.trim()),
            keywords: data.icp.keywords.split(',').map((s) => s.trim()),
          },
        }),
      });
      const result = await res.json();
      if (result.messageTemplate) {
        updateMessage('body', result.messageTemplate.body);
        updateMessage('subject', result.messageTemplate.subject || '');
        toast.success('Message template generated!');
      }
    } catch {
      toast.error('Failed to generate message. Please try again.');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.campaignName || `${data.product.name} Campaign`,
        product: {
          name: data.product.name,
          description: data.product.description,
          keyFeatures: data.product.keyFeatures.split(',').map((s) => s.trim()).filter(Boolean),
          targetIndustries: data.product.targetIndustries.split(',').map((s) => s.trim()).filter(Boolean),
          usp: data.product.usp,
          website: data.product.website,
        },
        icp: {
          ...(generatedICP || {}),
          targetRoles: data.icp.targetRoles.split(',').map((s) => s.trim()).filter(Boolean),
          keywords: data.icp.keywords.split(',').map((s) => s.trim()).filter(Boolean),
          painPoints: data.icp.painPoints.split(',').map((s) => s.trim()).filter(Boolean),
          companySize: data.icp.companySize,
        },
        channels: data.channels.map((c) => ({ platform: c, enabled: true })),
        messageTemplate: {
          subject: data.messageTemplate.subject,
          body: data.messageTemplate.body,
          platform: data.messageTemplate.platform,
          tone: data.messageTemplate.tone,
          personalizationTokens: ['[Lead Name]', '[Title]', '[Company]'],
        },
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Campaign created successfully!');
        router.push(`/dashboard/campaigns/${result._id}`);
      } else {
        throw new Error(result.error || 'Failed to create campaign');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!data.product.name && !!data.product.usp;
      case 2: return !!data.icp.targetRoles;
      case 3: return data.channels.length > 0;
      case 4: return !!data.messageTemplate.body;
      case 5: return !!data.campaignName;
      default: return true;
    }
  };

  const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'];
  const PLATFORMS = [
    { id: 'linkedin', label: 'LinkedIn', icon: 'ð¼', desc: 'Best for B2B' },
    { id: 'twitter', label: 'X.com / Twitter', icon: 'ð¦', desc: 'Great for engagement' },
    { id: 'google', label: 'Google Search', icon: 'ð', desc: 'Wide reach' },
    { id: 'instagram', label: 'Instagram', icon: 'ð·', desc: 'Visual industries' },
    { id: 'email', label: 'Email', icon: 'ð§', desc: 'Direct outreach' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center z-10">
              <button
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                  step.id === currentStep
                    ? 'bg-primary-blue border-primary-blue text-white shadow-md'
                    : step.id < currentStep
                    ? 'bg-accent-green border-accent-green text-white cursor-pointer'
                    : 'bg-white border-gray-300 text-gray-500'
                )}
              >
                {step.id < currentStep ? <CheckCircleIcon className="h-5 w-5" /> : step.icon}
              </button>
              <span className="text-xs font-medium mt-2 text-gray-600 hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-in">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{STEPS[currentStep - 1].title}</h2>
          <p className="text-sm text-gray-500 mt-1">{STEPS[currentStep - 1].description}</p>
        </div>

        {/* Step 1: Product */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <Input
              label="Product/Service Name *"
              value={data.product.name}
              onChange={(e) => updateProduct('name', e.target.value)}
              placeholder="e.g., Standard Operating Procedure Software"
            />
            <Textarea
              label="Description"
              value={data.product.description}
              onChange={(e) => updateProduct('description', e.target.value)}
              placeholder="Describe what your product/service does..."
              rows={3}
            />
            <Input
              label="Unique Value Proposition *"
              value={data.product.usp}
              onChange={(e) => updateProduct('usp', e.target.value)}
              placeholder="e.g., Create, manage and deploy SOPs 10x faster with AI"
            />
            <Input
              label="Key Features (comma-separated)"
              value={data.product.keyFeatures}
              onChange={(e) => updateProduct('keyFeatures', e.target.value)}
              placeholder="e.g., AI writing assistant, Version control, Team collaboration"
            />
            <Input
              label="Target Industries (comma-separated)"
              value={data.product.targetIndustries}
              onChange={(e) => updateProduct('targetIndustries', e.target.value)}
              placeholder="e.g., Professional Services, Healthcare, Technology"
            />
            <Input
              label="Website (optional)"
              value={data.product.website}
              onChange={(e) => updateProduct('website', e.target.value)}
              placeholder="https://yourwebsite.com"
              type="url"
            />
          </div>
        )}

        {/* Step 2: ICP */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <SparklesIcon className="h-5 w-5 text-primary-blue shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-blue">AI-Powered ICP Generation</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Let our AI analyze your product and generate a precise Ideal Customer Profile
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  loading={isGeneratingICP}
                  onClick={handleGenerateICP}
                  icon={<SparklesIcon className="h-4 w-4" />}
                >
                  Generate ICP with AI
                </Button>
              </div>
            </div>
            <Input
              label="Target Roles (comma-separated) *"
              value={data.icp.targetRoles}
              onChange={(e) => updateICP('targetRoles', e.target.value)}
              placeholder="e.g., Managing Partner, Operations Director, CEO"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <div className="flex flex-wrap gap-2">
                {COMPANY_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleCompanySize(size)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                      data.icp.companySize.includes(size)
                        ? 'bg-primary-blue text-white border-primary-blue'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-blue'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Keywords (comma-separated)"
              value={data.icp.keywords}
              onChange={(e) => updateICP('keywords', e.target.value)}
              placeholder="e.g., operations, processes, compliance, efficiency"
            />
            <Textarea
              label="Pain Points (comma-separated)"
              value={data.icp.painPoints}
              onChange={(e) => updateICP('painPoints', e.target.value)}
              placeholder="e.g., Manual processes, Compliance burden, Team scaling"
              rows={3}
            />
            {generatedICP && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" /> ICP Generated Successfully
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {(generatedICP as { description?: string }).description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Channels */}
        {currentStep === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Select the platforms where you want to discover and engage leads
            </p>
            {PLATFORMS.map((platform) => (
              <label
                key={platform.id}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  data.channels.includes(platform.id)
                    ? 'border-primary-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="checkbox"
                  checked={data.channels.includes(platform.id)}
                  onChange={() => toggleChannel(platform.id)}
                  className="h-4 w-4 text-primary-blue rounded"
                />
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{platform.label}</p>
                  <p className="text-xs text-gray-500">{platform.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Step 4: Message */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Select
                label="Platform"
                value={data.messageTemplate.platform}
                onChange={(e) => updateMessage('platform', e.target.value)}
                options={[
                  { value: 'linkedin', label: 'LinkedIn' },
                  { value: 'twitter', label: 'X.com / Twitter' },
                  { value: 'email', label: 'Email' },
                ]}
              />
              <Select
                label="Tone"
                value={data.messageTemplate.tone}
                onChange={(e) => updateMessage('tone', e.target.value)}
                options={[
                  { value: 'friendly', label: 'Friendly' },
                  { value: 'formal', label: 'Formal' },
                  { value: 'casual', label: 'Casual' },
                ]}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              loading={isGeneratingMessage}
              onClick={handleGenerateMessage}
              icon={<SparklesIcon className="h-4 w-4" />}
            >
              Generate with AI
            </Button>
            {data.messageTemplate.platform === 'email' && (
              <Input
                label="Subject Line"
                value={data.messageTemplate.subject}
                onChange={(e) => updateMessage('subject', e.target.value)}
                placeholder="Quick question about [Company]'s operations"
              />
            )}
            <Textarea
              label="Message Body *"
              value={data.messageTemplate.body}
              onChange={(e) => updateMessage('body', e.target.value)}
              placeholder="Write your outreach message here. Use [Lead Name], [Company], [Title] as personalization tokens..."
              rows={8}
            />
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs font-medium text-yellow-800">Personalization Tokens</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['[Lead Name]', '[Title]', '[Company]', '[Industry]', '[Your Name]'].map((token) => (
                  <code key={token} className="text-xs bg-white border border-yellow-300 px-2 py-0.5 rounded">
                    {token}
                  </code>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <Input
              label="Campaign Name *"
              value={data.campaignName}
              onChange={(e) => setData((prev) => ({ ...prev, campaignName: e.target.value }))}
              placeholder={`${data.product.name} Lead Campaign`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Product</p>
                <p className="font-medium text-gray-900">{data.product.name}</p>
                <p className="text-xs text-gray-600 mt-1">{data.product.usp}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Target Channels</p>
                <div className="flex flex-wrap gap-1">
                  {data.channels.map((c) => (
                    <span key={c} className="text-xs bg-primary-blue text-white px-2 py-0.5 rounded capitalize">{c}</span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Target Roles</p>
                <p className="text-sm text-gray-700">{data.icp.targetRoles || 'Not specified'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Message Platform</p>
                <p className="text-sm text-gray-700 capitalize">{data.messageTemplate.platform} ({data.messageTemplate.tone})</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <RocketLaunchIcon className="h-5 w-5 text-primary-blue shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary-blue">Ready to Launch!</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your campaign will be saved as a draft. You can activate it from the campaigns dashboard and start discovering leads immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < 5 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next: {STEPS[currentStep].title}
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={handleSubmit}
              loading={isSubmitting}
              icon={<RocketLaunchIcon className="h-4 w-4" />}
              disabled={!canProceed()}
            >
              Create Campaign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
