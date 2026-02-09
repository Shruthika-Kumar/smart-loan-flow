const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { fullName, phone, mobile, address, companyName, designation, monthlyIncome } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (mobile) user.mobile = mobile;
        if (address) user.address = address;
        if (companyName) user.companyName = companyName;
        if (designation) user.designation = designation;
        if (monthlyIncome) user.monthlyIncome = monthlyIncome;

        const updatedUser = await user.save();

        // Remove password before sending back
        const userObject = updatedUser.toObject();
        delete userObject.password;

        res.json({
            message: 'Profile updated successfully',
            user: userObject
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update KYC status (internal/officer will eventually do this, but applicant triggers 'submitted')
router.patch('/kyc-status', authMiddleware, async (req, res) => {
    try {
        const { status, documentId } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (status) user.kycStatus = status;
        if (documentId) {
            if (!user.kycDocuments.includes(documentId)) {
                user.kycDocuments.push(documentId);
            }
        }

        await user.save();
        res.json({ message: 'KYC status updated', kycStatus: user.kycStatus });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
