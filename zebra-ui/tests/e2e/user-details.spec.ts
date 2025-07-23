import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/fixtures/admin-storage.json" });

const SEED_PHONE_NUMBER = "9999999999";

test.describe.parallel("User details flow", () => {
  test("navigate via action button, render profile + tabs", async ({
    page,
  }) => {
    /* ▸ open list & wait for GET /admin/users */
    await page.goto("/admin/user-management", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        response.url().includes("/admin/users") &&
        response.ok(),
    );

    /* ▸ click “View profile” & wait for GET /admin/search-user */
    const [userDetailsApi] = await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/admin/search-user") &&
          response.url().includes(`phoneNo=${SEED_PHONE_NUMBER}`) &&
          response.ok(),
      ),
      page
        .getByTestId(`view-profile-${SEED_PHONE_NUMBER}`)
        .click({ force: true }),
    ]);
    expect(userDetailsApi.ok()).toBeTruthy();

    /* ▸ correct URL */
    await page.waitForURL(`**/admin/user-details/${SEED_PHONE_NUMBER}*`);

    /* profile inputs pre‑filled */
    await expect(page.locator('input[value="Test User"]')).toBeVisible();
    await expect(
      page.locator(`input[value="${SEED_PHONE_NUMBER}"]`),
    ).toBeVisible();
    await expect(page.locator('input[value="user@example.com"]')).toBeVisible();

    /* button states */
    await expect(page.getByTestId("activate-user-btn")).toBeDisabled();
    await expect(page.getByTestId("blacklist-user-btn")).toBeEnabled();

    /* ▸ all tabs rendered (buttons) */
    const tabNames = [
      "Profile",
      "Owned Properties",
      "Shortlisted",
      "Connect History",
      "Payment History",
      "Contacted",
      "Viewed",
      "Reported",
    ];
    for (const name of tabNames) {
      await expect(
        page.getByRole("button", { name, exact: true }),
      ).toBeVisible();
    }

    /* ▸ switch to “Owned Properties” and assert > 0 rows */
    await Promise.all([
      page.waitForURL(
        `**/admin/user-details/${SEED_PHONE_NUMBER}/owned-properties`,
      ),
      page
        .getByRole("button", { name: "Owned Properties", exact: true })
        .click(),
    ]);

    /* assert at least one row rendered */
    const ownedRows = page.locator("table tbody tr");
    await expect(ownedRows.first()).toBeVisible();
  });
});
