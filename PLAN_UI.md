# Implementation Plan - Documents Page UI Upgrade

Upgrade the Document Management page to a premium, state-of-the-art interface with rich aesthetics, gradients, and micro-animations.

## Proposed Changes

### [Component] [Documents.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/pages/applicant/Documents.tsx)

#### Header Overhaul
- Replace the plain header with a high-contrast layout.
- Use a gradient for the "Document Management" title.
- Wrap the header in a subtle glassmorphism card for a premium look.

#### Upload Cards Redesign
- Redesign the Aadhaar, PAN, and Bank Statement cards:
    - Add `group-hover` effects for scale and shadow.
    - Use HSL-customized border colors (e.g., `primary/20`).
    - Integrate subtle background patterns or gradients behind icons.
    - Improve the typography of the "Upload Document" dropzone.

#### Document History Upgrade
- Improve the list layout:
    - Use more vibrant status badges (e.g., pulsing yellow for pending).
    - Refine the extracted data preview grid with better alignment and contrast.
    - Add "Quick View" or "Download" buttons with better visual hierarchy.

#### Animations
- Use `framer-motion` for:
    - Staggered entry of cards.
    - Smooth tab switching transitions.
    - Hover states for all interactive elements.

## Verification Plan

### Automated Tests
- No new automated tests, will rely on visual verification in the browser.

### Manual Verification
- Verify the layout remains responsive on mobile and desktop.
- Check that all upload triggers work as expected.
- Validate that the document history list renders correctly with extracted data previews.
- Ensure animations are smooth and don't affect performance.
