const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    issuer: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String, // Keeping as String for simple "2023" year format, or Date if full date needed later
        required: true
    },
    id_code: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: 'verified' // Material symbol
    },
    color: {
        type: String,
        default: 'text-gray-400' // Tailwind class
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
