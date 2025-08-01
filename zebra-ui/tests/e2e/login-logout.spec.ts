import { test, expect } from "@playwright/test";
import { logout } from "./helpers/auth";

test.use({ storageState: undefined });
test.describe.configure({ mode: "serial" });

test("@auth login + logout (cookie flow)", async ({ page, context }) => {
  test.info().annotations.push({
    type: "sensitive",
    description: "Credentials involved",
  });

  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("page-login")).toBeVisible();

  await page
    .getByTestId("login-username-input")
    .pressSequentially(process.env.E2E_USER!);
  await page
    .getByTestId("login-password-input")
    .pressSequentially(process.env.E2E_PASS!);

  const [loginRes] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/admin/login") && res.request().method() === "POST",
    ),
    page.getByTestId("login-submit-button").click(),
  ]);
  expect(loginRes.ok()).toBeTruthy();

  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  expect(
    (await context.cookies()).some((c) => c.name === "adminToken"),
  ).toBeTruthy();

  await logout(page);

  expect(
    (await context.cookies()).some((c) => c.name === "adminToken"),
  ).toBeFalsy();
});
