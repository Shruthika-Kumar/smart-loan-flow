const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processDocument } = require('../services/ocrService');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const { detectFraud } = require('../services/fraudService');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs only
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

// Upload and process document
router.post('/upload', authMiddleware, upload.single('document'), async (req, res) => {
    try {
        console.log('📄 Document upload request received');
        console.log('   User:', req.user);
        console.log('   File:', req.file);
        console.log('   Body:', req.body);

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { documentType } = req.body;
        const userId = req.user.id;

        console.log(`📄 Processing document upload for user ${userId}`);
        console.log(`   File: ${req.file.originalname}`);
        console.log(`   Type: ${documentType || 'auto-detect'}`);

        // Process document (OCR)
        let ocrResult;

        // If frontend already provided OCR results, use them
        if (req.body.extractedData) {
            console.log('Using pre-extracted OCR data from frontend');
            try {
                ocrResult = {
                    success: true,
                    parsedData: JSON.parse(req.body.extractedData),
                    rawText: req.body.rawText || '',
                    confidence: parseInt(req.body.confidence) || 0,
                    detectedType: req.body.documentType || documentType
                };
            } catch (err) {
                console.error('Error parsing pre-extracted data:', err);
                // Fallback to backend processing if parsing fails
                ocrResult = await processDocument(req.file.path, documentType || 'auto');
            }
        } else {
            // Otherwise run backend OCR
            ocrResult = await processDocument(req.file.path, documentType || 'auto');
        }
        console.log('✅ OCR processing complete:', ocrResult);

        // Create document record
        const document = new Document({
            userId,
            documentType: ocrResult.parsedData?.documentType || documentType || 'Other',
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            extractedText: ocrResult.rawText,
            parsedData: ocrResult.parsedData,
            confidence: ocrResult.confidence,
            status: ocrResult.success ? 'completed' : 'failed'
        });

        await document.save();

        // Run Fraud Detection
        const user = await User.findById(userId);
        if (user) {
            const fraudResult = detectFraud(document, user);
            if (fraudResult.isFraudulent) {
                document.fraudFlag = true;
                document.fraudNotes = fraudResult.notes;
                await document.save();
                console.log(`⚠️ Potential Fraud Detected for User ${userId}: ${fraudResult.notes}`);
            }
        }

        // Create notification for document upload
        const uploadNotification = new Notification({
            userId: userId,
            title: 'Document Uploaded',
            message: `Your ${document.documentType} has been successfully uploaded and processed.`,
            type: 'document'
        });
        await uploadNotification.save();

        console.log(`✅ Document saved with ID: ${document._id}`);

        // Generate file URL for frontend access
        const fileUrl = `/api/documents/file/${path.basename(document.filePath)}`;

        res.json({
            success: true,
            message: 'Document uploaded and processed successfully',
            document: {
                id: document._id,
                documentType: document.documentType,
                fileName: document.fileName,
                fileUrl: fileUrl,
                confidence: document.confidence,
                parsedData: document.parsedData,
                status: document.status
            }
        });

    } catch (error) {
        console.error('❌ Document upload error:', error);
        console.error('   Error stack:', error.stack);

        // Delete uploaded file if processing failed
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            error: 'Document upload failed',
            message: error.message
        });
    }
});

// Get all documents for a user
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        console.log('Fetching documents for userId:', userId);
        console.log('Authenticated user ID:', req.user.id);
        console.log('User role:', req.user.role);

        // Ensure user can only access their own documents
        // Convert both to strings for comparison
        if (userId && req.user.id.toString() !== userId.toString() && req.user.role !== 'officer') {
            console.log('❌ Unauthorized access attempt');
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const documents = await Document.find({ userId }).sort({ createdAt: -1 });

        console.log(`✅ Found ${documents.length} documents`);

        // Add fileUrl to each document
        const documentsWithUrls = documents.map(doc => {
            const docObj = doc.toObject();
            docObj.fileUrl = `/api/documents/file/${path.basename(doc.filePath)}`;
            return docObj;
        });

        res.json(documentsWithUrls);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
});

// Get single document
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Check authorization
        if (document.userId.toString() !== req.user.id && req.user.role !== 'officer') {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});

// Delete document
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Check authorization
        if (document.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        // Delete file from filesystem
        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }

        // Delete document record
        await Document.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

// Verify document (officer only)
router.patch('/:id/verify', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'officer') {
            return res.status(403).json({ error: 'Only officers can verify documents' });
        }

        const { verificationStatus, verificationNotes } = req.body;
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        document.verificationStatus = verificationStatus;
        document.verificationNotes = verificationNotes;
        document.verifiedBy = req.user.id;

        await document.save();

        // Create notification for document verification
        const verifyNotification = new Notification({
            userId: document.userId,
            title: 'Document Verified',
            message: `Your ${document.documentType} has been ${verificationStatus.toLowerCase()}.`,
            type: 'document'
        });
        await verifyNotification.save();

        res.json({
            success: true,
            message: 'Document verification updated',
            document
        });
    } catch (error) {
        console.error('Error verifying document:', error);
        res.status(500).json({ error: 'Failed to verify document' });
    }
});

// Request re-upload (officer only)
router.patch('/:id/request-reupload', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'officer') {
            return res.status(403).json({ error: 'Only officers can request re-uploads' });
        }

        const { notes } = req.body;
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        document.status = 're-upload_required';
        document.verificationStatus = 'rejected';
        document.verificationNotes = notes;
        await document.save();

        // Notify applicant
        const notification = new Notification({
            userId: document.userId,
            title: 'Action Required: Document Re-upload',
            message: `Your ${document.documentType} was rejected. Reason: ${notes}. Please upload a clear copy.`,
            type: 'document'
        });
        await notification.save();

        res.json({ success: true, message: 'Re-upload request sent to applicant', document });
    } catch (error) {
        console.error('Error requesting re-upload:', error);
        res.status(500).json({ error: 'Failed to request re-upload' });
    }
});

// Serve uploaded files
router.get('/file/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Send the file
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).json({ error: 'Failed to serve file' });
    }
});

module.exports = router;
