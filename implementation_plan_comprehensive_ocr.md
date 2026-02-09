# Comprehensive OCR Extraction Plan

Ensure all fields from all document types are captured, parsed, and displayed correctly in the application.

## Proposed Changes

### [Library] [ocr.ts](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/lib/ocr.ts)
- **Refine `parseSalarySlip`**: Improve employer name detection and add "Month/Year" extraction.
- **Refine `parseBankStatement`**: Add bank name detection (HDFC, SBI, ICICI, AXIS, etc.) using keyword matching.
- **[NEW] `parseForm16`**: Extract PAN of Deductor, PAN of Employee, Assessment Year, and Total Income.
- **Refine `parseAddressProof`**: Capture Consumer Name and Address more granularly.
- **Update `performOCR`**: Add support for `form16` detection and parsing.

### [Component] [SmartDocumentUpload.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/loan/SmartDocumentUpload.tsx)
- **Update `ExtractedData`**: Add `monthYear`, `employerName`, `pincode`, `ifscCode`, `assessmentYear`.
- **Refine Mapping**: Map every possible field from the OCR result to the UI state.
- **UI Update**: Ensure the preview section displays all relevant fields (e.g., showing Bank Name and IFSC for statements).

### [Page] [CompleteKYC.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/CompleteKYC.tsx)
- **Refine Mapping**: Align mapping with the updated `ocr.ts` results.
- **Ensure Display**: Verify that extracted data preview shows the newly added fields.

## Verification Plan

### Automated Tests
- Test the new `parseForm16` with sample OCR text.
- Verify improved detection of Bank Names and Employer Names using local test strings.

### Manual Verification
- Upload a variety of documents (PAN, Aadhaar, Salary Slip, Bank Statement, Form 16, Address Proof) in both the KYC page and the Loan Application flow.
- Verify that the "Extracted & Auto-filled" cards show real, accurate data for all fields.
- Verify that the auto-filling of forms (Loan Step 3, etc.) works with the new data.
