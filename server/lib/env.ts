/// <reference types="node" />
import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    console.warn(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  appId: process.env.APP_ID || process.env.GOOGLE_CLIENT_ID || "default-app-id",
  appSecret: process.env.APP_SECRET || process.env.GOOGLE_CLIENT_SECRET || process.env.JWT_SECRET || "default-app-secret-for-jwt",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  googleClientId: process.env.GOOGLE_CLIENT_ID || "666347407890-jrk5jjrcqepf1gp2oimqtmmfcm6nfa49.apps.googleusercontent.com",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
