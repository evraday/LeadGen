import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CampaignModel from '@/models/Campaign';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = (session.user as { id: string }).id;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;

    const total = await CampaignModel.countDocuments(filter);
    const campaigns = await CampaignModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: campaigns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/campaigns error:', error);
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

    if (!body.product?.name || !body.product?.usp) {
      return NextResponse.json({ error: 'Product name and USP are required' }, { status: 400 });
    }

    await connectDB();

    const campaign = await CampaignModel.create({
      userId,
      name: body.name || `${body.product.name} Campaign`,
      status: 'draft',
      product: body.product,
      icp: body.icp || {},
      channels: body.channels || [],
      messageTemplate: body.messageTemplate || { body: '', personalizationTokens: [], platform: 'linkedin', tone: 'friendly' },
      stats: { leadsDiscovered: 0, messagesSent: 0, messagesOpened: 0, replies: 0, conversions: 0, optOuts: 0 },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('POST /api/campaigns error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
