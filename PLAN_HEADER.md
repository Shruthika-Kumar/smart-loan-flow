# Implementation Plan - Header Functionality

Implement interactive content for the Help, Notifications, and Profile buttons in the navigation header.

## Proposed Changes

### [ApplicantLayout.tsx](file:///c:/FINAL%20SEM%20PROJECT/smart-loan-flow/src/components/layout/ApplicantLayout.tsx)

#### 1. Help Button
- Convert the static Help button into a `DropdownMenu`.
- Add items:
    - **View FAQ**: Link to FAQ page (if exists) or simple toast/modal.
    - **Quick Tour**: Re-trigger onboarding (simulation).
    - **Live Chat**: Simulation of support.

#### 2. Notifications Button
- Convert the static Notifications button into a `DropdownMenu`.
- Display a list of "Recent Notifications":
    - *Loan Update*: "Your Home Loan application is under review."
    - *Document Verification*: "PAN Card verified successfully."
    - *New Message*: "Officer Sarah assigned to your application."
- Add a "Clear All" action.
- Dynamic red dot/badge based on unread count.

#### 3. User Profile
- Enhance the current dropdown.
- Ensure "My Profile" leads to a profile settings page.
- Add "Account Settings" item.
- Ensure "Sign Out" works reliably with existing logout logic.

## Verification
- Click each button and ensure the dropdown appears with the correct items.
- Verify active states and hover effects.
- Test mobile view compatibility (mobile menu).
