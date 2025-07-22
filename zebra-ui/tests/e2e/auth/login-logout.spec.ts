import { test as base, expect } from "@playwright/test";

/* Start signed‑out just for this file */
const test = base.extend({});
test.use({ storageState: undefined });

test("@auth login + logout (cookie flow)", async ({ page, context }) => {
  /* ▸ open login page */
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  /* ▸ fill credentials */
  await page.getByLabel("Username").fill(process.env.E2E_USER!);
  await page.getByLabel("Password").fill(process.env.E2E_PASS!);

  /* ▸ click button & wait for BOTH: backend 200 + redirect */
  const loginRequest = page.waitForResponse(
    (res) =>
      res.request().method() === "POST" &&
      res.url().includes("/admin/login") &&
      res.status() === 200,
  );

  await page.getByLabel("sign-in").click({ force: true });
  await loginRequest;
  await page.waitForURL("**/admin/dashboard", { timeout: 60_000 });

  /* URL check */
  await expect(page).toHaveURL(/\/admin\/dashboard$/);

  /* cookie should exist */
  expect(
    (await context.cookies()).some((c) => c.name === "adminToken"),
  ).toBeTruthy();

  /* ▸ logout via profile menu */
  await page.getByLabel("profile menu").click();
  await Promise.all([
    page.waitForURL("**/login"),
    page.getByRole("menuitem", { name: "Logout" }).click({ force: true }),
  ]);

  /* cookie should be removed */
  expect(
    (await context.cookies()).some((c) => c.name === "adminToken"),
  ).toBeFalsy();
});
