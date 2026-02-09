const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['applicant', 'officer'],
        default: 'applicant'
    },
    fullName: { type: String },
    phone: { type: String },
    // Profile Fields
    mobile: { type: String },
    address: { type: String },
    companyName: { type: String },
    designation: { type: String },
    monthlyIncome: { type: Number },
    // KYC Status
    kycStatus: {
        type: String,
        enum: ['pending', 'submitted', 'verified', 'rejected'],
        default: 'pending'
    },
    kycDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
