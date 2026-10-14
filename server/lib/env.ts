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
  get appId() { return process.env.APP_ID || process.env.GOOGLE_CLIENT_ID || "default-app-id"; },
  get appSecret() { return process.env.APP_SECRET || process.env.GOOGLE_CLIENT_SECRET || process.env.JWT_SECRET || "default-app-secret-for-jwt"; },
  get isProduction() { return process.env.NODE_ENV === "production"; },
  get databaseUrl() { return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DATABASE_URL || required("DATABASE_URL"); },
  get googleClientId() { return process.env.GOOGLE_CLIENT_ID || "666347407890-jrk5jjrcqepf1gp2oimqtmmfcm6nfa49.apps.googleusercontent.com"; },
  get ownerUnionId() { return process.env.OWNER_UNION_ID ?? ""; },
  get razorpayKeyId() { return process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""; },
  get razorpayKeySecret() { return process.env.RAZORPAY_KEY_SECRET || ""; },
  get razorpayWebhookSecret() { return process.env.RAZORPAY_WEBHOOK_SECRET || ""; },
  get appUrl() { return process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "production" ? "https://intelliqr.abwcurious.com" : "http://localhost:3000"); },
};

