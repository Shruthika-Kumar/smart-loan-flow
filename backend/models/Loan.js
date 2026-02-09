const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Ideally ObjectId ref to User collection
    fullName: { type: String, required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    purpose: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    signatureStatus: {
        type: String,
        enum: ['unsigned', 'signed'],
        default: 'unsigned'
    },
    eSignedAt: { type: Date },
    signatureData: { type: String }, // Base64 or Text representation
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('Loan', loanSchema);
