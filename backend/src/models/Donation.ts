import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  donorId: mongoose.Types.ObjectId;
  ngoId: mongoose.Types.ObjectId;
  ngoName: string;
  items: Array<{
    name: string;
    quantity: number;
    category: string;
  }>;
  status: 'pending' | 'confirmed' | 'received' | 'delivered';
  notes?: string;
  donationDate: Date;
  deliveryDate?: Date;
  type: 'goods' | 'money' | 'services';
}

const donationSchema = new Schema<IDonation>(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
    },
    ngoName: {
      type: String,
      required: true,
    },
    items: [{
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      category: { type: String, required: true },
    }],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'received', 'delivered'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    type: {
      type: String,
      enum: ['goods', 'money', 'services'],
      default: 'goods',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDonation>('Donation', donationSchema);
