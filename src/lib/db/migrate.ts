import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/filip_todo";

async function runMigrations() {
  const sql = postgres(connectionString, { 
    max: 1,
    connect_timeout: 10,
  });
  const db = drizzle(sql);
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

runMigrations(); 