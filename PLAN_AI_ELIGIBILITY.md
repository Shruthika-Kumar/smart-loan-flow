# Implementation Plan - AI Eligibility Preview

This plan outlines the steps to transition the **AI Eligibility Preview** from simulated data to real, data-driven calculations based on extracted OCR data and user inputs.

## Technical Goals
- **Approval Probability**: Scale based on DTI (Debt-to-Income) and Monthly Income.
- **DTI Ratio**: Calculate as `(Extracted EMIs + Estimated New EMI) / Monthly Income`.
- **EMI Calculation**: Use standard amortized EMI formula.

## Proposed Changes

### Logic & Math
- Create a utility for EMI and DTI calculations.
- Update `AIEligibilityPreview.tsx` to accept `ExtractedData`.

### UI Integration
- Pass OCR results from `LoanApplication.tsx` Step 2 to Step 6.
- Update recommendations to be dynamic.
