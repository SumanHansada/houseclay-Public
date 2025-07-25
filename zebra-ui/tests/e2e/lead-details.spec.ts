import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/fixtures/admin-storage.json" });

const fixtures = [
  {
    typePath: "property",
    category: "PROPERTY_LISTING",
    seedId: 1,
    statusLabel: "New Lead",
    apiStatus: "NEW",
  },
  {
    typePath: "support",
    category: "SEARCH_SUPPORT",
    seedId: 2,
    statusLabel: "Follow Up",
    apiStatus: "FOLLOW_UP",
  },
];

for (const lead of fixtures) {
  test.describe.parallel(`${lead.typePath} leads – full flow`, () => {
    test(`View-Lead button navigates and page loads`, async ({ page }) => {
      /* 1 ▸ open table view */
      await page.goto(`/admin/lead-management/${lead.typePath}/table-view`, {
        waitUntil: "domcontentloaded",
      });

      /* 2 ▸ wait for /leads?leadCategory=… */
      await page.waitForResponse(
        (res) =>
          res.url().includes("/leads") &&
          res.url().includes(`leadCategory=${lead.category}`) &&
          res.ok(),
      );

      /* 3 ▸ click “View Lead” for the seeded row */
      await Promise.all([
        page.waitForURL(
          `**/admin/lead-management/${lead.typePath}/${lead.seedId}`,
        ),
        page.getByTestId(`view-lead-${lead.seedId}`).click(),
      ]);

      /* 4 ▸ wait for /leads/{id} and heading */
      await page.waitForResponse(
        (res) => res.url().endsWith(`/leads/${lead.seedId}`) && res.ok(),
      );
      await expect(
        page.getByRole("heading", { name: "Lead Information", exact: true }),
      ).toBeVisible();

      /* 5 ▸ status pill visible */
      await expect(
        page.getByTestId(`status-pill-${lead.apiStatus}`),
      ).toBeVisible();
    });
  });
}
