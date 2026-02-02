const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null, // null means currently employed
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    systemLogs: [
      {
        achievement: String,
        outcome: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

experienceSchema.index({ startDate: -1, endDate: -1 });

module.exports = mongoose.model('Experience', experienceSchema);
