import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { sql } from "drizzle-orm";

async function reset() {
  const { db } = await import("./index.js");

  await db.execute(
    sql`DROP TABLE IF EXISTS news, programs, events, gallery, team_members, partners CASCADE`
  );

  console.log("All tables dropped");
  process.exit(0);
}

reset().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});
