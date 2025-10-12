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
  tags: string[]; // New field for better search
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
      index: true, // Add index for search
    },
    description: {
      type: String,
      required: true,
      index: true, // Add index for search
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true, index: true },
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
      index: true, // Add index for filtering
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
      index: true, // Add index for search
    }],
    contact: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      index: true, // Add index for search
    }],
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better search performance
ngoSchema.index({ 
  organizationName: 'text', 
  description: 'text', 
  needs: 'text',
  tags: 'text'
});

export default mongoose.model<INGO>('NGO', ngoSchema);
