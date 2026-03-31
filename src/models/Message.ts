import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  campaignId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  platform: string;
  subject?: string;
  body: string;
  status: 'pending_approval' | 'approved' | 'sent' | 'delivered' | 'opened' | 'replied' | 'failed' | 'rejected';
  scheduledAt?: Date;
  sentAt?: Date;
  openedAt?: Date;
  repliedAt?: Date;
  replyContent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ['linkedin', 'twitter', 'email', 'instagram', 'tiktok'],
    },
    subject: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Message body is required'],
    },
    status: {
      type: String,
      enum: ['pending_approval', 'approved', 'sent', 'delivered', 'opened', 'replied', 'failed', 'rejected'],
      default: 'pending_approval',
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    openedAt: {
      type: Date,
    },
    repliedAt: {
      type: Date,
    },
    replyContent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ userId: 1, status: 1 });
MessageSchema.index({ userId: 1, campaignId: 1 });
MessageSchema.index({ userId: 1, createdAt: -1 });

const MessageModel: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
