# Officer Verification Module - Implementation Plan

## 🎯 Goal
Create a dedicated dashboard for Loan Officers to review, verify, or reject documents uploaded by applicants. This ensures data integrity and completes the human-in-the-loop verification process.

## 🏗️ Architecture

### 1. Backend: Verification API
- **Endpoint**: `PATCH /api/documents/:id/verify`
- **Role**: `officer` only (Middleware check)
- **Payload**:
  - `verificationStatus`: `verified` | `rejected`
  - `verificationNotes`: Reason for rejection or comments
- **Logic**: Update document status and potentially trigger loan status updates.

### 2. Frontend: Officer Dashboard
- **Route**: `/officer/dashboard`
- **Components**:
  - **Pending Documents List**: Table showing documents awaiting review.
  - **Document Viewer**: Modal or split-view to see the document image/PDF alongside extracted data.
  - **Action Panel**: Buttons for "Approve" and "Reject" with a notes field.

### 3. Data Flow
1. Applicant uploads document (Status: `pending`).
2. Officer logs in and sees pending documents.
3. Officer views document + OCR data.
4. Officer clicks "Verify" -> Status updates to `verified`.
5. Application moves to next stage (e.g., Credit Check).

## 📋 Step-by-Step Implementation

### Phase 1: Backend Updates
- [ ] Create `officer` role in User model (if not exists)
- [ ] Create/Update `authMiddleware` to check for `officer` role
- [ ] Implement `verifyDocument` controller function

### Phase 2: Frontend Dashboard
- [ ] Create `OfficerLayout` with specific navigation
- [ ] Build `OfficerDashboard` page
- [ ] Fetch all pending documents (`GET /api/documents/pending`)

### Phase 3: Verification UI
- [ ] Create `DocumentReviewModal` component
- [ ] Display Document Image (left) vs Extracted Data (right)
- [ ] Add Form for status update and notes
- [ ] Handle API call to verify document

### Phase 4: Integration
- [ ] Test efficient workflow: View -> Verify -> Next Document
- [ ] Show status updates in Applicant Dashboard

## 🛡️ Security
- Ensure only users with `role: officer` can access these endpoints.
- Prevent applicants from verifying their own documents.

## 🧪 Testing
- Create a test officer account.
- Upload documents as an applicant.
- Verify documents as an officer.
- Check status application-wide.
