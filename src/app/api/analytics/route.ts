import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import LeadModel from '@/models/Lead';
import MessageModel from '@/models/Message';
import CampaignModel from '@/models/Campaign';
import { subDays, format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    await connectDB();

    // Overview stats
    const [totalLeads, campaigns, messages] = await Promise.all([
      LeadModel.countDocuments({ userId }),
      CampaignModel.find({ userId }).lean(),
      MessageModel.find({ userId }).lean(),
    ]);

    const totalMessagesSent = messages.filter((m) => ['sent', 'delivered', 'opened', 'replied'].includes(m.status)).length;
    const totalOpened = messages.filter((m) => ['opened', 'replied'].includes(m.status)).length;
    const totalReplied = messages.filter((m) => m.status === 'replied').length;
    const totalConverted = await LeadModel.countDocuments({ userId, status: 'converted' });
    const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;

    // Leads by status
    const leadsByStatusRaw = await LeadModel.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const leadsByStatus = leadsByStatusRaw.map((s) => ({ status: s._id, count: s.count }));

    // Messages by day (last 14 days)
    const messagesByDay = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM d');
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dayMessages = messages.filter((m) => {
        const createdAt = new Date(m.createdAt);
        return createdAt >= startOfDay && createdAt <= endOfDay;
      });

      messagesByDay.push({
        date: dateStr,
        sent: dayMessages.filter((m) => ['sent', 'delivered', 'opened', 'replied'].includes(m.status)).length,
        opened: dayMessages.filter((m) => ['opened', 'replied'].includes(m.status)).length,
        replied: dayMessages.filter((m) => m.status === 'replied').length,
      });
    }

    // Conversion funnel
    const [newCount, contactedCount, repliedCount, qualifiedCount, convertedCount] = await Promise.all([
      LeadModel.countDocuments({ userId }),
      LeadModel.countDocuments({ userId, status: { $in: ['contacted', 'replied', 'qualified', 'converted'] } }),
      LeadModel.countDocuments({ userId, status: { $in: ['replied', 'qualified', 'converted'] } }),
      LeadModel.countDocuments({ userId, status: { $in: ['qualified', 'converted'] } }),
      LeadModel.countDocuments({ userId, status: 'converted' }),
    ]);

    const conversionFunnel = [
      { stage: 'Discovered', count: newCount },
      { stage: 'Contacted', count: contactedCount },
      { stage: 'Replied', count: repliedCount },
      { stage: 'Qualified', count: qualifiedCount },
      { stage: 'Converted', count: convertedCount },
    ];

    // Top campaigns
    const topCampaigns = campaigns.slice(0, 5).map((c) => ({
      name: c.name,
      leads: c.stats.leadsDiscovered,
      messages: c.stats.messagesSent,
      conversions: c.stats.conversions,
      rate: c.stats.messagesSent > 0 ? Math.round((c.stats.conversions / c.stats.messagesSent) * 100) : 0,
    }));

    // Leads by source
    const leadsBySourceRaw = await LeadModel.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);
    const leadsBySource = leadsBySourceRaw.map((s) => ({ source: s._id, count: s.count }));

    return NextResponse.json({
      overview: {
        totalLeads,
        totalMessagesSent,
        openRate: totalMessagesSent > 0 ? Math.round((totalOpened / totalMessagesSent) * 100 * 10) / 10 : 0,
        replyRate: totalMessagesSent > 0 ? Math.round((totalReplied / totalMessagesSent) * 100 * 10) / 10 : 0,
        conversionRate: totalLeads > 0 ? Math.round((totalConverted / totalLeads) * 100 * 10) / 10 : 0,
        activeCampaigns,
      },
      leadsByStatus,
      messagesByDay,
      conversionFunnel,
      topCampaigns,
      leadsBySource,
    });
  } catch (error) {
    console.error('GET /api/analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
