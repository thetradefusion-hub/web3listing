import pg from "pg";

const password = encodeURIComponent("Rakesh@758198");
const ref = "qtdqqrtffcsktcrazliq";
const regions = [
  "us-east-1","us-east-2","us-west-1","us-west-2","ca-central-1",
  "eu-west-1","eu-west-2","eu-west-3","eu-central-1","eu-central-2","eu-north-1","eu-south-1",
  "ap-south-1","ap-south-2","ap-southeast-1","ap-southeast-2","ap-northeast-1","ap-northeast-2","ap-east-1",
  "sa-east-1","me-south-1","me-central-1","af-south-1",
];

for (const prefix of ["aws-0", "aws-1"]) {
  for (const region of regions) {
    for (const port of [5432, 6543]) {
      const url = `postgresql://postgres.${ref}:${password}@${prefix}-${region}.pooler.supabase.com:${port}/postgres`;
      const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
      try {
        await client.connect();
        const { rows } = await client.query("SELECT current_database() AS db, version()");
        console.log(`\n✅ SUCCESS`);
        console.log(`Region: ${prefix}-${region}:${port}`);
        console.log(`URL: ${url.replace(password, "***")}`);
        console.log(`DB: ${rows[0].db}`);
        await client.end();
        process.exit(0);
      } catch (e) {
        const msg = e.message.slice(0, 80);
        if (!msg.includes("tenant/user") && !msg.includes("timeout")) {
          console.log(`? ${prefix}-${region}:${port} -> ${msg}`);
        }
        try { await client.end(); } catch {}
      }
    }
  }
}
console.log("\nNo working pooler region found.");
process.exit(1);
