import https from "https";
import fs from "fs";
import next from "next";

const dev = true;
const hostname = "localhost.houseclay.com";
const port = 3000;

const app = next({ dev, hostname, port });
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
