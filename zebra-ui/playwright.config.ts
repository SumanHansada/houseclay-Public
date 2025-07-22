import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.e2e", quiet: true });

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 5_000 },
  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: process.env.E2E_BASE_URL,
    storageState: "tests/fixtures/admin-storage.json",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],

  webServer: {
    command: "npm run dev:zebra",
    url: process.env.E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  globalSetup: require.resolve("./global-setup.ts"),
});
