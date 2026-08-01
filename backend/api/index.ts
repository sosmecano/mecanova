import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { query } from '../src/db/pool';

import authRoutes from '../src/routes/auth';
import userRoutes from '../src/routes/users';
import professionalRoutes from '../src/routes/professionals';
import missionRoutes from '../src/routes/missions';
import paymentRoutes from '../src/routes/payments';
import garageRoutes from '../src/routes/garages';
import adminRoutes from '../src/routes/admin';
import uploadRoutes from '../src/routes/upload';
import subscriptionRoutes from '../src/routes/subscriptions';
import diagnosisRoutes from '../src/routes/diagnoses';
import proxyRoutes from '../src/routes/proxy';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:8081,https://mecanova-admin.vercel.app').split(',');

const app = express();

app.use(helmet());
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', app: 'Mecanova API', version: '1.0.0' });
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Trop de tentatives. Réessayez dans une minute.' },
});
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/professionals/send-otp', otpLimiter);

const verifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives. Réessayez dans une minute.' },
});
app.use('/api/auth/verify-otp', verifyLimiter);
app.use('/api/auth/admin-verify', verifyLimiter);
app.use('/api/professionals/verify-otp', verifyLimiter);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
});
app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/diagnoses', diagnosisRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
