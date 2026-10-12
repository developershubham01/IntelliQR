import { authRouter } from "./auth-router.js";
import { qrRouter } from "./qr-router.js";
import { contactRouter } from "./contact-router.js";
import { billingRouter } from "./billing-router.js";
import { landingRouter } from "./landing-router.js";
import { ticketRouter } from "./ticket-router.js";
import { bulkRouter } from "./bulk-router.js";
import { folderRouter } from "./folder-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  qr: qrRouter,
  contact: contactRouter,
  billing: billingRouter,
  landing: landingRouter,
  ticket: ticketRouter,
  bulk: bulkRouter,
  folder: folderRouter,
});

export type AppRouter = typeof appRouter;
