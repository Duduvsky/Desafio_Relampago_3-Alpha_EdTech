import { BindConfig } from './../../node_modules/@types/pg/index.d';
import fs from 'fs';
import path from 'path';
import { query } from '../config/db';

export const runMigrations = async (action: 'up' | 'down' = 'up') => {
    console.log(`Starting ${action} migration...`);

  try {
    const migrationsPath = path.join(__dirname, '../config/sql');
    console.log(`Looking for migrations in: ${migrationsPath}`);

    const migrationFiles = fs.readdirSync(migrationsPath)
      .sort()
      .filter(file => file.endsWith('.sql'));

    console.log(`Found migration files: ${migrationFiles.join(', ')}`);

    if (migrationFiles.length === 0) {
      throw new Error('No migration files found!');
    }

    if (action === 'down') {
      await query('SELECT 1');
      console.log('Database connection test successful');

      // Executa migrações em ordem inversa para desfazer
      for (let i = migrationFiles.length - 1; i >= 0; i--) {
        const file = migrationFiles[i];
        if (file.startsWith('drop')) { 
          const filePath = path.join(migrationsPath, file);
          console.log(`Executing DOWN migration: ${filePath}`);
          
          const sql = fs.readFileSync(filePath, 'utf8');
          await query(sql);
          console.log(`Successfully executed: ${file}`);
          break;
        }
      }
    } else {
      await query('SELECT 1');
      console.log('Database connection test successful');
      // Executa migrações normais
      for (const file of migrationFiles) {
        if (file.startsWith('create')) {
          const filePath = path.join(migrationsPath, file);
          console.log(`Executing UP migration: ${filePath}`);
          
          const sql = fs.readFileSync(filePath, 'utf8');
          await query(sql);
          console.log(`Successfully executed: ${file}`);
          break;
        }
      }
    }

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

if (require.main === module) {
  const action = process.argv[2] === 'down' ? 'down' : 'up';
  runMigrations(action).catch(() => process.exit(1));
}