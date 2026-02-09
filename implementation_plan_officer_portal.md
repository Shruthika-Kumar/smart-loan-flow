# Loan Officer Portal - Implementation Plan

## Goal
Complete the end-to-end loan application lifecycle by implementing a dedicated portal for Loan Officers to review, verify, and approve/reject applications and documents.

## User Review Required
> [!IMPORTANT]
> This module introduces a new role: `Officer`. I will add a way to toggle between Applicant and Officer views for testing purposes.

## Proposed Changes

### 1. Routing & Layout
- **[NEW] OfficerLayout**: A specialized layout for officers with navigation to Dashboard, Pending Reviews, and Analytics.
- **Update App.tsx**: Add routes for `/officer/dashboard` and `/officer/applications/:id`.

### 2. Officer Dashboard
- **[NEW] OfficerDashboard.tsx**:
  - Global stats (Total Pending, Approval Rate, Disbursement Volume).
  - A sortable/filterable table of all pending loan applications.
  - Search by Applicant Name or Pan Number.

### 3. Application Review View
- **[NEW] ApplicationReview.tsx**:
  - Detailed view of a single loan application.
  - Side-by-side view: **Uploaded Document** vs **AI-Extracted Data**.
  - **Verification Card**: Individual "Verify" or "Reject with Notes" actions for each document.
  - **Final Action Panel**: Approve or Reject the entire loan with final comments.

### 4. Integration
- Connect to existing backend endpoints:
  - `GET /api/loans/all` (Needs to be implemented/verified)
  - `PATCH /api/documents/:id/verify` (Already exists)
  - `PATCH /api/loans/:id/status` (Needs to be implemented/verified)

## Verification Plan

### Automated Tests
- Verification of state transitions in the application model.

### Manual Verification
1. Log in as an Applicant and submit a loan with documents.
2. Switch to Officer view.
3. Open the pending application.
4. Review and "Verify" a document.
5. "Reject" another document with notes and verify that the Applicant receives a notification and a "Re-upload required" status.
6. Finally, "Approve" the entire loan.
