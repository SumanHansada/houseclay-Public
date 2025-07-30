import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";

const SEED_PHONE_NUMBER = "9999999999";

test.describe.parallel("User details flow", () => {
  test.beforeEach(async ({ context }) => {
    await login(context);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("navigate via action button, render profile + tabs", async ({
    page,
  }) => {
    /* open list & wait for GET /admin/users */
    await page.goto("/admin/user-management", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForResponse(
      (res) =>
        res.request().method() === "GET" &&
        res.url().includes("/admin/users") &&
        res.ok(),
    );

    /* click “View profile” & wait for GET /admin/search-user */
    const [userDetailsApi] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/admin/search-user") &&
          res.url().includes(`phoneNo=${SEED_PHONE_NUMBER}`) &&
          res.ok(),
      ),
      page
        .getByTestId(`view-profile-${SEED_PHONE_NUMBER}`)
        .click({ force: true }),
    ]);
    expect(userDetailsApi.ok()).toBeTruthy();

    /* correct URL */
    await page.waitForURL(`**/admin/user-details/${SEED_PHONE_NUMBER}*`);

    /* wait until the profile tab really rendered */
    await page.getByTestId("user-profile-page").waitFor({ state: "visible" });

    /* profile inputs pre‑filled */
    await expect(page.locator('input[value="Test User"]')).toBeVisible();
    await expect(
      page.locator(`input[value="${SEED_PHONE_NUMBER}"]`),
    ).toBeVisible();
    await expect(page.locator('input[value="user@example.com"]')).toBeVisible();

    /* button states */
    await expect(page.getByTestId("activate-user-btn")).toBeDisabled();
    await expect(page.getByTestId("blacklist-user-btn")).toBeEnabled();

    /* all tabs rendered (buttons) */
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

    /* switch to “Owned Properties” and assert > 0 rows */
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
