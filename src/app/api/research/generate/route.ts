import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ResearchModel from '@/models/Research';
import { generateICP, generateMarketAnalysis, generateCompetitorAnalysis, generateMessageTemplate } from '@/lib/aiService';
import { ProductProfile, ICP } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    const { product, generateMessage = false, platform = 'linkedin', icp: existingIcp, campaignId } = body;

    if (!product?.name || !product?.usp) {
      return NextResponse.json({ error: 'Product name and USP are required' }, { status: 400 });
    }

    if (generateMessage) {
      // Generate message template only
      const icpData = existingIcp || { targetRoles: [], industries: product.targetIndustries || [], painPoints: [], keywords: [] };
      const messageTemplate = await generateMessageTemplate(product as ProductProfile, icpData as ICP, platform);
      return NextResponse.json({ messageTemplate });
    }

    // Generate full research: ICP + Market Analysis + Competitor Analysis
    const [icp, marketAnalysis, competitorAnalysis] = await Promise.all([
      generateICP(product as ProductProfile),
      generateMarketAnalysis(product as ProductProfile),
      generateCompetitorAnalysis(product as ProductProfile),
    ]);

    await connectDB();

    // Save research to database
    const research = await ResearchModel.create({
      userId,
      campaignId: campaignId || undefined,
      productProfile: product,
      icp,
      marketAnalysis,
      competitorAnalysis,
    });

    return NextResponse.json({
      icp,
      marketAnalysis,
      competitorAnalysis,
      researchId: research._id,
    });
  } catch (error) {
    console.error('POST /api/research/generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
