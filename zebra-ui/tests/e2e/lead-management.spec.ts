import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/fixtures/admin-storage.json" });

const tables = [
  { path: "property", category: "PROPERTY_LISTING", seedName: "Test User" },
  { path: "support", category: "SEARCH_SUPPORT", seedName: "Test User" },
];

for (const { path, category, seedName } of tables) {
  test.describe.parallel(`${path} leads - table view`, () => {
    test(`renders rows for ${category}`, async ({ page }) => {
      /* 1. open table‑view explicitly */
      await page.goto(`/admin/lead-management/${path}/table-view`, {
        waitUntil: "domcontentloaded",
      });

      /* 2. wait for GET /leads?leadCategory=... */
      const leadListApiResponse = await page.waitForResponse(
        (res) =>
          res.url().includes("/leads") &&
          res.url().includes(`leadCategory=${category}`) &&
          res.ok(),
      );
      const { content } = await leadListApiResponse.json();
      expect(content.length).toBeGreaterThan(0);

      /* 3. rows == API length */
      const rows = page.locator("table tbody tr");
      await expect(rows).toHaveCount(content.length);

      /* 4. seed user visible */
      await expect(rows.filter({ hasText: seedName })).toBeVisible();

      /* 5. pagination “Next” disabled (single page) */
      await expect(page.getByTestId("pagination-next")).toBeDisabled();
    });
  });
}
