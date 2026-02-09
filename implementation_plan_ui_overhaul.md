# Applicant Portal UI Overhaul - Implementation Plan

## Goal
Transform the applicant portal into a state-of-the-art, premium financial dashboard. This involves applying rich aesthetics (gradients, glassmorphism, micro-animations) to all pages, matching the high standard of the recently updated `Documents` section.

## Proposed Changes

### 1. Visual Foundation
- **[MODIFY] [index.css](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/index.css)**: Add global utility classes for mesh gradients, glassmorphism (`glass-card`), and premium typography tokens.
- **[MODIFY] [ApplicantLayout.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/components/layout/ApplicantLayout.tsx)**: 
    - Implement a subtle, moving mesh gradient background.
    - Enhance the Sidebar/Header with better transparency and blur effects.

### 2. Dashboard Overhaul
- **[MODIFY] [ApplicantDashboard.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/ApplicantDashboard.tsx)**:
    - Replace standard cards with "Glass Cards".
    - Implement a more dynamic "Financial Score" visualization using a custom Gauge or circular progress.
    - Add a "Next Steps" timeline that feels futuristic and interactive.

### 3. Loan Application Wizard
- **[MODIFY] [LoanApplication.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/LoanApplication.tsx)**:
    - Transition the form into a multi-step animated wizard.
    - Use sliders and interactive components for loan amount/tenure selection.
    - Show real-time EMI updates with "pop" animations.

### 4. KYC & Profile Enhancements
- **[MODIFY] [CompleteKYC.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/CompleteKYC.tsx)**:
    - Add animated "scanning" effects when documents are uploaded.
    - Improve the "Success" states with celebratory micro-animations.
- **[MODIFY] [MyProfile.tsx](file:///C:/FINAL/SEM/PROJECT/smart-loan-flow/src/pages/applicant/MyProfile.tsx)**:
    - Re-layout as a modern "Identity Card" view.

## Verification Plan
### Manual Verification
1.  **Aesthetic Audit**: Verify that all pages feel cohesive and "premium".
2.  **Interaction Depth**: Check that every button hover and page transition feels smooth.
3.  **Responsive Check**: Ensure the new "rich" elements work well on mobile.
4.  **Dark Mode Validation**: Ensure mesh gradients and glass effects adapt beautifully to dark mode.
