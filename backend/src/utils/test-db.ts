import { query } from '../config/db';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await query('SELECT $1::text as message', ['Database connection test']);
    console.log('Database connection successful:', result.rows[0].message);
  } catch (error) {
    console.error('Database connection failed:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testConnection();