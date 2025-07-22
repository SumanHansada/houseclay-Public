import { request, FullConfig } from "@playwright/test";
import fs from "fs/promises";

export default async function globalSetup(_: FullConfig) {
  /* Fetch a real JWT via the backend */
  const apiBase = process.env.E2E_API_URL!;
  const apiCtx = await request.newContext({ baseURL: apiBase });
  const user = process.env.E2E_USER!;
  const pass = process.env.E2E_PASS!;

  const res = await apiCtx.post("admin/login", {
    data: { username: user, password: pass },
  });
  if (res.status() !== 200) throw new Error(await res.text());

  const jwt = (await res.text()).replace(/"/g, "");

  /* Craft a storageState file that contains ONLY the cookie */
  const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

  const storageState = {
    cookies: [
      {
        name: "adminToken",
        value: jwt,
        domain: new URL(baseURL).hostname,
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      },
    ],
    origins: [],
  };

  await fs.mkdir("tests/fixtures", { recursive: true });
  await fs.writeFile(
    "tests/fixtures/admin-storage.json",
    JSON.stringify(storageState, null, 2),
  );

  await apiCtx.dispose();
}
