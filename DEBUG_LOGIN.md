# Debugging Login Issue

## Steps to Debug

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in with ANY credentials
4. Look for these console messages:

```
API Request: POST /auth/login
API Response: 200 /auth/login  (or error)
Login error: [error details]
```

## What to Check

### If you see "API Request" but NO "API Response":
- The request is not reaching the backend
- Check Network tab for the request status
- Look for CORS errors

### If you see "API Response: 400" or "API Response: 401":
- Backend is rejecting the login
- Should show error toast
- Should NOT navigate to /applicant

### If you DON'T see any console logs:
- The form submission might not be calling the API
- Check if there's a different submit handler

## Expected Behavior

**Wrong credentials:**
- Console: `API Request: POST /auth/login`
- Console: `API Error: 400 {message: "Invalid credentials"}`
- Console: `Login error: [error object]`
- Toast: "Login Failed"
- Stay on login page

**Correct credentials:**
- Console: `API Request: POST /auth/login`
- Console: `API Response: 200 /auth/login`
- Toast: "Welcome back!"
- Navigate to /applicant
- localStorage has `token` and `user`

## Please Share

Copy and paste the EXACT console output when you try to login.
