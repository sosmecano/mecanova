import fs from 'fs';
import path from 'path';
import { pool } from './pool';

async function migrate() {
  const sqlPath = path.resolve(__dirname, '../../../database/001_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  try {
    await pool.query(sql);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
