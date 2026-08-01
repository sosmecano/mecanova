import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { query } from '../db/pool';
import { signToken, signRefreshToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { sendOtpSchema, verifyOtpSchema, adminVerifySchema, refreshTokenSchema } from '../schemas';
import { storeOtp, verifyOtp } from '../utils/otpStore';
import { verifyRefreshToken } from '../utils/tokenStore';
import { sendSms } from '../utils/sms';

const router = Router();

router.post('/send-otp', validate(sendOtpSchema), async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    const code = crypto.randomInt(100000, 999999).toString();
    const normalized = phone.replace(/[\s\-\+]/g, '');
    storeOtp(normalized, code);

    sendSms(normalized, `Votre code Mecanova : ${code}. Valable 2 minutes.`);

    res.json({ message: 'Code sent', expires_in: 120, code });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', validate(verifyOtpSchema), async (req: Request, res: Response) => {
  try {
    const { phone, code, firstName, lastName, city } = req.body;
    const normalizedPhone = phone.replace(/[\s\-\+]/g, '');
    if (!verifyOtp(normalizedPhone, code)) {
      return res.status(400).json({ error: 'Code invalide ou expir' });
    }

    const numericPhone = parseFloat(normalizedPhone);

    let user = await query('SELECT * FROM users WHERE phone = $1', [normalizedPhone]);
    if (user.rows.length === 0 && !isNaN(numericPhone)) {
      user = await query('SELECT * FROM users WHERE phone = $1', [numericPhone]);
    }

    if (user.rows.length === 0) {
      const existingPro = await query('SELECT id FROM professionals WHERE phone = $1', [normalizedPhone]);
      if (existingPro.rows.length > 0) {
        return res.status(403).json({ error: 'Ce numéro est un compte professionnel. Utilisez Espace professionnel pour vous connecter.' });
      }

      const name = firstName?.trim() || 'Client';
      const surname = lastName?.trim() || 'Mecanova';
      const newUser = await query(
        `INSERT INTO users (phone, first_name, last_name, city) VALUES ($1, $2, $3, $4) RETURNING *`,
        [normalizedPhone, name, surname, city || null]
      );
      user = newUser;
    }

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const adminPhones = (process.env.ADMIN_PHONES || '2250505050501').split(',');
    const role = adminPhones.includes(normalizedPhone) ? 'admin' : 'client';

    const token = signToken({
      userId: user.rows[0].id,
      role,
    });
    const refreshToken = await signRefreshToken(user.rows[0].id, null, role);

    res.json({ token, refreshToken, role, user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/admin-verify', validate(adminVerifySchema), async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    const normalizedPhone = phone.replace(/[\s\-\+]/g, '');
    if (!verifyOtp(normalizedPhone, code)) {
      return res.status(400).json({ error: 'Code invalide ou expir' });
    }

    const adminPhones = (process.env.ADMIN_PHONES || '2250505050501').split(',');
    if (!adminPhones.includes(normalizedPhone)) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    let user = await query('SELECT * FROM users WHERE phone = $1', [normalizedPhone]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const token = signToken({
      userId: user.rows[0].id,
      role: 'admin',
    });
    const refreshToken = await signRefreshToken(user.rows[0].id, null, 'admin');

    res.json({ token, refreshToken, user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/refresh', validate(refreshTokenSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const data = await verifyRefreshToken(refreshToken);
    if (!data) return res.status(401).json({ error: 'Invalid or expired refresh token' });

    const token = signToken({
      userId: data.userId,
      proId: data.proId,
      role: data.role,
    });
    const newRefreshToken = await signRefreshToken(data.userId, data.proId, data.role);

    res.json({ token, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Refresh failed' });
  }
});

export default router;
