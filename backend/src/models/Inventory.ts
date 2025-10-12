import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  ngoId: mongoose.Types.ObjectId;
  itemName: string;
  category: string;
  quantity: number;
  currentStock: number;
  urgency: 'high' | 'medium' | 'low';
  expiryDate?: Date;
  description?: string;
  targetQuantity?: number;
}

const inventorySchema = new Schema<IInventory>(
  {
    ngoId: {
      type: Schema.Types.ObjectId,
      ref: 'NGO',
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },
    urgency: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    expiryDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    targetQuantity: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInventory>('Inventory', inventorySchema);
