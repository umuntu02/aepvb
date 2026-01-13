import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  if (!client || !dbInstance) {
    const connectionString = process.env.DATABASE_URL;
    client = postgres(connectionString);
    dbInstance = drizzle(client, { schema });
  }

  return dbInstance;
}

// Use Proxy to lazy-load the database connection
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const db = getDb();
    const value = db[prop as keyof ReturnType<typeof drizzle>];
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  },
});
