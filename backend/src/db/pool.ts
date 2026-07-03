import dotenv from 'dotenv';

dotenv.config();

interface Row {
  [key: string]: any;
}

interface QueryResult {
  rows: Row[];
  rowCount: number;
}

const tables: Record<string, Row[]> = {
  users: [],
  vehicles: [],
  professionals: [],
  missions: [],
  payments: [],
  reviews: [],
  subscriptions: [],
  garages: [],
  diagnoses: [],
};

let nextId = 1;
function genId() {
  const id = nextId++;
  return '00000000-0000-0000-0000-' + String(id).padStart(12, '0');
}

function uuid(): string {
  return genId();
}

function matchRow(row: Row, whereClause: string, params: any[]): boolean {
  const conditions = whereClause.split(/\s+AND\s+/i);
  for (const cond of conditions) {
    const match = cond.match(/(\w+\.)?(\w+)\s*=\s*\$(\d+)/);
    if (match) {
      const col = stripTablePrefix((match[1] || '') + match[2]);
      const idx = parseInt(match[3]) - 1;
      if (row[col] !== params[idx]) return false;
    }
    const isMatch = cond.match(/(\w+)\s*IS\s+NULL/i);
    if (isMatch) {
      const col = isMatch[1];
      if (row[col] !== null && row[col] !== undefined) return false;
    }
  }
  return true;
}

function parseSelect(sql: string): { table: string; where: string | null; returning: string | null } {
  const fromMatch = sql.match(/\bFROM\s+(\w+)/i);
  const table = fromMatch ? fromMatch[1] : '';
  const whereMatch = sql.match(/\bWHERE\s+([\s\S]+?)(?:\bORDER\b|\bLIMIT\b|\bRETURNING\b|$)/i);
  let where = whereMatch ? whereMatch[1].trim() : null;
  const returningMatch = sql.match(/\bRETURNING\s+(.+)/i);
  const returning = returningMatch ? returningMatch[1].trim() : null;
  return { table, where, returning };
}

function stripTablePrefix(col: string): string {
  const dot = col.indexOf('.');
  return dot >= 0 ? col.slice(dot + 1) : col;
}

function parseInsert(sql: string): { table: string; cols: string[]; returning: string | null; rowCount: number } {
  const match = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES/i);
  const table = match ? match[1] : '';
  const cols = match ? match[2].split(',').map(c => c.trim()) : [];
  const returningMatch = sql.match(/\bRETURNING\s+(.+)/i);
  const returning = returningMatch ? returningMatch[1].trim() : null;

  // count value tuples: the number of parenthesized groups after VALUES
  const valuesMatch = sql.substring(match ? match.index! + match[0].length : 0);
  let rowCount = 0;
  const parenRe = /\(/g;
  while (parenRe.exec(valuesMatch)) rowCount++;

  return { table, cols, returning, rowCount };
}

function parseUpdate(sql: string): { table: string; setCols: string[]; setExprs: string[]; where: string | null; returning: string | null } {
  const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
  const table = tableMatch ? tableMatch[1] : '';
  const setMatch = sql.match(/SET\s+([\s\S]+?)(?:\bWHERE\b|\bRETURNING\b|$)/i);
  const setClause = setMatch ? setMatch[1] : '';

  const setCols: string[] = [];
  const setExprs: string[] = [];
  for (const pair of splitTopLevelCommas(setClause)) {
    const m = pair.match(/(\w+)\s*=\s*(.+)/);
    if (m) { setCols.push(m[1].trim()); setExprs.push(m[2].trim()); }
  }

  const whereMatch = sql.match(/\bWHERE\s+([\s\S]+?)(?:\bORDER\b|\bLIMIT\b|\bRETURNING\b|$)/i);
  const where = whereMatch ? whereMatch[1].trim() : null;
  const returningMatch = sql.match(/\bRETURNING\s+(.+)/i);
  const returning = returningMatch ? returningMatch[1].trim() : null;
  return { table, setCols, setExprs, where, returning };
}

function resolveSetValue(expr: string, params: any[]): any {
  const coalesceMatch = expr.match(/^COALESCE\((.+)\)$/i);
  if (coalesceMatch) {
    const args = splitTopLevelCommas(coalesceMatch[1]);
    for (const arg of args) {
      const val = resolveSetValue(arg, params);
      if (val !== null && val !== undefined) return val;
    }
    return null;
  }
  const paramMatch = expr.match(/^\$(\d+)$/);
  if (paramMatch) return params[parseInt(paramMatch[1]) - 1];
  if (expr.toUpperCase() === 'NOW()') return new Date().toISOString();
  if (expr.toUpperCase() === 'NULL') return null;
  if (expr.startsWith("'") && expr.endsWith("'")) return expr.slice(1, -1);
  const num = parseFloat(expr);
  if (!isNaN(num) && expr.trim() !== '') return num;
  if (/^\w+$/.test(expr)) return undefined;
  return expr;
}

function splitTopLevelCommas(s: string): string[] {
  const parts: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') depth--;
    else if (s[i] === ',' && depth === 0) {
      parts.push(s.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(s.slice(start).trim());
  return parts;
}

function parseDelete(sql: string): { table: string; where: string | null } {
  const match = sql.match(/DELETE\s+FROM\s+(\w+)/i);
  const table = match ? match[1] : '';
  const whereMatch = sql.match(/\bWHERE\s+(.+)/i);
  const where = whereMatch ? whereMatch[1].trim() : null;
  return { table, where };
}

function applyRowValues(row: Row, cols: string[], params: any[]) {
  cols.forEach((col, i) => {
    const val = params[i];
    if (val === 'NOW()' || val === 'NOW()') {
      row[col] = new Date().toISOString();
    } else {
      row[col] = val;
    }
  });
}

function buildReturningRow(row: Row, returning: string): Row {
  const cols = returning.split(',').map(c => c.trim());
  const result: Row = {};
  for (const col of cols) {
    if (col === '*') return { ...row };
    if (col === 'id') {
      result[col] = row['id'];
    } else {
      result[col] = row[col];
    }
  }
  return result;
}

function extractArrayValues(sql: string): { sql: string; values: any[] } {
  const arrayPattern = /ARRAY\[([^\]]+)\]/g;
  let match;
  const values: any[] = [];
  let result = sql;

  while ((match = arrayPattern.exec(sql)) !== null) {
    const items = match[1].split(',').map(i => i.trim().replace(/^'(.*)'$/, '$1'));
    const placeholder = `__ARRAY_${values.length}__`;
    values.push(items);
    result = result.replace(match[0], placeholder);
  }

  return { sql: result, values };
}

function extractInlineValues(sql: string, colCount: number, params: any[]): any[] {
  const valuesStart = sql.toUpperCase().indexOf('VALUES');
  if (valuesStart === -1) return params;
  const afterValues = sql.slice(valuesStart + 6);

  const allValues: any[] = [];
  let searchIdx = 0;

  while (true) {
    const openParen = afterValues.indexOf('(', searchIdx);
    if (openParen === -1) break;
    const closeParen = findCloseParen(afterValues, openParen);
    if (closeParen === -1) break;
    const rowStr = afterValues.slice(openParen + 1, closeParen);
    const items = parseValueString(rowStr);
    const resolved = items.map((item: any) => {
      if (item === null || item === undefined) return item;
      const str = String(item);
      const paramMatch = str.match(/^\$(\d+)$/);
      if (paramMatch) return params[parseInt(paramMatch[1]) - 1];
      const num = parseFloat(str);
      if (!isNaN(num) && str.trim() !== '') return num;
      return item;
    });
    allValues.push(...resolved);
    searchIdx = closeParen + 1;
  }

  return allValues.slice(0, colCount * (allValues.length / (colCount || 1)) || allValues.length);
}

function parseValueString(s: string): string[] {
  const values: string[] = [];
  let current = '';
  let inStr = false;
  let inArray = 0;
  let escape = false;
  let i = 0;

  function flush() {
    const trimmed = current.trim();
    if (trimmed) values.push(trimmed);
    current = '';
  }

  while (i < s.length) {
    const ch = s[i];
    if (inStr) {
      if (escape) {
        current += ch;
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === "'") {
        if (i + 1 < s.length && s[i + 1] === "'") {
          current += "'";
          i++;
        } else {
          values.push(current);
          current = '';
          inStr = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === "'") {
      inStr = true;
      current = '';
    } else if (ch === 'A' && s.slice(i, i + 6).toUpperCase() === 'ARRAY[') {
      let depth = 1;
      let arr = '[';
      i += 6;
      while (i < s.length && depth > 0) {
        if (s[i] === '[') depth++;
        if (s[i] === ']') depth--;
        if (depth > 0) arr += s[i];
        i++;
      }
      try {
        const parsed = JSON.parse(arr.replace(/'/g, '"'));
        values.push(parsed);
      } catch {
        values.push(arr);
      }
      current = '';
    } else if (s.slice(i, i + 4).toUpperCase() === 'NULL' && !current.trim() && (i + 4 >= s.length || s[i + 4] === ',' || s[i + 4] === ')')) {
      values.push(null as any);
      i += 3;
    } else if (ch === ',') {
      flush();
    } else if (ch === ')' || ch === ' ') {
      // skip spacing between rows
    } else {
      current += ch;
    }
    i++;
  }
  flush();
  return values;
}

function findCloseParen(s: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    if (s[i] === '(') depth++;
    if (s[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

let pgPoolInstance: any = null;

async function getPool() {
  if (!pgPoolInstance && process.env.DATABASE_URL) {
    const { Pool } = await import('pg');
    pgPoolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pgPoolInstance;
}

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now();

  try {
    const pool = await getPool();
    if (pool) {
      const client = await pool.connect();
      try {
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        if (duration > 1000) {
          console.warn('Slow query:', { text: text.substring(0, 100), duration });
        }
        return { rows: res.rows, rowCount: res.rowCount || 0 };
      } finally {
        client.release();
      }
    }
  } catch (_pgErr) {
    if (process.env.NODE_ENV === 'production') throw _pgErr;
  }
  return mockQuery(text, params || []);
}

function mockQuery(text: string, params: any[]): QueryResult {
  const start = Date.now();

  const upper = text.trim().toUpperCase();

  if (upper.startsWith('BEGIN') || upper.startsWith('COMMIT') || upper.startsWith('ROLLBACK')) {
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('CREATE') || upper.startsWith('CREATE EXTENSION') || upper.startsWith('CREATE TYPE') || upper.startsWith('CREATE INDEX')) {
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('DELETE')) {
    const { table, where } = parseDelete(text);
    if (!table || !tables[table]) return { rows: [], rowCount: 0 };
    if (where) {
      tables[table] = tables[table].filter(row => !matchRow(row, where, params));
    } else {
      tables[table] = [];
    }
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('INSERT')) {
    const { table, cols, returning, rowCount } = parseInsert(text);
    if (!table || !tables[table]) return { rows: [], rowCount: 0 };

    const { sql: arraySql, values: arrayValues } = extractArrayValues(text);
    const rawParams = params.length > 0 ? extractInlineValues(arraySql, cols.length, params) : extractInlineValues(arraySql, cols.length, []);
    const allParams = rawParams.map((p: any) => {
      if (typeof p === 'string') {
        const m = p.match(/^__ARRAY_(\d+)__$/);
        if (m) return arrayValues[parseInt(m[1])];
      }
      return p;
    });
    const perRow = cols.length > 0 ? cols.length : allParams.length;
    const rows: Row[] = [];
    for (let r = 0; r < rowCount; r++) {
      const row: Row = { id: uuid() };
      if (cols.length > 0) {
        const start = r * cols.length;
        const rowParams = allParams.slice(start, start + cols.length);
        cols.forEach((col, i) => {
          const val = rowParams[i];
          if (val === 'NOW()') {
            row[col] = new Date().toISOString();
          } else {
            row[col] = val;
          }
        });
      } else {
        allParams.forEach((val, i) => {
          row[`col${i}`] = val;
        });
      }
      row.created_at = row.created_at || new Date().toISOString();
      row.updated_at = row.updated_at || new Date().toISOString();
      tables[table].push(row);
      rows.push(row);
    }

    if (returning) {
      const ret = rows.map(r => buildReturningRow(r, returning));
      return { rows: ret, rowCount: rows.length };
    }
    return { rows, rowCount: rows.length };
  }

  if (upper.startsWith('SELECT')) {
    const { table, where } = parseSelect(text);
    if (!table || !tables[table]) return { rows: [], rowCount: 0 };

    let rows = tables[table];

    if (where) {
      const conditions = where.split(/\s+AND\s+/i);
      rows = rows.filter(row => {
        for (const cond of conditions) {
          let match = cond.match(/(\w+\.)?(\w+)\s*=\s*\$(\d+)/);
          if (match) {
            const col = stripTablePrefix((match[1] || '') + match[2]);
            const idx = parseInt(match[3]) - 1;
            if (row[col] !== params[idx]) return false;
          }
          match = cond.match(/(\w+\.)?(\w+)\s*=\s*'([^']+)'/);
          if (match) {
            const col = stripTablePrefix((match[1] || '') + match[2]);
            const val = match[3];
            if (row[col] !== undefined && row[col] !== val) return false;
          }
          match = cond.match(/(\w+)\s*IS\s+NULL/i);
          if (match) {
            const col = match[1];
            if (row[col] !== null && row[col] !== undefined) return false;
          }
        }
        return true;
      });
    }

    const orderMatch = text.match(/\bORDER\s+BY\s+(\w+(?:\s+(?:ASC|DESC))?)/i);
    if (orderMatch) {
      const [col, dir] = orderMatch[1].split(/\s+/);
      const desc = dir?.toUpperCase() === 'DESC';
      rows.sort((a, b) => {
        if (a[col] < b[col]) return desc ? 1 : -1;
        if (a[col] > b[col]) return desc ? -1 : 1;
        return 0;
      });
    }

    const limitMatch = text.match(/\bLIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      rows = rows.slice(0, limit);
    }

    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn('Slow mock query:', { text: text.substring(0, 100), duration });
    }

    return { rows, rowCount: rows.length };
  }

  if (upper.startsWith('UPDATE')) {
    const { table, setCols, setExprs, where } = parseUpdate(text);
    if (!table || !tables[table]) return { rows: [], rowCount: 0 };

    let targetRows = tables[table];
    if (where) {
      targetRows = targetRows.filter(row => matchRow(row, where, params));
    }

    for (const row of targetRows) {
      setCols.forEach((col, i) => {
        row[col] = resolveSetValue(setExprs[i], params);
      });
    }

    const returningMatch = text.match(/\bRETURNING\s+(.+)/i);
    if (returningMatch) {
      const returning = returningMatch[1].trim();
      return { rows: targetRows.map(r => buildReturningRow(r, returning)), rowCount: targetRows.length };
    }
    return { rows: targetRows, rowCount: targetRows.length };
  }

  return { rows: [], rowCount: 0 };
}

export const pool = {
  connect: async () => {
    const client = await (async () => {
      const { Client } = await import('pg');
      return new Client({ connectionString: process.env.DATABASE_URL });
    })();
    return client;
  },
  query,
  on: () => {},
};

export default pool;
