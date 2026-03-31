export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  plan: 'starter' | 'professional' | 'enterprise';
}

export interface Campaign {
  _id: string;
  userId: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  product: ProductProfile;
  icp: ICP;
  channels: Channel[];
  messageTemplate: MessageTemplate;
  stats: CampaignStats;
  createdAt: string;
  updatedAt: string;
}

export interface ProductProfile {
  name: string;
  description: string;
  keyFeatures: string[];
  targetIndustries: string[];
  usp: string;
  website?: string;
}

export interface ICP {
  title: string;
  description: string;
  targetRoles: string[];
  companySize: string[];
  industries: string[];
  painPoints: string[];
  keywords: string[];
  decisionCriteria: string[];
  generatedAt?: string;
}

export interface Channel {
  platform: 'linkedin' | 'twitter' | 'google' | 'instagram' | 'tiktok' | 'email';
  enabled: boolean;
  config?: Record<string, string>;
}

export interface MessageTemplate {
  subject?: string;
  body: string;
  personalizationTokens: string[];
  platform: string;
  tone: 'formal' | 'casual' | 'friendly';
}

export interface CampaignStats {
  leadsDiscovered: number;
  messagesSent: number;
  messagesOpened: number;
  replies: number;
  conversions: number;
  optOuts: number;
}

export interface Lead {
  _id: string;
  campaignId: string;
  userId: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  location?: string;
  industry?: string;
  companySize?: string;
  source: 'linkedin' | 'twitter' | 'google' | 'instagram' | 'manual';
  status: 'new' | 'contacted' | 'replied' | 'qualified' | 'converted' | 'unqualified' | 'do_not_contact';
  score?: number;
  notes?: string;
  tags?: string[];
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  campaignId: string;
  leadId: string;
  userId: string;
  platform: string;
  subject?: string;
  body: string;
  status: 'pending_approval' | 'approved' | 'sent' | 'delivered' | 'opened' | 'replied' | 'failed' | 'rejected';
  scheduledAt?: string;
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface Research {
  _id: string;
  userId: string;
  campaignId?: string;
  productProfile: ProductProfile;
  icp: ICP;
  marketAnalysis: MarketAnalysis;
  competitorAnalysis: CompetitorAnalysis[];
  createdAt: string;
}

export interface MarketAnalysis {
  totalAddressableMarket: string;
  targetSegments: string[];
  keyTrends: string[];
  challenges: string[];
  opportunities: string[];
}

export interface CompetitorAnalysis {
  name: string;
  strengths: string[];
  weaknesses: string[];
  positioning: string;
}

export interface AnalyticsData {
  overview: {
    totalLeads: number;
    totalMessagesSent: number;
    openRate: number;
    replyRate: number;
    conversionRate: number;
    activeCampaigns: number;
  };
  leadsByStatus: { status: string; count: number }[];
  messagesByDay: { date: string; sent: number; opened: number; replied: number }[];
  conversionFunnel: { stage: string; count: number }[];
  topCampaigns: {
    name: string;
    leads: number;
    messages: number;
    conversions: number;
    rate: number;
  }[];
  leadsBySource: { source: string; count: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type LeadStatus = Lead['status'];
export type CampaignStatus = Campaign['status'];
export type MessageStatus = Message['status'];
