import { authRouter } from "./auth-router";
import { qrRouter } from "./qr-router";
import { contactRouter } from "./contact-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  qr: qrRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
