import { expect, Page } from "@playwright/test";

import { sidebarItems } from "@/common/constants/navigation";
import { toSlug } from "@/utils/core";

interface NavigateSidebarArgs {
  page: Page;
  sectionLabel: string;
  linkLabel: string;
}

/**
 * Navigates via sidebar using UI-visible section/link names.
 */
export async function navigateViaSidebar({
  page,
  sectionLabel,
  linkLabel,
}: NavigateSidebarArgs): Promise<void> {
  const sectionTestId = `sidebar-section-${toSlug(sectionLabel)}`;
  const linkTestId = `sidebar-link-${toSlug(linkLabel)}`;

  const sectionItem = sidebarItems.find((item) => item.label === sectionLabel);
  if (!sectionItem) {
    throw new Error(`Sidebar section not found: "${sectionLabel}"`);
  }

  const linkItem = sectionItem.children.find(
    (child) => child.label === linkLabel,
  );
  if (!linkItem) {
    throw new Error(
      `Sidebar link not found: "${sectionLabel}" → "${linkLabel}"`,
    );
  }

  const expectedPath = linkItem.href;

  await page.getByTestId(sectionTestId).click();

  const linkElement = page.getByTestId(linkTestId);
  await expect(linkElement).toBeVisible();

  await Promise.all([
    page.waitForURL((url) => url.pathname === expectedPath),
    linkElement.click(),
  ]);
}
