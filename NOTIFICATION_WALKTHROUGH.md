# Walkthrough - Functional Notification System

I have implemented a full-stack notification system that keeps applicants informed about their loan journey in real-time.

## Features Implemented

### 1. Backend Infrastructure
- **Notification Model**: Created a new database model to store notification titles, messages, types (loan/document), and read status.
- **API Routes**:
    - `GET /api/notifications/user/:userId`: Fetches the latest 50 notifications for the applicant.
    - `PATCH /api/notifications/:id/read`: Marks a specific notification as seen.
    - `PATCH /api/notifications/user/:userId/read-all`: Allows clearing all notifications at once.

### 2. Automatic Triggers
Notifications are now automatically generated when:
- A user submits a new loan application.
- A loan officer updates the status of an application (Approved/Rejected/Pending).
- A user uploads a document (after successful OCR processing).
- A loan officer verifies or rejects an uploaded document.

### 3. Dynamic Frontend Integration
- **Real-time Badge**: The bell icon in the header now displays a dynamic red badge with the count of unread notifications.
- **Interactive List**:
    - Clicking an unread notification marks it as read instantly.
    - "Mark all as read" button clears the entire list visually and in the database.
- **Polling**: The UI automatically checks for new notifications every 30 seconds, ensuring the applicant stays updated without refreshing.

## Verification Steps
1. **Loan Submission**: Apply for a loan and verify that a "Loan Application Submitted" notification appears in the header.
2. **Read Status**: Click on the unread notification and ensure the badge count decreases.
3. **Mark All**: Use the "Mark all as read" button and verify all indicators disappear.
