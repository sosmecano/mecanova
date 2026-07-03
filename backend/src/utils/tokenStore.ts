import crypto from 'crypto';

interface RefreshTokenData {
  token: string;
  userId: string | null;
  proId: string | null;
  role: 'client' | 'professional' | 'admin';
  expiresAt: number;
}

const store = new Map<string, RefreshTokenData>();

const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;

export function createRefreshToken(userId: string | null, proId: string | null, role: 'client' | 'professional' | 'admin'): string {
  const token = crypto.randomBytes(48).toString('hex');
  const data: RefreshTokenData = {
    token,
    userId,
    proId,
    role,
    expiresAt: Date.now() + REFRESH_TTL,
  };
  store.set(token, data);
  return token;
}

export function verifyRefreshToken(token: string): RefreshTokenData | null {
  const data = store.get(token);
  if (!data) return null;
  if (Date.now() > data.expiresAt) {
    store.delete(token);
    return null;
  }
  store.delete(token);
  return data;
}

export function revokeAllUserTokens(userId: string) {
  for (const [token, data] of store) {
    if (data.userId === userId || data.proId === userId) {
      store.delete(token);
    }
  }
}