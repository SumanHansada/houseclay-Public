import { request, BrowserContext, Page } from "@playwright/test";

const apiBase = process.env.E2E_API_URL!;
const baseURL = process.env.E2E_BASE_URL!;

/** Auth via backend and set adminToken cookie */
export async function login(context: BrowserContext): Promise<void> {
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
}

/** Logs out via UI click and waits for redirect */
export async function logout(page: Page): Promise<void> {
  const menuButton = page.getByTestId("profile-menu-button");
  if ((await menuButton.count()) === 0) return;
  await menuButton.click();
  await Promise.all([
    page.waitForURL("**/login"),
    page.getByRole("menuitem", { name: "Logout" }).click({ force: true }),
  ]);
}
