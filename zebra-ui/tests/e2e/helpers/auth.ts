import { BrowserContext, expect, Page, request } from "@playwright/test";

const apiBase = process.env.E2E_API_URL!;
const baseURL = process.env.E2E_BASE_URL!;

/**
 * Auth via backend and assert dashboard view
 */
export async function login(
  context: BrowserContext,
  page: Page,
): Promise<void> {
  const req = await request.newContext({ baseURL: apiBase });
  const res = await req.post("admin/login", {
    data: {
      username: process.env.E2E_USER!,
      password: process.env.E2E_PASS!,
    },
  });
  if (!res.ok()) throw new Error(`Login failed: ${res.status()}`);
  const jwt = (await res.text()).replace(/"/g, "");

  await context.addCookies([
    {
      name: "adminToken",
      value: jwt,
      domain: new URL(baseURL).hostname,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await req.dispose();

  // Visit dashboard to verify login success
  await page.goto("/admin/dashboard", { waitUntil: "domcontentloaded" });
  await page.waitForURL(/\/admin\/dashboard$/);
  await expect(page.getByTestId("page-dashboard")).toBeVisible();
}

/** Logs out via UI click and waits for redirect */
export async function logout(page: Page): Promise<void> {
  const trigger = page.getByTestId("profile-menu-button");

  await expect(trigger, "Profile menu button should be visible").toBeVisible();
  await trigger.click();

  const logoutItem = page.getByTestId("menuitem-logout");
  await expect(logoutItem, "Logout menu item should be visible").toBeVisible();
  const maybeLogoutApi = page
    .waitForResponse((res) => {
      const url = res.url();
      const method = res.request().method();
      return (
        url.includes("/admin/logout") && (method === "POST" || method === "GET")
      );
    })
    .catch(() => null);

  await Promise.all([
    page.waitForURL(/\/login(?:$|\?)/, { timeout: 30_000 }),
    maybeLogoutApi,
    logoutItem.click(),
  ]);
  await expect(page.getByTestId("page-login")).toBeVisible();
}
