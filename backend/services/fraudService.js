/**
 * Fraud Detection Service
 * Logic to identify inconsistencies in uploaded documents.
 */

const detectFraud = (document, user) => {
    const alerts = [];
    let isFraudulent = false;

    if (!document.parsedData) return { isFraudulent: false, alerts: [] };

    const { parsedData } = document;
    const documentType = document.documentType;

    // 1. Name Mismatch Check
    if (parsedData.fullName) {
        const docName = parsedData.fullName.toLowerCase().replace(/[^a-z]/g, '');
        const userName = (user.fullName || user.username).toLowerCase().replace(/[^a-z]/g, '');

        // Simple fuzzy check: if names are drastically different
        if (!docName.includes(userName) && !userName.includes(docName)) {
            alerts.push(`Name Mismatch: Document says "${parsedData.fullName}", but user profile is "${user.fullName || user.username}".`);
            isFraudulent = true;
        }
    }

    // 2. Document-Specific Checks
    if (documentType === 'PAN' && parsedData.panNumber) {
        // Example: Check if PAN format is valid (standard 10 char)
        const panRegex = /[A-Z]{5}[0-19]{4}[A-Z]{1}/;
        // (Simplified check for demo)
        if (parsedData.panNumber.length !== 10) {
            alerts.push(`Invalid PAN Format: Extracted PAN "${parsedData.panNumber}" is not 10 characters.`);
            isFraudulent = true;
        }
    }

    if (documentType === 'Aadhaar' && parsedData.aadhaarNumber) {
        if (parsedData.aadhaarNumber.replace(/\s/g, '').length !== 12) {
            alerts.push(`Invalid Aadhaar: Extracted number "${parsedData.aadhaarNumber}" is not 12 digits.`);
            isFraudulent = true;
        }
    }

    return {
        isFraudulent,
        notes: alerts.join(' | ')
    };
};

module.exports = { detectFraud };
