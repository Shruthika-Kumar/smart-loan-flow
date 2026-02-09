# Implementation Plan - Advanced Loan Features

Transforming the Smart Loan Flow into a premium, industry-ready application with AI-driven security and financial transparency.

## Proposed Changes

---

### [Component] AI Fraud Detection (Internal)
**Goal**: Assist Officers by flagging potential inconsistencies in documents.

#### [MODIFY] [Document.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/models/Document.js)
- Add `fraudFlag` (Boolean) and `fraudNotes` (String) fields.

#### [NEW] [fraudService.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/services/fraudService.js)
- Implement `detectFraud(document, user)` function:
    - Logic: Check if Name on Document (from OCR) significantly differs from User Profile name.
    - Logic: Check if the document ID (PAN/Aadhaar) matches other users to detect multi-account fraud.

#### [MODIFY] [documentRoutes.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/routes/documentRoutes.js)
- Call `fraudService` immediately after a successful OCR extraction.

---

### [Component] Interactive Amortization Schedule (Applicant)
**Goal**: Visual breakdown of loan repayments.

#### [NEW] [amortization.ts](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/lib/amortization.ts)
- Implement `calculateAmortizationSchedule(principal, rate, tenure)`.
- Returns an array of monthly objects: `{ month, interest, principal, balance }`.

#### [NEW] [AmortizationSchedule.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/loan/AmortizationSchedule.tsx)
- Recharts AreaChart to show Principal vs Interest over time.
- Scrollable table for month-by-month details.
- Integrate into `ApplicantDashboard` for approved loans.

---

### [Component] Digital E-Signatures (Applicant)
**Goal**: Legal closure of the loan disbursement process.

#### [MODIFY] [Loan.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/models/Loan.js)
- Add `signatureStatus` enum: `unsigned`, `signed`.
- Add `eSignedAt` and `signatureData`.

#### [NEW] [EButtonGroup.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/loan/EButtonGroup.tsx)
- Action buttons for Approved loans: "Sign Sanction Letter", "Download PDF".

#### [NEW] [SignatureModal.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/loan/SignatureModal.tsx)
- A drawing canvas (using `react-signature-canvas`) or a "Typed Signature" simulation.

---

### [Component] Document Re-upload Loop
**Goal**: Streamline document corrections.

#### [MODIFY] [Document.js](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/backend/models/Document.js)
- Expand `status` enum: `completed`, `failed`, `re-upload_required`.

#### [MODIFY] [OfficerDashboard](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/officer/OfficerDashboard.tsx)
- Add "Request Re-upload" button with a comment field.

#### [MODIFY] [ApplicantDashboard](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/ApplicantDashboard.tsx)
- Add "Current Alerts" widget to show documents needing re-upload.

## Verification Plan

### Automated
- Unit test for `amortization.ts` logic.
- API test for signature persistence.

### Manual
1. Officer side: Trigger re-upload request -> Applicant side: Verify alert visibility.
2. Applicant side: Sign approved loan -> DB check: Verify timestamp update.
3. Test fraud detection by uploading a PAN with a slightly different name.
