// Test script to check loans in database
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const Loan = require('./models/Loan');
        const loans = await Loan.find({});

        console.log(`\nTotal loans in database: ${loans.length}\n`);

        loans.forEach((loan, index) => {
            console.log(`Loan ${index + 1}:`);
            console.log(`  ID: ${loan._id}`);
            console.log(`  User ID: ${loan.userId}`);
            console.log(`  Full Name: ${loan.fullName}`);
            console.log(`  Amount: ${loan.amount}`);
            console.log(`  Purpose: ${loan.purpose}`);
            console.log(`  Status: ${loan.status}`);
            console.log(`  Created: ${loan.createdAt}`);
            console.log('');
        });

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
