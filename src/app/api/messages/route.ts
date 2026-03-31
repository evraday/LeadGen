import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MessageModel from '@/models/Message';
import LeadModel from '@/models/Lead';
import CampaignModel from '@/models/Campaign';
import { personalizeMessage } from '@/lib/leadGenService';
import { Lead } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const campaignId = searchParams.get('campaignId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    await connectDB();

    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;
    if (campaignId) filter.campaignId = campaignId;

    const total = await MessageModel.countDocuments(filter);
    const messages = await MessageModel.find(filter)
      .populate('leadId', 'name company title email source')
      .populate('campaignId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    const { campaignId, leadIds, template } = body;

    if (!campaignId || !leadIds?.length) {
      return NextResponse.json({ error: 'Campaign ID and lead IDs are required' }, { status: 400 });
    }

    await connectDB();

    // Verify campaign ownership
    const campaign = await CampaignModel.findOne({ _id: campaignId, userId });
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get leads
    const leads = await LeadModel.find({ _id: { $in: leadIds }, userId }).lean();

    // Create personalized messages for each lead
    const messages = await MessageModel.insertMany(
      leads.map((lead) => ({
        campaignId,
        leadId: lead._id,
        userId,
        platform: template?.platform || campaign.messageTemplate?.platform || 'linkedin',
        subject: template?.subject || campaign.messageTemplate?.subject,
        body: personalizeMessage(
          template?.body || campaign.messageTemplate?.body || '',
          lead as unknown as Lead
        ),
        status: 'pending_approval',
      }))
    );

    return NextResponse.json({
      messages,
      count: messages.length,
      message: `${messages.length} messages created and pending approval`,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
