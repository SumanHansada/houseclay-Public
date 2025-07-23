import { test as base, expect } from "@playwright/test";

/** This spec exercises the full UI login + logout flow. */
const test = base.extend({});

/* Run this file serially so it never overlaps with other specs. */
test.describe.configure({ mode: "serial" });

/* Start signed‑out: ignore the global storageState fixture. */
test.use({ storageState: undefined });

test("@auth login + logout (cookie flow)", async ({ page, context }) => {
  /* 1 ▸ open login screen */
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  /* 2 ▸ type credentials */
  await page.getByLabel("Username").fill(process.env.E2E_USER!);
  await page.getByLabel("Password").fill(process.env.E2E_PASS!);

  /* 3 ▸ click “Sign in” while WAITING for the POST /admin/login */
  const [loginApiResponse] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/admin/login") &&
        response.request().method() === "POST",
      { timeout: 60_000 },
    ),
    page.getByLabel(/sign[- ]in/i).click({ force: true }),
  ]);
  expect(loginApiResponse.ok()).toBeTruthy();

  /* 4 ▸ redirected to dashboard */
  await page.waitForURL("**/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/dashboard$/);

  /* 5 ▸ cookie created */
  const hasJwt = (await context.cookies()).some(
    (cookie) => cookie.name === "adminToken",
  );
  expect(hasJwt).toBeTruthy();

  /* 6 ▸ logout via profile menu */
  await page.getByLabel("profile menu").click();
  await Promise.all([
    page.waitForURL("**/login"),
    page.getByRole("menuitem", { name: "Logout" }).click({ force: true }),
  ]);

  /* 7 ▸ cookie removed */
  const hasJwtAfterLogout = (await context.cookies()).some(
    (cookie) => cookie.name === "adminToken",
  );
  expect(hasJwtAfterLogout).toBeFalsy();
});
