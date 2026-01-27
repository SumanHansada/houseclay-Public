/**
 * ------------------------------------------------------------------------
 * CUSTOM NEXT.JS SERVER (HTTP & HTTPS SUPPORT)
 * ------------------------------------------------------------------------
 * * WHY THIS EXISTS:
 * Next.js does not natively support switching between HTTP and HTTPS easily
 * based on environment variables. We need this flexibility because:
 * * 1. LOCAL Backend (Docker) is HTTP-only.
 * - The Frontend must run in HTTP to avoid "Mixed Content" security errors.
 * * 2. HOSTED Backend (Production) is HTTPS-only.
 * - The Frontend must run in HTTPS to receive "Secure; SameSite=None" cookies.
 * * HOW IT WORKS:
 * - Checks `process.env.USE_HTTPS`.
 * - If TRUE: Loads SSL certificates and starts an HTTPS server.
 * - If FALSE: Starts a standard HTTP server.
 * ------------------------------------------------------------------------
 */

import https from "https";
import http from "http";
import fs from "fs";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const useHttps = process.env.USE_HTTPS === "true";
const port = parseInt(process.env.PORT || "3000", 10);

// If HTTPS is on, we assume we need the custom domain for cookies.
// If HTTPS is off (standard dev), we stick to simple 'localhost'.
const hostname =
  process.env.HOSTNAME || (useHttps ? "localhost.houseclay.com" : "localhost");

// Initialize Next.js app
// Note: 'turbo: dev' passes the --turbo flag capability to the custom server
const app = next({ dev, hostname, port, turbo: dev });
const handle = app.getRequestHandler();

await app.prepare();

if (useHttps) {
  // --- HTTPS MODE (Target: Hosted Backend) ---
  const httpsOptions = {
    key: fs.readFileSync("./certificates/localhost.houseclay.com-key.pem"),
    cert: fs.readFileSync("./certificates/localhost.houseclay.com.pem"),
  };

  https
    .createServer(httpsOptions, (req, res) => {
      handle(req, res);
    })
    .listen(port, hostname, () => {
      logInfo();
      console.log(`🔒 HTTPS ready → https://${hostname}:${port}`);
    });
} else {
  // --- HTTP MODE (Target: Local Docker Backend) ---
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, hostname, () => {
      logInfo();
      console.log(`🔓 HTTP ready → http://${hostname}:${port}`);
    });
}

function logInfo() {
  console.log(
    `Running in ${process.env.NODE_ENV} mode with API: ${process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL}`,
  );
}
