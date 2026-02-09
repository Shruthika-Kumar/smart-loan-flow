# Implementation Plan - Notification System

Implement a real-time (polling-based for now) notification system to inform applicants about loan status changes and document verifications.

## Backend Changes

### [NEW] [Notification.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/models/Notification.js)
- Schema:
    - `userId`: String (required)
    - `title`: String (required)
    - `message`: String (required)
    - `type`: String (enum: `loan`, `document`, `system`)
    - `read`: Boolean (default: `false`)
    - `createdAt`: Date (default: `now`)

### [NEW] [notificationRoutes.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/routes/notificationRoutes.js)
- `GET /api/notifications/user/:userId`: Fetch list of notifications.
- `PATCH /api/notifications/:id/read`: Mark a notification as read.
- `PATCH /api/notifications/user/:userId/read-all`: Mark all as read.

### [MODIFY] [server.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/server.js)
- Register the new notification routes.

### [MODIFY] Controllers
- Add logic to create notifications in:
    - `loanRoutes.js`: When a loan is submitted or status is updated.
    - `documentRoutes.js`: When a document is uploaded or verified.

## Frontend Changes

### [MODIFY] [ApplicantLayout.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/layout/ApplicantLayout.tsx)
- Replace hardcoded notifications with real API calls.
- Implement polling or manual refresh logic.
- Connect "Mark all as read" to the backend.

## Verification
- Test by submitting a loan and seeing a "Loan Submitted" notification.
- Mock a status update to "Approved" and verify the notification appears.
