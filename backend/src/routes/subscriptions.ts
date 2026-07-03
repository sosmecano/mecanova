import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSubscriptionSchema } from '../schemas';

const router = Router();

router.get('/', authenticate, requireRole('admin'), async (_req: AuthRequest, res: Response) => {
  const result = await query('SELECT DISTINCT ON (professional_id) * FROM subscriptions ORDER BY professional_id, created_at DESC', []);
  res.json(result.rows);
});

router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
  const result = await query(
    'SELECT * FROM subscriptions WHERE professional_id = $1 ORDER BY created_at DESC LIMIT 1',
    [req.proId]
  );
  res.json(result.rows[0] || null);
});

router.post('/', authenticate, requireRole('professional'), validate(createSubscriptionSchema), async (req: AuthRequest, res: Response) => {
  const { plan, mission_limit } = req.body;

  const result = await query(
    `INSERT INTO subscriptions (professional_id, plan, mission_limit, start_date, status)
     VALUES ($1, $2, $3, NOW(), 'active') RETURNING *`,
    [req.proId, plan, mission_limit]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
