import mongoose, { Document, Schema } from 'mongoose';

export interface IVolunteer extends Document {
  donorId: mongoose.Types.ObjectId;
  ngoId: mongoose.Types.ObjectId;
  ngoName: string;
  skills: string[];
  availability: {
    days: string[];
    timeSlots: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: Date;
  message?: string;
}

const volunteerSchema = new Schema<IVolunteer>(
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
    skills: [{
      type: String,
    }],
    availability: {
      days: [{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }],
      timeSlots: [{
        type: String,
      }]
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVolunteer>('Volunteer', volunteerSchema);
