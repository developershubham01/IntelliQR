import * as cookie from "cookie";
import { z } from "zod";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { upsertUser, findUserByUnionId } from "./queries/users";
import { signSessionToken } from "./kimi/session";
import { env } from "./lib/env";

export const authRouter = createRouter({
  me: publicQuery.query((opts) => opts.ctx.user ?? null),
  
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();
      const unionId = `email_${email}`;
      
      let user = await findUserByUnionId(unionId);
      
      // If user doesn't exist, we auto-create them for this demo (or throw error, but auto-create is friendlier)
      if (!user) {
        const name = email.split("@")[0];
        await upsertUser({
          unionId,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
          lastSignInAt: new Date(),
        });
        user = await findUserByUnionId(unionId);
      }

      if (!user) {
        throw new Error("Failed to retrieve or create user.");
      }

      const token = await signSessionToken({
        unionId: user.unionId,
        clientId: env.appId,
      });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none" | "strict",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        })
      );

      return { success: true, user };
    }),

  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();
      const unionId = `email_${email}`;

      let existingUser = await findUserByUnionId(unionId);
      if (existingUser) {
        throw new Error("A user with this email already exists.");
      }

      await upsertUser({
        unionId,
        name: input.name,
        email,
        lastSignInAt: new Date(),
      });

      const user = await findUserByUnionId(unionId);
      if (!user) {
        throw new Error("Failed to create user.");
      }

      const token = await signSessionToken({
        unionId: user.unionId,
        clientId: env.appId,
      });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none" | "strict",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        })
      );

      return { success: true, user };
    }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none" | "strict",
        secure: opts.secure,
        maxAge: 0,
      })
    );
    return { success: true };
  }),
});
