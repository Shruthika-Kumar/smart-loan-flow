const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { sendLoanSubmittedEmail, sendLoanStatusEmail } = require('../services/emailService');

// Create a new loan application
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Use authenticated user's ID instead of req.body.userId
        const loanData = {
            ...req.body,
            userId: req.user.id
        };
        const newLoan = new Loan(loanData);
        const savedLoan = await newLoan.save();

        // Get user details and send email notification
        const user = await User.findById(req.user.id);
        if (user) {
            sendLoanSubmittedEmail(user, savedLoan)
                .catch(err => console.error('Failed to send loan submitted email:', err));
        }

        // Create notification for submission
        const notification = new Notification({
            userId: req.user.id,
            title: 'Loan Application Submitted',
            message: `Your ${req.body.purpose} application for ₹${req.body.amount.toLocaleString()} has been received.`,
            type: 'loan'
        });
        await notification.save();

        res.status(201).json(savedLoan);
    } catch (err) {
        console.error('Error creating loan:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// Get all loans (for officer dashboard)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const loans = await Loan.find();
        res.status(200).json(loans);
    } catch (err) {
        console.error('Error fetching loans:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// Get loans by user ID (for applicant dashboard)
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        // Ensure user can only access their own loans (unless they're an officer)
        if (req.user.id !== req.params.userId && req.user.role !== 'officer') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const loans = await Loan.find({ userId: req.params.userId });
        res.status(200).json(loans);
    } catch (err) {
        console.error('Error fetching user loans:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get single loan by ID
router.get('/:id', async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        res.status(200).json(loan);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update loan status (for officer)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        // Get the loan first to get user details
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Update the loan status
        const updatedLoan = await Loan.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        // Send status update email
        const user = await User.findById(loan.userId);
        if (user) {
            const { sendLoanStatusEmail } = require('../services/emailService');
            sendLoanStatusEmail(user, updatedLoan, status)
                .catch(err => console.error('Failed to send status update email:', err));
        }

        // Create notification for status update
        const statusNotification = new Notification({
            userId: loan.userId,
            title: 'Loan Status Updated',
            message: `Your ${loan.purpose} application is now ${status}.`,
            type: 'loan'
        });
        await statusNotification.save();

        res.status(200).json(updatedLoan);
    } catch (err) {
        console.error('Error updating loan status:', err);
        res.status(500).json({ error: err.message });
    }
});

// Sign a loan (for approved loans)
router.patch('/:id/sign', authMiddleware, async (req, res) => {
    try {
        const { signatureData } = req.body;
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (loan.status !== 'Approved') {
            return res.status(400).json({ message: 'Only approved loans can be signed' });
        }

        const updatedLoan = await Loan.findByIdAndUpdate(
            req.params.id,
            {
                signatureStatus: 'signed',
                eSignedAt: new Date(),
                signatureData
            },
            { new: true }
        );

        // Notify user/bank
        const notification = new Notification({
            userId: loan.userId,
            title: 'Loan Agreement Signed',
            message: `You have successfully signed the sanction letter for your ${loan.purpose} loan.`,
            type: 'loan'
        });
        await notification.save();

        res.status(200).json(updatedLoan);
    } catch (err) {
        console.error('Error signing loan:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
