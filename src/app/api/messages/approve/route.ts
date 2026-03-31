import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import MessageModel from '@/models/Message';
import LeadModel from '@/models/Lead';
import CampaignModel from '@/models/Campaign';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    const { messageIds, action } = body; // action: 'approve' | 'reject'

    if (!messageIds?.length || !action) {
      return NextResponse.json({ error: 'Message IDs and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be approve or reject' }, { status: 400 });
    }

    await connectDB();

    const newStatus = action === 'approve' ? 'sent' : 'rejected';
    const now = new Date();

    // Update message statuses
    const result = await MessageModel.updateMany(
      { _id: { $in: messageIds }, userId, status: 'pending_approval' },
      {
        $set: {
          status: newStatus,
          ...(action === 'approve' ? { sentAt: now } : {}),
        },
      }
    );

    if (action === 'approve') {
      // Update lead statuses to 'contacted'
      const messages = await MessageModel.find({ _id: { $in: messageIds }, userId });
      const leadIds = messages.map((m) => m.leadId);

      await LeadModel.updateMany(
        { _id: { $in: leadIds }, status: 'new' },
        { $set: { status: 'contacted', lastActivity: now } }
      );

      // Update campaign stats
      const campaignIds = [...new Set(messages.map((m) => m.campaignId.toString()))];
      for (const cId of campaignIds) {
        const countForCampaign = messages.filter((m) => m.campaignId.toString() === cId).length;
        await CampaignModel.findByIdAndUpdate(cId, {
          $inc: { 'stats.messagesSent': countForCampaign },
        });
      }

      // Simulate some messages being opened (30% open rate)
      const openedMessages = messages.filter(() => Math.random() < 0.3);
      if (openedMessages.length > 0) {
        await MessageModel.updateMany(
          { _id: { $in: openedMessages.map((m) => m._id) } },
          { $set: { status: 'opened', openedAt: new Date(now.getTime() + Math.random() * 3600000) } }
        );

        for (const cId of campaignIds) {
          const openedForCampaign = openedMessages.filter((m) => m.campaignId.toString() === cId).length;
          if (openedForCampaign > 0) {
            await CampaignModel.findByIdAndUpdate(cId, {
              $inc: { 'stats.messagesOpened': openedForCampaign },
            });
          }
        }
      }
    }

    return NextResponse.json({
      message: `${result.modifiedCount} messages ${action === 'approve' ? 'approved and sent' : 'rejected'}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('POST /api/messages/approve error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
