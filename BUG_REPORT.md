# Bug Report — firechat-qa

This document tracks bugs discovered during manual and automated testing of the firechat-qa application.

---

## Bug Summary

| ID | Title | Severity | Status |
|---|---|---|---|
| BUG-001 | No error message shown on invalid login | High | Open |
| BUG-002 | No error message shown on invalid signup | High | Open |
| BUG-003 | Weak password accepted during signup | Medium | Open |
| BUG-004 | Last seen shows "online" after tab is closed | Medium | Open |
| BUG-005 | Username displays as first 4 characters of email only | Low | Open |
| BUG-006 | No loading state shown during login/signup | Low | Open |
| BUG-007 | Page title was "WhatsApp" instead of app name | Low | Fixed |
| BUG-008 | Direct URL navigation to /login returned 404 on Netlify | High | Fixed |

---

## Detailed Reports

---

### BUG-001 — No error message shown on invalid login

**Date found:** 2026-05-26
**Found by:** Manual testing + Playwright E2E test
**Component:** `Login.js`

**Steps to reproduce:**
1. Navigate to `https://firechat-qa.netlify.app/login`
2. Enter a valid email with an incorrect password
3. Click Sign In

**Expected result:** An error message is displayed (e.g. "Invalid password. Please try again.")

**Actual result:** Nothing happens. The form stays visible with no feedback to the user. The error is caught silently in the `.catch()` block but not rendered.

**Severity:** High — users have no way of knowing why login failed

**Root cause:** `errorMessage` is stored in a variable inside `.catch()` but never set to state or rendered in JSX.

**Suggested fix:**
```js
const [error, setError] = useState("");

.catch((error) => {
  setError("Invalid email or password. Please try again.");
});

// In JSX:
{error && <p className="error-msg">{error}</p>}
```

---

### BUG-002 — No error message shown on invalid signup

**Date found:** 2026-05-26
**Found by:** Manual testing
**Component:** `Register.js`

**Steps to reproduce:**
1. Navigate to `https://firechat-qa.netlify.app`
2. Enter an already-registered email address
3. Enter any password and click Sign Up

**Expected result:** An error message is displayed (e.g. "Email already in use.")

**Actual result:** Nothing happens. No feedback is shown to the user.

**Severity:** High — users may attempt signup multiple times thinking it failed silently

**Root cause:** Same as BUG-001 — error caught but not displayed.

---

### BUG-003 — Weak password accepted during signup

**Date found:** 2026-05-26
**Found by:** Manual testing
**Component:** `Register.js`

**Steps to reproduce:**
1. Navigate to `https://firechat-qa.netlify.app`
2. Enter a valid email
3. Enter a 1-character password (e.g. "a")
4. Click Sign Up

**Expected result:** Validation error — password too short

**Actual result:** Firebase returns an error (minimum 6 characters) but it is not shown to the user due to BUG-002. No client-side validation exists either.

**Severity:** Medium — security concern and poor UX

**Suggested fix:** Add client-side validation before calling Firebase:
```js
if (password.length < 6) {
  setError("Password must be at least 6 characters.");
  return;
}
```

---

### BUG-004 — Last seen shows "online" after tab is closed

**Date found:** 2026-05-26
**Found by:** Manual testing
**Component:** Firestore presence logic

**Steps to reproduce:**
1. Log in as User A
2. Log in as User B in another browser
3. User A observes User B's status as "online"
4. User B closes the browser tab without logging out
5. User A checks User B's status

**Expected result:** Status updates to "last seen [timestamp]" within a few seconds

**Actual result:** Status remains "online" indefinitely until the Firestore connection times out (can take several minutes)

**Severity:** Medium — core feature behaves incorrectly on abrupt disconnection

**Suggested fix:** Use Firebase `onDisconnect()` to set offline status automatically:
```js
const userStatusRef = ref(realtimeDb, `/status/${userId}`);
onDisconnect(userStatusRef).set({ state: 'offline', last_changed: serverTimestamp() });
```

---

### BUG-005 — Username displays as first 4 characters of email only

**Date found:** 2026-05-26
**Found by:** Code review
**Component:** `Login.js`, `Register.js`

**Steps to reproduce:**
1. Sign up or log in with `farzana@gmail.com`
2. Observe the displayed username in the chat UI

**Expected result:** Username shows full name or full email prefix (e.g. "farzana")

**Actual result:** Username shows only "farz" — first 4 characters

**Severity:** Low — cosmetic but looks unpolished

**Root cause:**
```js
setuserName(email.substring(0, [4])); // [4] coerces to 4, not intentional
```

**Suggested fix:**
```js
setuserName(email.split('@')[0]); // use full prefix before @
```

---

### BUG-006 — No loading state during login/signup

**Date found:** 2026-05-26
**Found by:** Manual testing
**Component:** `Login.js`, `Register.js`

**Steps to reproduce:**
1. Click Sign In or Sign Up
2. Observe the button during the Firebase authentication call

**Expected result:** Button shows a loading spinner or is disabled while the request is in progress

**Actual result:** Button remains fully clickable and unchanged — users can click multiple times, potentially triggering duplicate auth requests

**Severity:** Low — UX issue, potential for duplicate requests

**Suggested fix:**
```js
const [loading, setLoading] = useState(false);

const signIn = async () => {
  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } finally {
    setLoading(false);
  }
};

// In JSX:
<button disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
```

---

### BUG-007 — Page title displayed "WhatsApp" instead of app name ✅ FIXED

**Date found:** 2026-05-26
**Found by:** Code review
**Component:** `public/index.html`

**Steps to reproduce:**
1. Open the app in any browser
2. Observe the browser tab title

**Expected result:** Tab shows "FireChat"

**Actual result:** Tab showed "WhatsApp" — the default Create React App title was never updated. Also a potential IP concern.

**Severity:** Low

**Fix applied:** Updated `<title>` in `public/index.html` to "FireChat"
**Commit:** `a5fb443`
**Status:** ✅ Fixed

---

### BUG-008 — Direct URL navigation to /login returned 404 on Netlify ✅ FIXED

**Date found:** 2026-05-26
**Found by:** Playwright E2E testing
**Component:** `netlify.toml`, Netlify routing config

**Steps to reproduce:**
1. Navigate directly to `https://firechat-qa.netlify.app/login` in browser

**Expected result:** Login page loads correctly

**Actual result:** Netlify returned a 404 error — React Router routes were not handled server-side

**Severity:** High — app completely broken on direct URL access or page refresh

**Root cause:** Single Page Apps require a catch-all redirect rule on Netlify. Without it, Netlify tries to find a physical file at `/login` which doesn't exist.

**Fix applied:** Added `[[redirects]]` rule to `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
**Status:** ✅ Fixed

---

## Testing Notes

- BUG-001 and BUG-002 were discovered during Playwright E2E test development — the silent failure made it impossible to assert on error state, which led to investigating the root cause
- BUG-004 is a known limitation of Firestore's connection-based presence detection; proper fix requires Firebase Realtime Database `onDisconnect()` handler
- BUG-008 was directly responsible for 3 Playwright test failures across all browsers before being fixed

