import { test, expect } from "@playwright/test";
import { login, logout } from "./helpers/auth";
import { createTestIdFactory, userDetailsTestIds } from "@/utils/testIds";
import { UserDetailsTabEnum } from "@/common/enums";

const SEED_PHONE_NUMBER = "9999999999";

// This is correct, as it's for a different feature.
const userManagementIds = createTestIdFactory("User Management");

test.describe.parallel("User details flow", () => {
  test.beforeEach(async ({ context, page }) => {
    await login(context, page);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("navigates from list, renders profile, and switches tabs", async ({
    page,
  }) => {
    // Navigate to user list and wait for it to load
    await page.goto("/admin/user-management");
    await page.waitForResponse((res) => res.url().includes("/admin/users"));

    // Click “View profile” and wait for user details API call
    await Promise.all([
      page.waitForResponse((res) => res.url().includes("/admin/search-user")),
      page
        .getByTestId(
          userManagementIds.genericId("view profile", SEED_PHONE_NUMBER),
        )
        .click(),
    ]);

    // Assert URL and that the profile tab content is visible
    await page.waitForURL(`**/admin/user-details/${SEED_PHONE_NUMBER}*`);
    await expect(
      page.getByTestId(
        userDetailsTestIds.getTabPageId(UserDetailsTabEnum.PROFILE),
      ),
    ).toBeVisible();

    // Assert profile data and button states
    await expect(page.locator('input[value="Test User"]')).toBeVisible();
    await expect(
      page.getByTestId(userDetailsTestIds.buttonId("Activate User")),
    ).toBeDisabled();
    await expect(
      page.getByTestId(userDetailsTestIds.buttonId("Blacklist User")),
    ).toBeEnabled();

    // Assert all tab buttons are rendered
    for (const tab of userDetailsTestIds.allTabs) {
      await expect(page.getByTestId(tab.buttonTestId)).toBeVisible();
    }

    // Switch to “Owned Properties” tab
    const ownedPropertiesTabButton = page.getByTestId(
      userDetailsTestIds.getTabButtonId(UserDetailsTabEnum.OWNED),
    );

    // Assert tab content becomes visible after click
    await Promise.all([
      page.waitForURL(`**/${UserDetailsTabEnum.OWNED}`),
      expect(
        page.getByTestId(
          userDetailsTestIds.getTabPageId(UserDetailsTabEnum.OWNED),
        ),
      ).toBeVisible(),
      ownedPropertiesTabButton.click(),
    ]);

    // Assert table has rendered
    const ownedRows = page.locator("table tbody tr");
    await expect(ownedRows.first()).toBeVisible();
  });
});
