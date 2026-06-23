import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres.qtdqqrtffcsktcrazliq:Rakesh%40758198@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

async function runSqlFile(client, filePath, label) {
  console.log(`\n▶ Running ${label}...`);
  const sql = readFileSync(filePath, "utf8");
  await client.query(sql);
  console.log(`✓ ${label} completed`);
}

async function main() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    await runSqlFile(
      client,
      join(root, "supabase/migrations/001_initial_schema.sql"),
      "001_initial_schema.sql"
    );

    await runSqlFile(
      client,
      join(root, "supabase/migrations/002_storage_buckets.sql"),
      "002_storage_buckets.sql"
    );

    await runSqlFile(client, join(root, "supabase/seed.sql"), "seed.sql");

    const { rows } = await client.query(
      "SELECT COUNT(*)::int AS count FROM service_categories"
    );
    console.log(`\n✅ Done! Service categories seeded: ${rows[0].count}`);
  } catch (err) {
    console.error("\n❌ Migration failed:", err.message);
    if (err.position) console.error("Position:", err.position);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
