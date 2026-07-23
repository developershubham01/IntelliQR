import * as cookie from "cookie";
import { z } from "zod";
import * as jose from "jose";
import { Session } from "../contracts/constants.js";
import { getSessionCookieOptions } from "./lib/cookies.js";
import { createRouter, authedQuery, publicQuery } from "./middleware.js";
import { upsertUser, findUserByUnionId } from "./queries/users.js";
import { signSessionToken } from "./kimi/session.js";
import { env } from "./lib/env.js";

export const authRouter = createRouter({
  me: publicQuery.query((opts) => opts.ctx.user ?? null),

  googleLogin: publicQuery
    .input(
      z.object({
        credential: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { credential } = input;

      const jwks = jose.createRemoteJWKSet(
        new URL("https://www.googleapis.com/oauth2/v3/certs")
      );

      const { payload } = await jose.jwtVerify(credential, jwks, {
        audience: "109467875222-v0vgjm6ot9kb85411tvk3veohms4ur4p.apps.googleusercontent.com",
        issuer: ["https://accounts.google.com", "accounts.google.com"],
      });

      const email = payload.email as string;
      const name = payload.name as string;
      const avatar = payload.picture as string;
      const unionId = `google_${payload.sub}`;

      let user = await findUserByUnionId(unionId);
      if (!user) {
        await upsertUser({
          unionId,
          name,
          email,
          avatar,
          lastSignInAt: new Date(),
        });
        user = await findUserByUnionId(unionId);
      } else {
        await upsertUser({
          ...user,
          lastSignInAt: new Date(),
        });
      }

      if (!user) {
        throw new Error("Failed to authenticate with Google.");
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
