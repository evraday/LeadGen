import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILead extends Document {
  campaignId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
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
  lastActivity?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    twitterUrl: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['linkedin', 'twitter', 'google', 'instagram', 'manual'],
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'replied', 'qualified', 'converted', 'unqualified', 'do_not_contact'],
      default: 'new',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

LeadSchema.index({ userId: 1, status: 1 });
LeadSchema.index({ userId: 1, campaignId: 1 });
LeadSchema.index({ userId: 1, createdAt: -1 });
LeadSchema.index({ email: 1 });

const LeadModel: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default LeadModel;
