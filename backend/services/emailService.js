const nodemailer = require('nodemailer');

// Check if email is configured
const isEmailConfigured = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;
    return user && pass &&
        user !== 'your-email@gmail.com' &&
        pass !== 'your-app-password-here';
};

// Create transporter - uses Ethereal (test) if no real email configured
const createTransporter = async () => {
    if (isEmailConfigured()) {
        console.log('📧 Using Gmail for emails');
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // Use Ethereal Email (fake SMTP for testing)
    console.log('📧 Using Ethereal Email (test mode)');
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    console.log('📧 Test email account created!');
    console.log('   View emails at: https://ethereal.email/messages');
    console.log('   Login: ' + testAccount.user);
    console.log('   Password: ' + testAccount.pass);

    return transporter;
};

let transporter = null;

// Initialize transporter
const initEmailService = async () => {
    try {
        transporter = await createTransporter();
        return true;
    } catch (error) {
        console.error('❌ Email service error:', error.message);
        return false;
    }
};

// Test email configuration
const testEmailConfig = async () => {
    if (!transporter) {
        await initEmailService();
    }

    if (!transporter) {
        console.log('Email service not configured - skipping');
        return false;
    }

    try {
        await transporter.verify();
        console.log('✅ Email service is ready');
        return true;
    } catch (error) {
        console.error('❌ Email service error:', error.message);
        return false;
    }
};

// Send welcome email on registration
const sendWelcomeEmail = async (user) => {
    if (!transporter) {
        await initEmailService();
    }

    if (!transporter) {
        console.log('Email not configured - skipping welcome email');
        return false;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'Smart BankFlow <noreply@smartbankflow.com>',
        to: user.email,
        subject: 'Welcome to Smart BankFlow! 🎉',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Smart BankFlow!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${user.username}! 👋</h2>
                        <p>Thank you for registering with Smart BankFlow. We're excited to have you on board!</p>
                        
                        <p><strong>Your account details:</strong></p>
                        <ul>
                            <li>Username: ${user.username}</li>
                            <li>Email: ${user.email}</li>
                            <li>Role: ${user.role}</li>
                        </ul>
                        
                        <p>With Smart BankFlow, you can:</p>
                        <ul>
                            <li>✅ Apply for loans with AI-powered processing</li>
                            <li>✅ Track your applications in real-time</li>
                            <li>✅ Get instant eligibility assessments</li>
                            <li>✅ Manage your loans efficiently</li>
                        </ul>
                        
                        <center>
                            <a href="http://localhost:8080/applicant/login" class="button">Login to Your Account</a>
                        </center>
                        
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        
                        <p>Best regards,<br>The Smart BankFlow Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Smart BankFlow. All rights reserved.</p>
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);

        // If using Ethereal, show preview URL
        if (nodemailer.getTestMessageUrl(info)) {
            console.log('📧 Preview email: ' + nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

// Send loan application submitted email
const sendLoanSubmittedEmail = async (user, loan) => {
    if (!transporter) {
        await initEmailService();
    }

    if (!transporter) {
        console.log('Email not configured - skipping loan submitted email');
        return false;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER || 'Smart BankFlow <noreply@smartbankflow.com>',
        to: user.email,
        subject: `Loan Application Submitted - ${loan.purpose}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Application Submitted Successfully!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${user.username},</h2>
                        <p>Your loan application has been successfully submitted and is now under review.</p>
                        
                        <div class="info-box">
                            <h3>Application Details:</h3>
                            <p><strong>Loan Type:</strong> ${loan.purpose}</p>
                            <p><strong>Amount:</strong> ₹${loan.amount.toLocaleString()}</p>
                            <p><strong>Tenure:</strong> ${loan.tenure} years</p>
                            <p><strong>Application ID:</strong> ${loan._id}</p>
                            <p><strong>Status:</strong> Pending Review</p>
                        </div>
                        
                        <p><strong>What happens next?</strong></p>
                        <ol>
                            <li>Document Verification (1-2 hours)</li>
                            <li>AI Risk Assessment (2-3 hours)</li>
                            <li>Officer Review (1-2 business days)</li>
                            <li>Final Decision</li>
                        </ol>
                        
                        <p>You'll receive email updates at each stage of the process.</p>
                        
                        <center>
                            <a href="http://localhost:8080/applicant/track" class="button">Track Your Application</a>
                        </center>
                        
                        <p>Best regards,<br>The Smart BankFlow Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Smart BankFlow. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Loan submitted email sent to ${user.email}`);

        if (nodemailer.getTestMessageUrl(info)) {
            console.log('📧 Preview email: ' + nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error('Error sending loan submitted email:', error);
        return false;
    }
};

// Send loan status update email
const sendLoanStatusEmail = async (user, loan, newStatus) => {
    if (!transporter) {
        await initEmailService();
    }

    if (!transporter) {
        console.log('Email not configured - skipping status update email');
        return false;
    }

    const statusConfig = {
        Approved: {
            subject: '🎉 Loan Approved!',
            title: 'Congratulations! Your Loan is Approved',
            message: 'We are pleased to inform you that your loan application has been approved!',
            color: '#10b981'
        },
        Rejected: {
            subject: 'Loan Application Update',
            title: 'Loan Application Decision',
            message: 'After careful review, we regret to inform you that your loan application was not approved at this time.',
            color: '#ef4444'
        }
    };

    const config = statusConfig[newStatus] || {
        subject: 'Loan Application Update',
        title: 'Application Status Update',
        message: `Your loan application status has been updated to: ${newStatus}`,
        color: '#667eea'
    };

    const mailOptions = {
        from: process.env.EMAIL_USER || 'Smart BankFlow <noreply@smartbankflow.com>',
        to: user.email,
        subject: config.subject,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: ${config.color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; border-left: 4px solid ${config.color}; margin: 20px 0; }
                    .button { display: inline-block; padding: 12px 30px; background: ${config.color}; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${config.title}</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${user.username},</h2>
                        <p>${config.message}</p>
                        
                        <div class="info-box">
                            <h3>Application Details:</h3>
                            <p><strong>Loan Type:</strong> ${loan.purpose}</p>
                            <p><strong>Amount:</strong> ₹${loan.amount.toLocaleString()}</p>
                            <p><strong>Tenure:</strong> ${loan.tenure} years</p>
                            <p><strong>New Status:</strong> ${newStatus}</p>
                        </div>
                        
                        ${newStatus === 'Approved' ? `
                            <p><strong>Next Steps:</strong></p>
                            <ul>
                                <li>Review and sign the loan agreement</li>
                                <li>Provide any additional documents if required</li>
                                <li>Funds will be disbursed within 2-3 business days</li>
                            </ul>
                        ` : ''}
                        
                        ${newStatus === 'Rejected' ? `
                            <p>You can apply again after reviewing and improving your application. Our team is here to help if you have any questions.</p>
                        ` : ''}
                        
                        <center>
                            <a href="http://localhost:8080/applicant/track" class="button">View Application</a>
                        </center>
                        
                        <p>If you have any questions, please don't hesitate to contact our support team.</p>
                        
                        <p>Best regards,<br>The Smart BankFlow Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Smart BankFlow. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Status update email sent to ${user.email}`);

        if (nodemailer.getTestMessageUrl(info)) {
            console.log('📧 Preview email: ' + nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error('Error sending status update email:', error);
        return false;
    }
};

module.exports = {
    initEmailService,
    testEmailConfig,
    sendWelcomeEmail,
    sendLoanSubmittedEmail,
    sendLoanStatusEmail
};
