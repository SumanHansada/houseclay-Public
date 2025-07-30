import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";

test.describe.parallel("User Management - list view", () => {
  test.beforeEach(async ({ context }) => {
    await login(context);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("renders paginated list & seed user", async ({ page }) => {
    await page.goto("/admin/user-management", {
      waitUntil: "domcontentloaded",
    });

    const userListApiResponse = await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/admin/users") &&
        res.ok(),
    );
    const { content } = await userListApiResponse.json();
    expect(content.length).toBeGreaterThan(0);

    const tableRows = page.locator("table tbody tr");
    await expect(tableRows).toHaveCount(content.length);
    await expect(tableRows.filter({ hasText: "Test User" })).toBeVisible();
    await expect(page.getByTestId("pagination-next")).toBeDisabled();
  });
});
