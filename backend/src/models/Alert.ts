import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  ngoId: mongoose.Types.ObjectId;
  type: 'low-stock' | 'expiry' | 'new-donation' | 'volunteer-request' | 'system';
  message: string;
  isRead: boolean;
  relatedEntity?: {
    type: 'donation' | 'inventory' | 'volunteer';
    id: mongoose.Types.ObjectId;
  };
  priority: 'high' | 'medium' | 'low';
}

const alertSchema = new Schema<IAlert>(
  {
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
    },
    type: {
      type: String,
      enum: ['low-stock', 'expiry', 'new-donation', 'volunteer-request', 'system'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ['donation', 'inventory', 'volunteer'],
      },
      id: {
        type: Schema.Types.ObjectId,
      }
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAlert>('Alert', alertSchema);
