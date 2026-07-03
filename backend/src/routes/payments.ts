import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPaymentSchema } from '../schemas';

const router = Router();

router.use(authenticate);

router.post('/', validate(createPaymentSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { mission_id, amount, method } = req.body;

    const mission = await query('SELECT * FROM missions WHERE id = $1', [mission_id]);
    if (mission.rows.length === 0) return res.status(404).json({ error: 'Mission not found' });
    if (mission.rows[0].user_id !== req.userId) return res.status(403).json({ error: 'Forbidden' });

    const professional_id = mission.rows[0].professional_id;
    const commission = Math.round(amount * 0.1);
    const net = amount - commission;

    const payment = await query(
      `INSERT INTO payments (mission_id, user_id, professional_id, amount, commission, method, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed') RETURNING *`,
      [mission_id, req.userId, professional_id, amount, commission, method]
    );

    await query(
      'UPDATE missions SET final_price = $1, platform_commission = $2, professional_net = $3 WHERE id = $4',
      [amount, commission, net, mission_id]
    );

    const io = req.app.get('io');
    io.to(`pro:${professional_id}`).emit('payment:received', payment.rows[0]);

    res.status(201).json(payment.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Payment failed' });
  }
});

router.get('/history', async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT p.*, m.service_type, m.status as mission_status
     FROM payments p
     JOIN missions m ON p.mission_id = m.id
     WHERE p.user_id = $1 ORDER BY p.created_at DESC LIMIT 50`,
    [req.userId]
  );
  res.json(result.rows);
});

export default router;
