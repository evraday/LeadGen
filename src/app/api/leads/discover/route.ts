import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import LeadModel from '@/models/Lead';
import CampaignModel from '@/models/Campaign';
import { discoverLeads } from '@/lib/leadGenService';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    const { campaignId, platform = 'all', count = 20 } = body;

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    await connectDB();

    const campaign = await CampaignModel.findOne({ _id: campaignId, userId });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Generate leads using our simulation service
    const discoveredLeads = await discoverLeads({
      platform,
      count,
      icp: campaign.icp as {
        title?: string;
        description?: string;
        targetRoles: string[];
        companySize: string[];
        industries: string[];
        painPoints: string[];
        keywords: string[];
        decisionCriteria: string[];
        generatedAt?: string;
      },
      product: {
        name: campaign.product.name,
        description: campaign.product.description,
        keyFeatures: campaign.product.keyFeatures,
        targetIndustries: campaign.product.targetIndustries,
        usp: campaign.product.usp,
        website: campaign.product.website,
      },
      campaignId,
      userId,
    });

    // Save leads to database
    const savedLeads = await LeadModel.insertMany(
      discoveredLeads.map((l) => ({ ...l, createdAt: new Date(), updatedAt: new Date() }))
    );

    // Update campaign stats
    await CampaignModel.findByIdAndUpdate(campaignId, {
      $inc: { 'stats.leadsDiscovered': savedLeads.length },
      status: 'active',
    });

    return NextResponse.json({
      leads: savedLeads,
      count: savedLeads.length,
      message: `${savedLeads.length} leads discovered successfully`,
    });
  } catch (error) {
    console.error('POST /api/leads/discover error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
