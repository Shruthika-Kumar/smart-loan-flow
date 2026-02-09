# Applicant Side Completion - Implementation Plan

## Goal
Finish all remaining features and polish the applicant experience to make it "completely over" before moving to the officer portal. This includes adding missing data persistence for KYC and Profile, and overall UI/UX refinement.

## User Review Required
> [!IMPORTANT]
> I will be updating the backend `User` model to support `kycStatus`. This is a necessary step for real persistence.

## Proposed Changes

### 1. Data Persistence (Backend & Frontend)
- **[MODIFY] [User.js](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/backend/models/User.js)**: Add `kycStatus` (enum), `kycDocuments` (list of hashes/refs), `address`, `mobile`, `companyName`, and `designation` fields.
- **[NEW] Profile Route**: Create `PUT /api/users/profile` in `userRoutes.js`.
- **[MODIFY] [CompleteKYC.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/CompleteKYC.tsx)**: Wire up the "Continue" button to save results to the backend.
- **[MODIFY] [MyProfile.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/MyProfile.tsx)**: Implement real save functionality using the new profile route.

### 2. UI/UX Polish
- **[NEW] Theme Toggle**: Add a theme switcher in the `ApplicantLayout` header for Dark Mode support.
- **[MODIFY] [ApplicantDashboard.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/ApplicantDashboard.tsx)**: 
    - Display the real KYC status from the user model.
    - Add a "Refresh" button or auto-polling for notifications.
- **[MODIFY] Support & FAQs**: Replace placeholder text with actual content or helpful links.

### 3. Application Tracking
- **[MODIFY] [ApplicationTracking.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/ApplicationTracking.tsx)**: Add a "Cancel Application" button for loans with a "Pending" status.

## Verification Plan

### Automated Tests
- Test profile update API with valid and invalid data.

### Manual Verification
1.  **KYC Flow**: Complete KYC, verify that the status in the dashboard changes to "Verified".
2.  **Profile Update**: Edit profile, save, refresh page, and verify changes persist.
3.  **Dark Mode**: Toggle dark mode and verify UI aesthetics in both modes.
4.  **Cancellation**: Cancel a pending loan and verify it disappears/updates status in "Track Status".
