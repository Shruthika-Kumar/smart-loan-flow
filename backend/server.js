const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Body:', JSON.stringify(req.body).substring(0, 200) + '...');
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-loan-flow')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Initialize Email Service
// Temporarily disabled to debug server startup
/*
const { initEmailService } = require('./services/emailService');
initEmailService().then(() => {
    console.log('Email service initialized');
}).catch(err => {
    console.error('Email service initialization failed:', err.message);
});
*/

// Routes
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/loans', loanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
