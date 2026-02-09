const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark a single notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark all notifications for a user as read
router.patch('/user/:userId/read-all', async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.params.userId, read: false },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a notification (Internal usage - could also be a service function)
router.post('/', async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;
        const notification = new Notification({
            userId,
            title,
            message,
            type
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
