import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

async function main() {
  if (!process.env.DB_URL) throw new Error('No database file');
  const db = drizzle(process.env.DB_URL);

  try {
    await migrate(db, { migrationsFolder: './migrations' });
  } catch {
    process.exit(1);
  }
  process.exit(0);
}

main();
