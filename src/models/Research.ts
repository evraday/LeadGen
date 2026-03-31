import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResearch extends Document {
  userId: mongoose.Types.ObjectId;
  campaignId?: mongoose.Types.ObjectId;
  productProfile: {
    name: string;
    description: string;
    keyFeatures: string[];
    targetIndustries: string[];
    usp: string;
    website?: string;
  };
  icp: {
    title: string;
    description: string;
    targetRoles: string[];
    companySize: string[];
    industries: string[];
    painPoints: string[];
    keywords: string[];
    decisionCriteria: string[];
    generatedAt?: string;
  };
  marketAnalysis: {
    totalAddressableMarket: string;
    targetSegments: string[];
    keyTrends: string[];
    challenges: string[];
    opportunities: string[];
  };
  competitorAnalysis: {
    name: string;
    strengths: string[];
    weaknesses: string[];
    positioning: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ResearchSchema = new Schema<IResearch>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    productProfile: {
      name: { type: String, required: true },
      description: { type: String, required: true },
      keyFeatures: [{ type: String }],
      targetIndustries: [{ type: String }],
      usp: { type: String, required: true },
      website: { type: String },
    },
    icp: {
      title: { type: String },
      description: { type: String },
      targetRoles: [{ type: String }],
      companySize: [{ type: String }],
      industries: [{ type: String }],
      painPoints: [{ type: String }],
      keywords: [{ type: String }],
      decisionCriteria: [{ type: String }],
      generatedAt: { type: String },
    },
    marketAnalysis: {
      totalAddressableMarket: { type: String },
      targetSegments: [{ type: String }],
      keyTrends: [{ type: String }],
      challenges: [{ type: String }],
      opportunities: [{ type: String }],
    },
    competitorAnalysis: [
      {
        name: { type: String },
        strengths: [{ type: String }],
        weaknesses: [{ type: String }],
        positioning: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ResearchSchema.index({ userId: 1, createdAt: -1 });

const ResearchModel: Model<IResearch> =
  mongoose.models.Research || mongoose.model<IResearch>('Research', ResearchSchema);

export default ResearchModel;
