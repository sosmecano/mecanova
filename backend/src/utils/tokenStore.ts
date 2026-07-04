import crypto from 'crypto';
import { query } from '../db/pool';

interface RefreshTokenData {
  token: string;
  userId: string | null;
  proId: string | null;
  role: 'client' | 'professional' | 'admin';
  expiresAt: number;
}

const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;

export async function createRefreshToken(userId: string | null, proId: string | null, role: 'client' | 'professional' | 'admin'): Promise<string> {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TTL).toISOString();

  await query(
    `INSERT INTO refresh_tokens (token, user_id, pro_id, role, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [token, userId, proId, role, expiresAt]
  );

  return token;
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenData | null> {
  const result = await query(
    'SELECT * FROM refresh_tokens WHERE token = $1',
    [token]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  const now = Date.now();
  const expiresAt = new Date(row.expires_at).getTime();

  await query('DELETE FROM refresh_tokens WHERE token = $1', [token]);

  if (now > expiresAt) return null;

  return {
    token: row.token,
    userId: row.user_id,
    proId: row.pro_id,
    role: row.role,
    expiresAt,
  };
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  await query('DELETE FROM refresh_tokens WHERE pro_id = $1', [userId]);
}
