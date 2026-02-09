# Global OCR Integration Plan

Extend the stabilized frontend-side OCR (Tesseract.js + pdf.js) to all document upload points in the application.

## Proposed Changes

### [Component] [SmartDocumentUpload.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/loan/SmartDocumentUpload.tsx)
- Replaced simulated OCR with real `performOCR` from `@/lib/ocr`.
- Map extracted fields (Name, UID, Bank info) to the existing `ExtractedData` interface.
- Add progress tracking during the "Processing" state.

### [Page] [CompleteKYC.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/CompleteKYC.tsx)
- Add a hidden file input for each document card to handle real file selection.
- Replace `simulateUpload` with a real upload/OCR flow.
- Integrate `performOCR` and map results to the KYC state.

## Verification Plan

### Manual Verification
- **Loan Application**: Upload a PAN card in the smart upload section and verify that "Extracted & Auto-filled" section shows real data.
- **KYC Page**: Upload an Aadhaar card PDF/Image and verify that the "Extracted Information" box appears with real data.
- **Console Logs**: Verify progress logs for both images and PDFs.
