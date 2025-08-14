# End-to-End Test Guidelines for Houseclay Admin Portal

## 📌 Environment & Setup

- **Environment File**: `.env.e2e` (loaded via `dotenv.config()` in `playwright.config.ts`)
- **Test Directory**: `tests/e2e`
- **Test Runner**: [Playwright](https://playwright.dev)
- **Browser Support**: Currently **only Chromium** is configured
- **Global Setup**: Explicitly disabled for test suites (`storageState: undefined`)
- **Web Server**: Launched via `npm run dev:zebra`

---

## ✅ Test Strategy

- Every test file is **self-contained**: it starts from the login page and authenticates via API
- **`login()` and `logout()` helpers** are mandatory in all suites for clean sessions
- All login state is injected as cookie using `context.addCookies()`
- Traces and videos are retained on failure only

---

## 🎯 Test Coverage Focus

| Area             | Notes                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Auth Flow        | Tested via both UI interaction (`pressSequentially`) and cookie logic |
| Navigation       | Verified via sidebar + URL + response assertions                      |
| List Rendering   | Validated against response length and expected row content            |
| Pagination State | Checked for disabled/enabled state via `data-testid`                  |

---

## 🧪 Test ID Naming Conventions

All `data-testid` attributes should follow a **flat, semantic, kebab-case** naming convention.

### 🌟 Input Fields

- Prefer: `login-username-input`, `login-password-input`
- Avoid: `username`, `formInput1`, etc.

### 🌟 Buttons

- Prefer: `login-submit-button`, `pagination-next-button`, `logout-menuitem`
- Use a `-button` or `-menuitem` suffix as appropriate

### 🌟 Pages

- Prefer: `page-dashboard`, `page-user-management`, etc.
- Assert existence via `page.getByTestId("page-dashboard")`

### 🌟 General Rule

```
[scope]-[element]-[type]
```

- **scope**: area or page (e.g., `login`, `dashboard`, `pagination`)
- **element**: purpose (e.g., `username`, `next`, `menu`)
- **type**: suffix like `input`, `button`, `tab`, `row`, `label`, etc.

---

## 🧼 Best Practices

- Do **not** use `getByLabel` or `getByRole` unless the component is inaccessible to test ID
- Use `test.info().annotations.push()` for sensitive flows (e.g., login)
- Avoid relying on `.nth()` or visual selectors
- Always wait for URL and response explicitly after major navigation

---

## 🛠️ Utilities Summary

| Helper                 | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `login()`              | Authenticate via API and inject cookies |
| `logout()`             | Trigger UI logout and verify redirect   |
| `navigateViaSidebar()` | Click via sidebar & wait for route      |

---

## 🧪 Roadmap

- [ ] Add Firefox + WebKit cross-browser support
- [ ] Integrate Playwright report in CI/CD
- [ ] Add form validation and error state tests
- [ ] Expand table testing: sort, filter, actions
