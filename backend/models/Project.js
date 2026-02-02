const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    domain: {
      type: String,
      enum: [
        'ServiceNow',
        'Full-Stack',
        'Backend',
        'Frontend',
        'AI-ML',
        'Research',
        'Simulation',
        'Other',
      ],
      required: [true, 'Domain is required'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    systemLogs: [
      {
        title: String,
        description: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    metrics: {
      uptime: {
        type: String,
        default: '99.9%',
      },
      scale: String, // e.g., "10K+ users", "1M+ requests/day"
      latency: String, // e.g., "<100ms"
      availability: String, // e.g., "Global"
    },
    simulationType: {
      type: String,
      enum: [
        'DRONE_DELIVERY',
        'AI_CHAT_DEMO',
        'WORKFLOW_REPLAY',
        null,
      ],
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    links: {
      github: String,
      demo: String,
      docs: String,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    showGithubButton: {
      type: Boolean,
      default: true,
    },
    showLiveButton: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ domain: 1, isVisible: 1 });
projectSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Project', projectSchema);
