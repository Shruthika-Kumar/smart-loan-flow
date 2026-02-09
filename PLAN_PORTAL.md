# Implementation Plan - Applicant Portal Finalization

This plan covers filling out the content and functionality for all applicant-facing pages, including new pages for Profile and Activity Logs.

## New Pages

### [NEW] [MyProfile.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/MyProfile.tsx)
- Display user details (Name, Email, Mobile).
- Sections for Identity, Employment (extracted from OCR if available), and Settings.
- Basic profile editing functionality.

### [NEW] [ActivityLog.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/ActivityLog.tsx)
- A chronological list of user activities.
- *Activities*: "Application Started", "Document Uploaded", "KYC Verified", etc.

## Enhanced Pages

### [ApplicantDashboard.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/ApplicantDashboard.tsx)
- Integrate real DTI/Eligibility logic from `calculations.ts`.
- Add a "Quick Actions" section (Track, Apply, Upload).

### [ApplicationTracking.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/ApplicationTracking.tsx)
- Ensure the stepper reflects real application status stages (Submit -> Review -> Verified -> Decision).

## Infrastructure

### [App.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/App.tsx)
- Register routes for `/applicant/profile` and `/applicant/activity`.

### [ApplicantLayout.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/layout/ApplicantLayout.tsx)
- Update dropdown links to point to the new routes.

## Verification
- Manual walkthrough of all routes.
- Ensure state persistence between page transitions.
