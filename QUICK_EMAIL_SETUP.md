# Quick Email Setup Guide

## Step 1: Create Gmail App Password

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Or click your profile picture → "Manage your Google Account"

2. **Enable 2-Step Verification** (if not already enabled)
   - Go to: Security → 2-Step Verification
   - Click "Get Started" and follow the steps
   - You'll need your phone for verification

3. **Create App Password**
   - Go to: Security → 2-Step Verification → App passwords
   - Or direct link: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Windows Computer" (or other)
   - Click "Generate"
   - **Copy the 16-character password** (e.g., "abcd efgh ijkl mnop")

## Step 2: Update .env File

Open `backend/.env` and update these lines:

```
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:** 
- Remove spaces from the app password
- Use your real Gmail address
- Don't use quotes around the values

## Step 3: Restart Backend

After updating .env:
1. Stop the backend server (Ctrl+C in the terminal)
2. Start it again: `node server.js`
3. You should see: "✅ Email service is ready"

## Step 4: Test It!

### Test 1: Registration Email
1. Register a new user with your email
2. Check your inbox for "Welcome to Smart BankFlow!"

### Test 2: Loan Submission Email
1. Log in and submit a loan application
2. Check your inbox for "Loan Application Submitted"

### Test 3: Status Update Email
1. Use the officer dashboard (Phase 2) to approve/reject
2. Check your inbox for approval/rejection notification

## Troubleshooting

**"Invalid login" error:**
- Make sure you're using the App Password, not your regular Gmail password
- Remove any spaces from the password

**No email received:**
- Check spam folder
- Verify EMAIL_USER is correct
- Make sure backend shows "✅ Email service is ready"

**Can't find App Passwords:**
- You must enable 2-Step Verification first
- Try this direct link: https://myaccount.google.com/apppasswords

---

**Ready?** Follow these steps and let me know when you've updated the .env file!
