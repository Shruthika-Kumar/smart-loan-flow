# Email Notifications Setup Guide

## Overview
The Smart Loan Flow application now sends automated emails for:
1. **Welcome Email** - When a user registers
2. **Loan Submitted Email** - When a loan application is submitted
3. **Status Update Email** - When loan status changes (Approved/Rejected)

## Email Service Configuration

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Step Verification**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification
   - Follow the steps to enable it

2. **Create App Password**
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Google will generate a 16-character password
   - Copy this password

3. **Update .env File**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### Option 2: Other Email Services

You can use any SMTP service. Update `backend/services/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

**Popular Services:**
- **SendGrid**: Professional email service with free tier
- **Mailgun**: Developer-friendly email API
- **AWS SES**: Amazon's email service
- **Outlook**: Use `service: 'outlook'`

## Testing Email Functionality

### 1. Test Registration Email
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "your-test-email@gmail.com",
    "password": "password123",
    "role": "applicant"
  }'
```

### 2. Test Loan Submission Email
- Log in to the application
- Submit a loan application
- Check your email for confirmation

### 3. Test Status Update Email
```bash
# Update loan status (requires loan ID)
curl -X PATCH http://localhost:5000/api/loans/LOAN_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Approved"}'
```

## Email Templates

All email templates are in `backend/services/emailService.js`. They include:

- **Professional HTML design** with inline CSS
- **Responsive layout** for mobile devices
- **Brand colors** matching the application theme
- **Call-to-action buttons** linking back to the app
- **Dynamic content** personalized for each user

## Customization

### Change Email Sender Name
In `emailService.js`, update:
```javascript
from: 'Your Company Name <noreply@yourcompany.com>'
```

### Modify Email Content
Edit the HTML templates in each function:
- `sendWelcomeEmail()`
- `sendLoanSubmittedEmail()`
- `sendLoanStatusEmail()`

### Add New Email Types
1. Create a new function in `emailService.js`
2. Export it at the bottom
3. Import and call it in the appropriate route

## Troubleshooting

### Emails Not Sending

1. **Check Console Logs**
   - Look for "Email service is ready" on server start
   - Check for error messages when emails are sent

2. **Verify Credentials**
   - Make sure EMAIL_USER and EMAIL_PASSWORD are correct
   - For Gmail, ensure you're using an App Password, not your regular password

3. **Check Spam Folder**
   - Emails might be filtered as spam initially
   - Mark them as "Not Spam" to improve deliverability

4. **Test Email Configuration**
   ```javascript
   // In backend/services/emailService.js
   testEmailConfig().then(result => {
       console.log('Email test:', result ? 'Success' : 'Failed');
   });
   ```

### Common Errors

- **"Invalid login"**: Wrong email or password
- **"Connection timeout"**: Firewall blocking SMTP port
- **"Self-signed certificate"**: Add `tls: { rejectUnauthorized: false }`

## Production Considerations

1. **Use Professional Email Service**
   - Gmail has sending limits (500/day)
   - Use SendGrid, Mailgun, or AWS SES for production

2. **Add Email Queue**
   - Use Bull or RabbitMQ for reliable email delivery
   - Retry failed emails automatically

3. **Track Email Metrics**
   - Monitor open rates, click rates
   - Use services like SendGrid for analytics

4. **Comply with Regulations**
   - Add unsubscribe links
   - Follow CAN-SPAM Act guidelines
   - Include physical address in footer

## Email Preview

All emails include:
- ✅ Professional header with gradient background
- ✅ Clear, readable content
- ✅ Action buttons for quick access
- ✅ Branded footer with company info
- ✅ Mobile-responsive design

## Next Steps

1. Configure your email credentials in `.env`
2. Restart the backend server
3. Test by registering a new user
4. Check your inbox for the welcome email!
