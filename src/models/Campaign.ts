import mongoose, { Schema, Document, Model } from 'mongoose';

const ProductProfileSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  keyFeatures: [{ type: String }],
  targetIndustries: [{ type: String }],
  usp: { type: String, required: true },
  website: { type: String },
}, { _id: false });

const ICPSchema = new Schema({
  title: { type: String },
  description: { type: String },
  targetRoles: [{ type: String }],
  companySize: [{ type: String }],
  industries: [{ type: String }],
  painPoints: [{ type: String }],
  keywords: [{ type: String }],
  decisionCriteria: [{ type: String }],
  generatedAt: { type: String },
}, { _id: false });

const ChannelSchema = new Schema({
  platform: {
    type: String,
    enum: ['linkedin', 'twitter', 'google', 'instagram', 'tiktok', 'email'],
    required: true,
  },
  enabled: { type: Boolean, default: true },
  config: { type: Map, of: String },
}, { _id: false });

const MessageTemplateSchema = new Schema({
  subject: { type: String },
  body: { type: String, required: true },
  personalizationTokens: [{ type: String }],
  platform: { type: String, required: true },
  tone: { type: String, enum: ['formal', 'casual', 'friendly'], default: 'friendly' },
}, { _id: false });

const CampaignStatsSchema = new Schema({
  leadsDiscovered: { type: Number, default: 0 },
  messagesSent: { type: Number, default: 0 },
  messagesOpened: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  optOuts: { type: Number, default: 0 },
}, { _id: false });

export interface ICampaign extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  product: {
    name: string;
    description: string;
    keyFeatures: string[];
    targetIndustries: string[];
    usp: string;
    website?: string;
  };
  icp: {
    title?: string;
    description?: string;
    targetRoles: string[];
    companySize: string[];
    industries: string[];
    painPoints: string[];
    keywords: string[];
    decisionCriteria: string[];
    generatedAt?: string;
  };
  channels: {
    platform: string;
    enabled: boolean;
    config?: Map<string, string>;
  }[];
  messageTemplate: {
    subject?: string;
    body: string;
    personalizationTokens: string[];
    platform: string;
    tone: string;
  };
  stats: {
    leadsDiscovered: number;
    messagesSent: number;
    messagesOpened: number;
    replies: number;
    conversions: number;
    optOuts: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
      maxlength: [200, 'Campaign name cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed'],
      default: 'draft',
    },
    product: { type: ProductProfileSchema, required: true },
    icp: { type: ICPSchema, default: {} },
    channels: [ChannelSchema],
    messageTemplate: {
      type: MessageTemplateSchema,
      default: { body: '', personalizationTokens: [], platform: 'linkedin', tone: 'friendly' },
    },
    stats: { type: CampaignStatsSchema, default: {} },
  },
  {
    timestamps: true,
  }
);

CampaignSchema.index({ userId: 1, status: 1 });
CampaignSchema.index({ userId: 1, createdAt: -1 });

const CampaignModel: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default CampaignModel;
