import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { query } from './db/pool';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import professionalRoutes from './routes/professionals';
import missionRoutes from './routes/missions';
import paymentRoutes from './routes/payments';
import garageRoutes from './routes/garages';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';
import subscriptionRoutes from './routes/subscriptions';
import diagnosisRoutes from './routes/diagnoses';
import proxyRoutes from './routes/proxy';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:8081,https://mecanova-admin.vercel.app').split(',');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.set('trust proxy', 1);

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

app.set('io', io);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (socket as any).data = decoded;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userData = (socket as any).data;
  socket.on('join:user', (userId: string) => {
    if (userData.userId === userId || userData.role === 'admin') {
      socket.join(`user:${userId}`);
    }
  });
  socket.on('join:pro', (proId: string) => {
    if (userData.proId === proId || userData.role === 'admin') {
      socket.join(`pro:${proId}`);
    }
  });
  socket.on('join:mission', async (missionId: string) => {
    try {
      const result = await query('SELECT user_id, professional_id FROM missions WHERE id = $1', [missionId]);
      if (result.rows.length > 0) {
        const m = result.rows[0];
        if (userData.userId === m.user_id || userData.proId === m.professional_id || userData.role === 'admin') {
          socket.join(`mission:${missionId}`);
        }
      }
    } catch {}
  });
  socket.on('tracking:location', async (data: { missionId: string; lat: number; lng: number }) => {
    socket.to(`mission:${data.missionId}`).emit('tracking:update', {
      lat: data.lat,
      lng: data.lng,
      timestamp: Date.now(),
    });
  });
  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', socket.id, 'reason:', reason);
  });
});

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

async function autoSeed() {
  try {
    const existing = await query('SELECT COUNT(*) as cnt FROM professionals', []);
    if (existing.rows[0]?.cnt > 0) return;
    const { default: seed } = await import('./db/seed');
    await seed();
    console.log('[seed] Mock data loaded');
  } catch (err: any) {
    console.error('[seed] Auto-seed failed:', err?.message);
  }
}

const PORT = parseInt(process.env.PORT || '4000', 10);
autoSeed().then(() => {
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Mecanova API running on http://0.0.0.0:${PORT}`);
  });
});

export default app;