import { test, expect } from "@playwright/test";
import { logout } from "./helpers/auth";

/** Start signed‑out: no storageState */
test.use({ storageState: undefined });

test.describe.configure({ mode: "serial" });

test("@auth login + logout (cookie flow)", async ({ page, context }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  await page.getByLabel("Username").fill(process.env.E2E_USER!);
  await page.getByLabel("Password").fill(process.env.E2E_PASS!);

  const [loginRes] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/admin/login") && res.request().method() === "POST",
    ),
    page.getByLabel(/sign[- ]in/i).click({ force: true }),
  ]);
  expect(loginRes.ok()).toBeTruthy();

  await page.waitForURL("**/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/dashboard$/);

  const hasJwt = (await context.cookies()).some(
    (cookie) => cookie.name === "adminToken",
  );
  expect(hasJwt).toBeTruthy();

  await logout(page);

  const jwtAfter = (await context.cookies()).some(
    (cookie) => cookie.name === "adminToken",
  );
  expect(jwtAfter).toBeFalsy();
});
