import { request } from "@playwright/test";

export default async () => {
  // call remote tear‑down end‑point only when you own the DB
  // await request.newContext().then(ctx => ctx.post("/__seed/teardown"));
};
