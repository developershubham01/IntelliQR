import postgres from "postgres";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

console.log("Connecting to Supabase PostgreSQL...");
const sql = postgres(databaseUrl, { ssl: "require" });

async function run() {
  try {
    const migrationPath = path.join(process.cwd(), "db", "migrations", "0001_razorpay_billing.sql");
    const migrationSql = fs.readFileSync(migrationPath, "utf-8");

    console.log("Executing migration 0001_razorpay_billing.sql...");
    await sql.unsafe(migrationSql);
    console.log("Migration executed successfully! Columns and tables created.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
