const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String, // frontend, backend, devops, etc.
      required: [true, 'Category is required'],
    },
    icon: {
      type: String, // Material Symbol name
      default: 'code',
    },
    version: {
      type: String, // e.g. "v18.2.0"
      default: 'Latest',
    },
    stability: {
      type: String, // STABLE, OPTIMAL, EXPERIMENTAL
      default: 'STABLE',
    },
    load: {
      type: Number, // 0-100 for the progress bar
      default: 80,
    },
    tags: [String],
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ category: 1 });

module.exports = mongoose.model('Skill', skillSchema);
