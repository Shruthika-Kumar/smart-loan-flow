# Real OCR Implementation Plan (Frontend Pivot)

## 🎯 Goal
Enable reliable text extraction (OCR) by moving the processing engine from the backend to the **frontend (browser)**. This bypasses the persistent worker spawn issues encountered in the Node.js v24 backend environment.

## 🛠️ Proposed Solution: Frontend-Side OCR

### 1. Why Frontend?
- **Worker Stability**: Browsers have mature, stable Web Worker support compared to the current experimental Node.js environment.
- **Immediate Feedback**: Users see processing progress and extracted results before the final upload.
- **Reduced Server Load**: The client's machine handles the heavy lifting of image processing.

### 2. Implementation Overview

#### A. Frontend Changes (React)
- **Library**: `tesseract.js` (Browser version).
- **Service**: Create `src/services/ocrService.ts` to handle browser-side extraction.
- **Component**: Update `DocumentUpload.tsx` to run OCR on the file before sending it to the backend.

#### B. Backend Changes (Node.js)
- **API**: Update `POST /api/documents/upload` to accept `extractedData` and `rawText` in the request body.
- **Service**: Update `backend/services/ocrService.js` to prioritize provided data over backend processing.

---

## 📋 Step-by-Step Implementation

### Step 1: Frontend Setup
1. Install `tesseract.js` in the frontend:
   ```bash
   npm install tesseract.js
   ```
2. Create `src/lib/ocr.ts` with browser-side parsing logic (Aadhaar, PAN, Bank).

### Step 2: Update DocumentUpload Component
1. Import `tesseract.js`.
2. In `onDrop`, before calling the API:
   - Run `Tesseract.recognize` on the dropped file.
   - Use parsing logic to structure the data.
   - Pass this structured data along with the file in a `FormData` object.

### Step 3: Update Backend API
1. Modify `documentRoutes.js` to check for `req.body.extractedData`.
2. If present, save it directly to the `Document` model.
3. Keep the backend OCR service as a "mock" or optional fallback.

---

## ✅ Verification Plan

### Manual Verification
1. Upload an Aadhaar card image.
2. Watch the "Processing..." state (driven by frontend).
3. Confirm that the extracted data appears in the UI accurately.
4. Verify in the database that the data was saved correctly.

---

> [!TIP]
> This approach is significantly more robust for development environments where backend process spawning is restricted.

### 3. Handle PDF Files
If the user uploads a PDF, Tesseract.js cannot process it directly. We need a way to convert PDF pages to images (e.g., using `pdf-poppler` or `pdf-img-convert`).

---

## ✅ Verification Plan

### Automated Tests
- Run `node backend/services/ocrService.js` (with a test script) to verify extraction on a sample image.

### Manual Verification
1. Upload a real Aadhaar/PAN image.
2. Confirm the "Processing..." state completes.
3. Verify that the "Extracted Text" shown in the UI matches the document content.

---

> [!IMPORTANT]
> **Option A** is the immediate priority to keep the project self-contained. If worker spawn errors persist even with local paths, we will recommend switching to **Option B**.
