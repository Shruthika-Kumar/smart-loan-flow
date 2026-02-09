const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentType: {
        type: String,
        enum: ['Aadhaar', 'PAN', 'BankStatement', 'IncomeCertificate', 'AddressProof', 'Other'],
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    mimeType: {
        type: String
    },
    extractedText: {
        type: String
    },
    parsedData: {
        type: mongoose.Schema.Types.Mixed
    },
    confidence: {
        type: Number,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'verified', 're-upload_required'],
        default: 'pending'
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verificationNotes: {
        type: String
    },
    fraudFlag: {
        type: Boolean,
        default: false
    },
    fraudNotes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp manually if needed, or rely on default
// documentSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

module.exports = mongoose.model('Document', documentSchema);
