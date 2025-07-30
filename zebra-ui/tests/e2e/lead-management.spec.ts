import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";

const tables = [
  { path: "property", category: "PROPERTY_LISTING", seedName: "Test User" },
  { path: "support", category: "SEARCH_SUPPORT", seedName: "Test User" },
];

for (const { path, category, seedName } of tables) {
  test.describe.parallel(`${path} leads - table view`, () => {
    test.beforeEach(async ({ context }) => {
      await login(context);
    });

    test.afterEach(async ({ page }) => {
      await logout(page);
    });

    test(`renders rows for ${category}`, async ({ page }) => {
      /* open table‑view explicitly */
      await page.goto(`/admin/lead-management/${path}/table-view`, {
        waitUntil: "domcontentloaded",
      });

      /* wait for GET /leads?leadCategory=... */
      const leadListApiResponse = await page.waitForResponse(
        (res) =>
          res.url().includes("/leads") &&
          res.url().includes(`leadCategory=${category}`) &&
          res.ok(),
      );
      const { content } = await leadListApiResponse.json();
      expect(content.length).toBeGreaterThan(0);

      /* rows == API length */
      const rows = page.locator("table tbody tr");
      await expect(rows).toHaveCount(content.length);

      /* seed user visible */
      await expect(rows.filter({ hasText: seedName })).toBeVisible();

      /* pagination “Next” disabled (single page) */
      await expect(page.getByTestId("pagination-next")).toBeDisabled();
    });
  });
}
