import { Lead, ICP, ProductProfile } from '@/types';

// Lead generation simulation service
// Simulates multi-platform social media and web scraping for lead discovery
// In production, this integrates with LinkedIn API, Twitter API, Google Search API

const FIRST_NAMES = [
  'James', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Jennifer',
  'William', 'Linda', 'Richard', 'Barbara', 'Thomas', 'Susan', 'Charles', 'Karen',
  'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Margaret',
  'Donald', 'Sandra', 'Mark', 'Ashley', 'Paul', 'Dorothy', 'Steven', 'Kimberly',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Wilson', 'Taylor', 'Martinez', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
  'Martin', 'Thompson', 'Young', 'Robinson', 'Lewis', 'Walker', 'Hall', 'Allen',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
];

const COMPANY_SUFFIXES = [
  'Inc', 'LLC', 'Corp', 'Group', 'Solutions', 'Partners', 'Associates', 'Consulting',
  'Services', 'Technologies', 'Systems', 'Advisors',
];

const COMPANY_PREFIXES = [
  'Apex', 'Summit', 'Pioneer', 'Venture', 'Elite', 'Prime', 'Sterling', 'Meridian',
  'Nexus', 'Vertex', 'Horizon', 'Catalyst', 'Synergy', 'Pinnacle', 'Vanguard',
  'Atlas', 'Beacon', 'Cascade', 'Delta', 'Elevation', 'Fusion', 'Genesis', 'Harbor',
];

const LOCATIONS = [
  'New York, NY', 'San Francisco, CA', 'Chicago, IL', 'Austin, TX', 'Seattle, WA',
  'Boston, MA', 'Los Angeles, CA', 'Miami, FL', 'Denver, CO', 'Atlanta, GA',
  'Dallas, TX', 'Philadelphia, PA', 'Phoenix, AZ', 'Portland, OR', 'Nashville, TN',
  'London, UK', 'Toronto, Canada', 'Sydney, Australia', 'Singapore', 'Berlin, Germany',
];

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCompanyName(): string {
  return `${randomItem(COMPANY_PREFIXES)} ${randomItem(COMPANY_SUFFIXES)}`;
}

function generateEmail(firstName: string, lastName: string, company: string): string {
  const domain = company.toLowerCase().replace(/[^a-z]/g, '') + '.com';
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}@${domain}`,
  ];
  return randomItem(formats);
}

function generateLinkedInUrl(firstName: string, lastName: string): string {
  return `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateTwitterUrl(firstName: string, lastName: string): string {
  return `https://twitter.com/${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}`;
}

function generateLeadScore(icp: ICP, role: string, industry: string): number {
  let score = 50;

  if (icp.targetRoles.some((r) => role.toLowerCase().includes(r.toLowerCase().split(' ')[0]))) {
    score += 20;
  }

  if (icp.industries.some((i) => industry.toLowerCase().includes(i.toLowerCase().split(' ')[0]))) {
    score += 20;
  }

  score += Math.floor(Math.random() * 20) - 10;

  return Math.min(100, Math.max(0, score));
}

export interface DiscoveryOptions {
  platform: 'linkedin' | 'twitter' | 'google' | 'all';
  count: number;
  icp: ICP;
  product: ProductProfile;
  campaignId: string;
  userId: string;
}

export async function discoverLeads(options: DiscoveryOptions): Promise<Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>[]> {
  const { platform, count, icp, product, campaignId, userId } = options;

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const leads: Omit<Lead, '_id' | 'createdAt' | 'updatedAt'>[] = [];
  const targetCount = Math.min(count, 50); // Cap at 50 per discovery run

  const platforms: ('linkedin' | 'twitter' | 'google')[] =
    platform === 'all' ? ['linkedin', 'twitter', 'google'] : [platform];

  const industries = icp.industries.length > 0 ? icp.industries : product.targetIndustries;
  const roles = icp.targetRoles.length > 0 ? icp.targetRoles : ['Manager', 'Director', 'VP', 'Head of Operations'];

  for (let i = 0; i < targetCount; i++) {
    const firstName = randomItem(FIRST_NAMES);
    const lastName = randomItem(LAST_NAMES);
    const company = generateCompanyName();
    const role = randomItem(roles);
    const industry = randomItem(industries);
    const sourcePlatform = randomItem(platforms);

    leads.push({
      campaignId,
      userId,
      name: `${firstName} ${lastName}`,
      title: role,
      company,
      email: Math.random() > 0.4 ? generateEmail(firstName, lastName, company) : undefined,
      linkedinUrl: sourcePlatform === 'linkedin' || Math.random() > 0.5 ? generateLinkedInUrl(firstName, lastName) : undefined,
      twitterUrl: sourcePlatform === 'twitter' || Math.random() > 0.7 ? generateTwitterUrl(firstName, lastName) : undefined,
      location: randomItem(LOCATIONS),
      industry,
      companySize: randomItem(COMPANY_SIZES),
      source: sourcePlatform,
      status: 'new',
      score: generateLeadScore(icp, role, industry),
      tags: [industry.split(' ')[0], role.split(' ')[0]],
      lastActivity: new Date().toISOString(),
    });
  }

  // Sort by score descending
  return leads.sort((a, b) => (b.score || 0) - (a.score || 0));
}

export function personalizeMessage(template: string, lead: Lead): string {
  return template
    .replace(/\[Lead Name\]/g, lead.name.split(' ')[0])
    .replace(/\[Full Name\]/g, lead.name)
    .replace(/\[Title\]/g, lead.title)
    .replace(/\[Company\]/g, lead.company)
    .replace(/\[Industry\]/g, lead.industry || 'your industry')
    .replace(/\[Your Name\]/g, 'Your Name')
    .replace(/\[Day\]/g, 'Thursday')
    .replace(/\[Time\]/g, '2:00 PM EST');
}
