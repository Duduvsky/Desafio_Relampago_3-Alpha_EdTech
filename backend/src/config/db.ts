import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'asset_maintenance',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Função para executar queries
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Função para executar transações
export const transaction = async (queries: {text: string, params?: any[]}[]) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    for (const q of queries) {
      await client.query(q.text, q.params || []);
    }
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export default pool;