# OCR Enhancement & Advanced Parsing Plan

Improve document extraction accuracy and add support for missing document types (Salary Slips, Address Proofs).

## Proposed Changes

### [OCR Utility] [ocr.ts](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/lib/ocr.ts)

#### 1. Image Preprocessing
- Add a preprocessing step to convert images to high-contrast grayscale before OCR. This significantly helps Tesseract in complex backgrounds (like patterned salary slips).

#### 2. Advanced Parsers
- **[NEW] `parseSalarySlip`**: Extract Net Pay, Gross Pay, Month/Year, and Employer name using regex patterns commonly found in Indian salary slips.
- **[NEW] `parseAddressProof`**: Extract Pincodes and Full Address patterns.
- **[ENHANCED] `parseBankStatement`**: Add support for IFSC, Account Type, and multiple balance formats.

#### 3. Integration
- Update `performOCR` to detect `salary_slip` and `address_proof` types.
- Ensure mapping between `OCRResult` and frontend components (`SmartDocumentUpload.tsx`, `CompleteKYC.tsx`).

## Verification Plan

### Automated Tests
- Run `performOCR` with sample text strings representing various document formats to verify regex accuracy.

### Manual Verification
- Upload a complex PDF Salary Slip and verify "Net Pay" is correctly detected.
- Upload an Utility Bill (Address Proof) and verify the pincode is extracted.
- Compare "Before vs After" for a blurry document to verify the preprocessing impact.
