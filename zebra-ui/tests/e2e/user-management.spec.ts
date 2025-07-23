import { test, expect } from "@playwright/test";

/** Uses the JWT produced by global‑setup.ts (already signed‑in). */
test.use({ storageState: "tests/fixtures/admin-storage.json" });

test.describe.parallel("User Management – list view", () => {
  test("renders paginated list & seed user", async ({ page }) => {
    /* 1 ▸ open the management page */
    await page.goto("/admin/user-management", {
      waitUntil: "domcontentloaded",
    });

    /* 2 ▸ wait for GET /admin/users?… */
    const userListApiResponse = await page.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        response.url().includes("/admin/users") &&
        response.ok(),
    );
    const { content } = await userListApiResponse.json();
    expect(content.length).toBeGreaterThan(0);

    /* 3 ▸ table rows == API rows */
    const tableRows = page.locator("table tbody tr");
    await expect(tableRows).toHaveCount(content.length);

    /* 4 ▸ “Test User” row always present */
    await expect(tableRows.filter({ hasText: "Test User" })).toBeVisible();

    /* 5 ▸ only one DB page → Next disabled */
    await expect(page.getByTestId("pagination-next")).toBeDisabled();
  });
});
