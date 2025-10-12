import mongoose, { Document, Schema } from 'mongoose';

export interface INGO extends Document {
  userId: mongoose.Types.ObjectId;
  organizationName: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  category: string;
  documents: Array<{
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  needs: string[];
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}

const ngoSchema = new Schema<INGO>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    category: {
      type: String,
      required: true,
    },
    documents: [{
      type: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    }],
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
    needs: [{
      type: String,
    }],
    contact: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.NGO || mongoose.model<INGO>('NGO', ngoSchema);
