# Implementation Plan - Help Section Functionality

Make the "How to Apply", "FAQs", and "Support Center" items in the navigation header functional by creating dedicated pages and linking them.

## Proposed Changes

### New Pages

#### [NEW] [HowToApply.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/HowToApply.tsx)
- Step-by-step guide on the loan application process.
- Visual timeline/stepper explaining the 6 stages of the application.
- Tips for successful document upload and OCR verification.

#### [NEW] [FAQs.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/FAQs.tsx)
- Categorized list of frequently asked questions.
- Categories: General, Documentation, AI Eligibility, Disbursement.
- Uses Accordion/Collapsible UI for better readability.

#### [NEW] [SupportCenter.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/SupportCenter.tsx)
- Contact information for bank support.
- Simulated Live Chat/Message form.
- Status of current support tickets (simulated).

### Integration

#### [App.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/App.tsx)
- Add routes for:
    - `/applicant/how-to-apply`
    - `/applicant/faqs`
    - `/applicant/support`

#### [ApplicantLayout.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/layout/ApplicantLayout.tsx)
- Update `DropdownMenuItem` components for the Help section to use `navigate()` to the new routes.

## Verification
- Click each item in the Help dropdown and ensure it navigates to the correct page.
- Verify content quality and UI responsiveness for each new page.
