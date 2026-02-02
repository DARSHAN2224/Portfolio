import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Certification date is required'],
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    url: String,
    category: {
      type: String,
      enum: [
        'Certification',
        'Award',
        'Publication',
        'Research',
        'Other',
      ],
      default: 'Certification',
    },
    credentialId: String,
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

certificationSchema.index({ date: -1 });
certificationSchema.index({ category: 1 });

export default mongoose.model('Certification', certificationSchema);
