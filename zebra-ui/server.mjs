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
 * - FALLBACK: If the target port is in use, it increments until it finds a free one.
 * ------------------------------------------------------------------------
 */

import https from "https";
import http from "http";
import fs from "fs";
import next from "next";
import net from "net"; // Imported for port checking

const dev = process.env.NODE_ENV !== "production";
const useHttps = process.env.USE_HTTPS === "true";
const initialPort = parseInt(process.env.PORT || "3000", 10);

// If HTTPS is on, we assume we need the custom domain for cookies.
// If HTTPS is off (standard dev), we stick to simple 'localhost'.
const hostname =
  process.env.HOSTNAME || (useHttps ? "localhost.houseclay.com" : "localhost");

/**
 * Recursively checks for an available port starting from `startPort`.
 */
async function getAvailablePort(startPort, host) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(
          `⚠️  Port ${startPort} is busy, trying ${startPort + 1}...`,
        );
        resolve(getAvailablePort(startPort + 1, host)); // Try the next port
      } else {
        reject(err);
      }
    });

    server.listen(startPort, host, () => {
      const freePort = server.address().port;
      server.close(() => resolve(freePort)); // Port is free, close the test server
    });
  });
}

// 1. Find a free port FIRST
const port = await getAvailablePort(initialPort, hostname);

// 2. Initialize Next.js app with the confirmed free port
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
      logInfo(port);
      console.log(`🔒 HTTPS ready → https://${hostname}:${port}`);
    });
} else {
  // --- HTTP MODE (Target: Local Docker Backend) ---
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, hostname, () => {
      logInfo(port);
      console.log(`🔓 HTTP ready → http://${hostname}:${port}`);
    });
}

function logInfo(activePort) {
  console.log(
    `Running in ${process.env.NODE_ENV} mode on port ${activePort} with API: ${process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL}`,
  );
}
