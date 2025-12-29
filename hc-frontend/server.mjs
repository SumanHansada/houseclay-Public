import https from "https";
import fs from "fs";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost.houseclay.com";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port, turbo: dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./certificates/localhost.houseclay.com-key.pem"),
  cert: fs.readFileSync("./certificates/localhost.houseclay.com.pem"),
};

await app.prepare();

https
  .createServer(httpsOptions, (req, res) => {
    handle(req, res);
  })
  .listen(port, hostname, () => {
    console.log(`🔒 HTTPS ready → https://${hostname}:${port}`);
  });
