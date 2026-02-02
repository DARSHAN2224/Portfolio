const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        url: {
            type: String,
            required: [true, 'URL is required'],
            trim: true,
        },
        icon: {
            type: String,
            default: 'link', // Material Icon name
        },
        status: {
            type: String,
            default: 'ACTIVE',
        },
        color: {
            type: String,
            default: 'text-white', // Tailwind class
        },
        platform: {
            type: String,
            enum: ['social', 'coding'],
            default: 'social',
        },
        order: {
            type: Number,
            default: 0,
        },
        // For coding platforms
        rank: {
            type: String,
            default: '',
        },
        solved: {
            type: Number,
            default: 0,
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

socialLinkSchema.index({ order: 1, platform: 1 });

module.exports = mongoose.model('SocialLink', socialLinkSchema);
