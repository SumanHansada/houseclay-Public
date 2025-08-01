import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";
import { navigateViaSidebar } from "./helpers/navigation";

test.describe.parallel("User Management - list view", () => {
  test.beforeEach(async ({ context, page }) => {
    await login(context, page);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("navigates via sidebar and loads user list", async ({ page }) => {
    await navigateViaSidebar({
      page,
      sectionLabel: "User Management",
      linkLabel: "HouseClay Users",
    });

    await expect(page).toHaveURL(/\/admin\/user-management$/);

    const res = await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/admin/users") &&
        res.ok(),
    );
    const { content } = await res.json();

    const tableRows = page.locator("table tbody tr");
    await expect(tableRows).toHaveCount(content.length);
    await expect(tableRows.filter({ hasText: "Test User" })).toBeVisible();
    await expect(page.getByTestId("pagination-next")).toBeDisabled();
  });
});
