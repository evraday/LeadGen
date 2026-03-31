'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { SparklesIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ICP, MarketAnalysis, CompetitorAnalysis } from '@/types';

interface ResearchResult {
  icp: ICP;
  marketAnalysis: MarketAnalysis;
  competitorAnalysis: CompetitorAnalysis[];
}

export default function ResearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('icp');
  const [form, setForm] = useState({
    name: '',
    description: '',
    keyFeatures: '',
    targetIndustries: '',
    usp: '',
    website: '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!form.name || !form.usp) {
      toast.error('Please fill in product name and unique value proposition');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/research/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            name: form.name,
            description: form.description,
            keyFeatures: form.keyFeatures.split(',').map((s) => s.trim()).filter(Boolean),
            targetIndustries: form.targetIndustries.split(',').map((s) => s.trim()).filter(Boolean),
            usp: form.usp,
            website: form.website,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        toast.success('Research completed! Your ICP and market analysis are ready.');
      } else {
        throw new Error('Research generation failed');
      }
    } catch {
      toast.error('Failed to generate research. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const Section = ({ id, title, emoji, children }: { id: string; title: string; emoji: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{emoji}</span>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {expandedSection === id ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {expandedSection === id && (
        <div className="px-6 pb-6 border-t border-gray-100">{children}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ICP Research</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered research to identify your ideal customer profile and market opportunity
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-primary-blue" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Tell Us About Your Product</h2>
            <p className="text-xs text-gray-500">Our AI will research your market and generate a precise ICP</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Product/Service Name *"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., SOP Management Software"
          />
          <Input
            label="Website (optional)"
            value={form.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://yourproduct.com"
            type="url"
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Unique Value Proposition *"
              value={form.usp}
              onChange={(e) => updateField('usp', e.target.value)}
              placeholder="What makes your product unique? What problem does it solve?"
              rows={2}
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe what your product does in detail..."
              rows={3}
            />
          </div>
          <Input
            label="Key Features (comma-separated)"
            value={form.keyFeatures}
            onChange={(e) => updateField('keyFeatures', e.target.value)}
            placeholder="AI writing, Version control, Team collaboration"
          />
          <Input
            label="Target Industries (comma-separated)"
            value={form.targetIndustries}
            onChange={(e) => updateField('targetIndustries', e.target.value)}
            placeholder="Professional Services, Healthcare, Technology"
          />
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            onClick={handleGenerate}
            loading={isLoading}
            icon={<SparklesIcon className="h-4 w-4" />}
            size="lg"
            className="w-full sm:w-auto"
          >
            Generate ICP & Market Research
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="font-medium text-gray-900">AI is researching your market...</p>
          <p className="text-sm text-gray-500 mt-1">Analyzing your product, generating ICP, and researching competitors</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in">
          <div className="flex items-center gap-2 text-accent-green">
            <SparklesIcon className="h-5 w-5" />
            <p className="font-semibold">Research Complete! Here are your insights:</p>
          </div>

          {/* ICP */}
          <Section id="icp" title="Ideal Customer Profile (ICP)" emoji="ð¯">
            <div className="mt-4 space-y-5">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-medium text-primary-blue">{result.icp.title}</p>
                <p className="text-sm text-gray-700 mt-1">{result.icp.description}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Target Roles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.icp.targetRoles.map((role) => (
                      <span key={role} className="text-xs bg-blue-100 text-primary-blue px-2.5 py-1 rounded-full font-medium">{role}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Company Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.icp.companySize.map((size) => (
                      <span key={size} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{size}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Industries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.icp.industries.map((ind) => (
                      <span key={ind} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{ind}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.icp.keywords.map((kw) => (
                      <span key={kw} className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Key Pain Points</p>
                <ul className="space-y-2">
                  {result.icp.painPoints.map((pain) => (
                    <li key={pain} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-accent-orange shrink-0 mt-1.5" />
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Decision Criteria</p>
                <ul className="space-y-2">
                  {result.icp.decisionCriteria.map((criterion) => (
                    <li key={criterion} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-accent-green shrink-0 mt-1.5" />
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Market Analysis */}
          <Section id="market" title="Market Analysis" emoji="ð">
            <div className="mt-4 space-y-5">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Addressable Market</p>
                <p className="text-2xl font-bold text-accent-green">{result.marketAnalysis.totalAddressableMarket}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Target Segments</p>
                  <ul className="space-y-2">
                    {result.marketAnalysis.targetSegments.map((seg) => (
                      <li key={seg} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-primary-blue shrink-0">â¢</span> {seg}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Key Trends</p>
                  <ul className="space-y-2">
                    {result.marketAnalysis.keyTrends.map((trend) => (
                      <li key={trend} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-accent-green shrink-0">â</span> {trend}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Opportunities</p>
                  <ul className="space-y-2">
                    {result.marketAnalysis.opportunities.map((opp) => (
                      <li key={opp} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-accent-green shrink-0">â</span> {opp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Challenges</p>
                  <ul className="space-y-2">
                    {result.marketAnalysis.challenges.map((ch) => (
                      <li key={ch} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-accent-orange shrink-0">â </span> {ch}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* Competitor Analysis */}
          <Section id="competitors" title="Competitor Analysis" emoji="ð">
            <div className="mt-4 grid sm:grid-cols-3 gap-4">
              {result.competitorAnalysis.map((comp) => (
                <div key={comp.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">{comp.name}</h4>
                  <p className="text-xs text-gray-500 mb-3 italic">{comp.positioning}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-green-600 mb-1">Strengths</p>
                      <ul className="space-y-1">
                        {comp.strengths.map((s) => (
                          <li key={s} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="text-green-500 shrink-0">+</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-red-500 mb-1">Weaknesses</p>
                      <ul className="space-y-1">
                        {comp.weaknesses.map((w) => (
                          <li key={w} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="text-red-400 shrink-0">â</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
