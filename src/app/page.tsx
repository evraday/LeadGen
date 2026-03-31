import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroImage from '@/components/ui/HeroImage';
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const FEATURES = [
  {
    icon: SparklesIcon,
    color: 'bg-blue-100 text-primary-blue',
    title: 'AI-Powered Research',
    description:
      'Our AI dives deep into your product and market, building precise Ideal Customer Profiles and identifying businesses ready for your solution.',
  },
  {
    icon: MagnifyingGlassIcon,
    color: 'bg-green-100 text-accent-green',
    title: 'Multi-Platform Discovery',
    description:
      'Search LinkedIn, X.com, Google, and more simultaneously. Find decision-makers with unmatched accuracy across platforms.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-orange-100 text-accent-orange',
    title: 'Automated Outreach',
    description:
      'Send personalized introductory messages with built-in approval workflows. Every message reviewed before sending.',
  },
  {
    icon: ChartBarIcon,
    color: 'bg-purple-100 text-purple-600',
    title: 'Performance Analytics',
    description:
      'Track messages sent, opened, and converted. Understand your ROI and optimize your campaigns for maximum results.',
  },
  {
    icon: ShieldCheckIcon,
    color: 'bg-teal-100 text-teal-600',
    title: 'Compliance-First',
    description:
      'Built-in GDPR, CAN-SPAM compliance monitoring. Opt-out management and platform policy adherence built in.',
  },
  {
    icon: RocketLaunchIcon,
    color: 'bg-pink-100 text-pink-600',
    title: 'Campaign Management',
    description:
      'End-to-end campaign management from ICP generation to lead tracking, messaging, and conversion reporting.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Define Your Business',
    description: 'Tell our AI about your product or service. We research your market and build your Ideal Customer Profile.',
  },
  {
    step: '02',
    title: 'Discover Leads',
    description: 'Our system searches LinkedIn, X.com, Google and more to find prospects matching your ICP with precision.',
  },
  {
    step: '03',
    title: 'Craft & Approve Messages',
    description: 'AI generates personalized messages. You review and approve before anything is sent.',
  },
  {
    step: '04',
    title: 'Track & Convert',
    description: 'Monitor opens, replies, and conversions. Your pipeline fills while you focus on closing deals.',
  },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individual consultants and small teams',
    features: [
      '500 lead discoveries/month',
      'LinkedIn outreach',
      'Basic ICP generation',
      'Standard analytics',
      'Email support',
      'CSV export',
    ],
    cta: 'Get Started',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'For growing businesses and agencies',
    features: [
      '5,000 lead discoveries/month',
      'Multi-channel outreach (LinkedIn, X.com, Google)',
      'Advanced AI ICP + Market Analysis',
      'Advanced analytics & reporting',
      'Compliance framework',
      'Message approval workflows',
      'Priority support',
      'CSV & JSON export',
    ],
    cta: 'Choose Professional',
    href: '/register?plan=professional',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited lead discoveries',
      'All Professional features',
      'Dedicated account manager',
      'CRM integration (Full Access)',
      'Custom onboarding & training',
      'API access',
      'SLA & dedicated support',
    ],
    cta: 'Contact Sales',
    href: '/register?plan=enterprise',
    highlighted: false,
  },
];

const STATS = [
  { value: '10x', label: 'Faster Lead Discovery' },
  { value: '90%', label: 'Research Time Saved' },
  { value: '3x', label: 'Higher Response Rates' },
  { value: '30%', label: 'Lower Cost Than Competitors' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-hero text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in">
              <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <SparklesIcon className="h-4 w-4" />
                AI-Powered Lead Generation
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Stop Guessing.
                <br />
                <span className="text-green-300">Start Growing.</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
                Discover the exact clients you need, automate personalized outreach, and watch your conversion rates soar. Nexus LeadGen AI brings intelligent lead generation to Professional Services and Healthcare.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="bg-accent-green text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2 shadow-lg"
                >
                  Get Started Free
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="bg-white bg-opacity-20 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
                >
                  See How It Works
                </Link>
              </div>
              <p className="mt-4 text-blue-200 text-sm">No credit card required. 7-day free trial.</p>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white bg-opacity-10 rounded-2xl transform rotate-3" />
                <HeroImage />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Find Your Next Client
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nexus LeadGen AI combines AI research, multi-platform discovery, and compliance-first outreach in one powerful platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              From Zero to Qualified Leads in Minutes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined workflow takes you from product definition to active outreach campaigns in four simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.step} className="relative">
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 z-0 translate-x-4" />
                )}
                <div className="relative z-10">
                  <div className="text-5xl font-black text-gray-100 mb-3 leading-none">{step.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ICP Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Find Your Ideal Customer, Instantly.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Gone are the days of generic outreach. Our AI dives deep into your product and market, building precise Ideal Customer Profiles (ICPs) and identifying businesses ready for your solution. Focus on Professional Services and Healthcare, we pinpoint decision-makers with unmatched accuracy.
              </p>
              <ul className="space-y-3">
                {[
                  'AI-driven analysis of your unique selling propositions',
                  'Detailed customer personas with pain points & decision criteria',
                  'Market & competitor landscape analysis',
                  'Keyword strategy for finding prospects across platforms',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-8 bg-primary-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Discover My Ideal Leads
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-primary-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI Generated ICP</h4>
                  <p className="text-xs text-gray-500">SaaS - Standard Operating Procedures</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Target Roles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Managing Partner', 'Operations Director', 'CEO', 'Chief of Staff'].map((r) => (
                      <span key={r} className="text-xs bg-blue-100 text-primary-blue px-2 py-1 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Industries</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Law Firms', 'Consulting', 'Accounting', 'Healthcare'].map((i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{i}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Pain Points</p>
                  <ul className="space-y-1.5">
                    {['Manual and inefficient processes', 'Compliance documentation burden', 'Knowledge management challenges'].map((p) => (
                      <li key={p} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Flexible Plans for Smarter Growth
            </h2>
            <p className="text-lg text-gray-600">
              Choose the perfect plan to scale your lead generation efforts and achieve your business goals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-primary-blue text-white shadow-2xl scale-105 border-0'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-block bg-accent-green text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-black ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors mb-6 ${
                    plan.highlighted
                      ? 'bg-white text-primary-blue hover:bg-blue-50'
                      : 'bg-primary-blue text-white hover:bg-blue-800'
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckIcon className={`h-4 w-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-green-300' : 'text-accent-green'}`} />
                      <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            All plans include a 7-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero py-20 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Revolutionize Your Lead Generation?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Stop wasting time on cold leads. Start connecting with your perfect customers today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="bg-accent-green text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors inline-flex items-center gap-2 shadow-lg text-lg"
            >
              Start Your Free Trial
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-30 transition-colors text-lg"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
