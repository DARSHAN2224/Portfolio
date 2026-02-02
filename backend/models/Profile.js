const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    title: {
      type: String,
      default: 'Software Engineer',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: null, // URL to avatar image
    },
    systemDescription: {
      type: String,
      default: 'DARSHAN-OS: A living, extensible operating system representing an engineer\'s skills and experience.',
    },
    uptime: {
      type: String,
      default: '99.9%', // Flavor text for system aesthetics
    },
    leetcodeStats: {
      solved: { type: Number, default: 0 },
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      ranking: { type: String, default: 'N/A' }
    },
    hackerrankStats: {
      solved: { type: Number, default: 0 },
      badge: { type: String, default: 'N/A' }
    },
    codeforcesStats: {
      solved: { type: Number, default: 0 },
      rating: { type: String, default: 'N/A' }
    },
    systemStatus: {
      type: String,
      enum: ['OPTIMAL', 'WARNING', 'ERROR'],
      default: 'OPTIMAL',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
