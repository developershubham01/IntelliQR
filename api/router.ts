import { authRouter } from "./auth-router.js";
import { qrRouter } from "./qr-router.js";
import { contactRouter } from "./contact-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  qr: qrRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
