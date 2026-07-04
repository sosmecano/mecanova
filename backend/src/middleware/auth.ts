import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createRefreshToken } from '../utils/tokenStore';

const _secret = process.env.JWT_SECRET;
if (!_secret) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET: string = _secret;

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'client' | 'professional' | 'admin';
  proId?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.proId = decoded.proId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export async function signRefreshToken(userId: string | null, proId: string | null, role: 'client' | 'professional' | 'admin'): Promise<string> {
  return createRefreshToken(userId, proId, role);
}
