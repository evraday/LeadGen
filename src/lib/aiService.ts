import { ICP, MarketAnalysis, CompetitorAnalysis, ProductProfile, MessageTemplate } from '@/types';

// AI-powered research and ICP generation service
// In production, this would integrate with OpenAI/Claude API
// Currently provides intelligent simulated responses based on product data

export async function generateICP(product: ProductProfile): Promise<ICP> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const industry = product.targetIndustries[0] || 'Technology';
  const productName = product.name;

  const icpTemplates: Record<string, Partial<ICP>> = {
    'Professional Services': {
      targetRoles: ['Managing Partner', 'Operations Director', 'Chief of Staff', 'Practice Manager', 'CEO'],
      companySize: ['10-50 employees', '50-200 employees', '200-500 employees'],
      industries: ['Law Firms', 'Consulting Firms', 'Accounting Firms', 'Financial Advisors', 'Architecture Firms'],
      painPoints: [
        'Manual and inefficient operational processes',
        'Difficulty scaling without adding headcount',
        'Inconsistent service delivery across teams',
        'Regulatory compliance documentation burden',
        'Knowledge management and employee onboarding challenges',
      ],
      decisionCriteria: [
        'Ease of use and adoption',
        'Integration with existing tools',
        'ROI within 3-6 months',
        'Compliance and security certifications',
        'Customer support quality',
      ],
    },
    Healthcare: {
      targetRoles: ['Medical Director', 'Practice Administrator', 'Chief Operations Officer', 'Healthcare IT Manager', 'Clinic Director'],
      companySize: ['5-50 employees', '50-200 employees', '200-1000 employees'],
      industries: ['Medical Clinics', 'Dental Practices', 'Physical Therapy', 'Mental Health Practices', 'Specialty Care'],
      painPoints: [
        'HIPAA compliance and documentation requirements',
        'Staff training and onboarding inefficiencies',
        'Patient care quality consistency',
        'Billing and coding accuracy',
        'Regulatory audit preparation',
      ],
      decisionCriteria: [
        'HIPAA compliance certification',
        'EHR/EMR integration capabilities',
        'Clinical workflow support',
        'Staff adoption rate',
        'Implementation support',
      ],
    },
    Technology: {
      targetRoles: ['VP of Engineering', 'CTO', 'Head of Operations', 'Director of Product', 'Engineering Manager'],
      companySize: ['20-100 employees', '100-500 employees', '500-2000 employees'],
      industries: ['SaaS Companies', 'Software Development', 'IT Services', 'Fintech', 'EdTech'],
      painPoints: [
        'Rapid team scaling challenges',
        'Technical documentation gaps',
        'Onboarding efficiency for new developers',
        'Process inconsistency across distributed teams',
        'Knowledge silos and bus factor risks',
      ],
      decisionCriteria: [
        'API and integration flexibility',
        'Developer experience quality',
        'SOC 2 compliance',
        'GitHub/Jira integration',
        'Version control for procedures',
      ],
    },
  };

  const template = icpTemplates[industry] || icpTemplates['Technology'];

  const keywords = [
    ...product.keyFeatures.map((f) => f.split(' ').slice(0, 2).join(' ')),
    product.name,
    industry,
    'efficiency',
    'automation',
    'compliance',
  ].slice(0, 8);

  return {
    title: `Ideal Customer Profile: ${productName} for ${industry}`,
    description: `Our ideal customer is a decision-maker at a ${industry.toLowerCase()} company who is actively seeking to ${product.usp.toLowerCase()}. They are tech-forward, value efficiency, and are willing to invest in solutions that deliver measurable ROI.`,
    targetRoles: template.targetRoles || [],
    companySize: template.companySize || [],
    industries: template.industries || [],
    painPoints: template.painPoints || [],
    keywords: keywords,
    decisionCriteria: template.decisionCriteria || [],
    generatedAt: new Date().toISOString(),
  };
}

export async function generateMarketAnalysis(product: ProductProfile): Promise<MarketAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const industry = product.targetIndustries[0] || 'B2B Software';

  return {
    totalAddressableMarket: `$${(Math.random() * 50 + 10).toFixed(1)}B globally`,
    targetSegments: [
      `Small ${industry} firms (10-50 employees)`,
      `Mid-market ${industry} companies (50-500 employees)`,
      `Enterprise ${industry} organizations (500+ employees)`,
    ],
    keyTrends: [
      'Increasing demand for digital transformation and automation',
      'Remote and hybrid work driving need for standardized processes',
      'Regulatory pressures requiring documented procedures',
      'AI adoption accelerating operational efficiency investments',
    ],
    challenges: [
      'High competition from established players',
      'Customer education on value proposition',
      'Integration complexity with legacy systems',
      'Longer enterprise sales cycles',
    ],
    opportunities: [
      'Underserved SMB market seeking affordable solutions',
      'Growing compliance requirements creating urgency',
      'Remote work normalization increasing documentation needs',
      'AI-driven differentiation in a commoditized market',
    ],
  };
}

export async function generateCompetitorAnalysis(product: ProductProfile): Promise<CompetitorAnalysis[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [
    {
      name: 'Process Street',
      strengths: ['Established brand', 'Large template library', 'Good integrations'],
      weaknesses: ['Expensive for small teams', 'Limited AI capabilities', 'Complex UI'],
      positioning: 'Enterprise workflow management',
    },
    {
      name: 'Trainual',
      strengths: ['Training-focused features', 'Good onboarding UX', 'Video support'],
      weaknesses: ['Limited process automation', 'No compliance tracking', 'Basic analytics'],
      positioning: 'Employee training and onboarding',
    },
    {
      name: 'Notion',
      strengths: ['Flexible and customizable', 'Low cost', 'Wide adoption'],
      weaknesses: ['Not purpose-built for SOPs', 'No approval workflows', 'Limited analytics'],
      positioning: 'General-purpose knowledge base',
    },
  ];
}

export async function generateMessageTemplate(
  product: ProductProfile,
  icp: ICP,
  platform: string
): Promise<MessageTemplate> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const templates: Record<string, string> = {
    linkedin: `Hi [Lead Name],

I noticed you're the [Title] at [Company] - exactly the type of leader who's transforming how ${icp.industries[0] || 'businesses'} operate.

I'm reaching out because ${product.name} helps ${icp.targetRoles[0] || 'operations leaders'} like yourself ${product.usp.toLowerCase()}.

We've helped similar companies solve: ${icp.painPoints[0] || 'operational inefficiencies'}.

Would you be open to a quick 15-minute call to see if we could help [Company] as well?

Best regards,
[Your Name]`,

    twitter: `Hey [Lead Name]! Saw your work at [Company] - impressive stuff.

We built ${product.name} specifically for ${icp.industries[0] || 'teams'} looking to ${product.usp.toLowerCase()}.

Mind if I share how we've helped similar companies? ð`,

    email: `Subject: Quick question about [Company]'s operations

Hi [Lead Name],

Hope this finds you well. I came across [Company] and was impressed by your work in ${icp.industries[0] || 'your industry'}.

As [Title], you're likely focused on ${icp.painPoints[0] || 'operational efficiency'} - which is exactly what ${product.name} addresses.

Our platform helps ${icp.targetRoles[0] || 'leaders like you'} to:
â¢ ${product.keyFeatures[0] || 'Streamline operations'}
â¢ ${product.keyFeatures[1] || 'Reduce manual work'}
â¢ ${product.keyFeatures[2] || 'Improve team performance'}

I'd love to share a 5-minute demo. Would [Day] at [Time] work for a quick call?

Best,
[Your Name]`,
  };

  const body = templates[platform] || templates['email'];

  return {
    subject: `Quick question about [Company]'s ${product.name.toLowerCase()} needs`,
    body,
    personalizationTokens: ['[Lead Name]', '[Title]', '[Company]', '[Your Name]', '[Day]', '[Time]'],
    platform,
    tone: 'friendly',
  };
}
