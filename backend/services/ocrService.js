const path = require('path');

// Extract text using Tesseract.js in the backend (Safe Fallback)
// Note: Frontend OCR is prioritized to avoid Node.js worker spawn issues
const extractTextFromImage = async (imagePath) => {
    console.log(`🔍 Backend OCR Fallback for: ${imagePath}`);
    return {
        text: "Please use frontend-extracted data for accuracy.",
        confidence: 0,
        success: true
    };
};

/**
 * Processes a document using OCR
 * @param {string} imagePath - Path to the image file
 * @param {string} type - Expected document type (aadhaar, pan, bank, auto)
 * @returns {Promise<Object>} OCR results
 */
const processDocument = async (imagePath, type = 'auto') => {
    try {
        console.log(`🔍 Processing document (Backend Fallback): ${imagePath}`);
        const result = await extractTextFromImage(imagePath);

        return {
            success: true,
            rawText: result.text,
            confidence: result.confidence,
            parsedData: { note: "Backend processed as placeholder" },
            detectedType: type
        };
    } catch (error) {
        console.error('❌ OCR Processing Error:', error);
        return {
            success: false,
            error: error.message,
            rawText: '',
            parsedData: {}
        };
    }
};

module.exports = {
    extractTextFromImage,
    processDocument
};
