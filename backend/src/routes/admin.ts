import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { validateProSchema } from '../schemas';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/dashboard', async (_req: AuthRequest, res: Response) => {
  const users = await query('SELECT * FROM users');
  const pros = await query('SELECT * FROM professionals');
  const activePros = await query("SELECT * FROM professionals WHERE status = 'active'");
  const pendingPros = await query("SELECT * FROM professionals WHERE status = 'pending'");
  const missions = await query('SELECT * FROM missions');
  const payments = await query("SELECT * FROM payments WHERE status = 'completed'");

  const activeMissions = missions.rows.filter(
    (m: any) => m.status !== 'completed' && m.status !== 'cancelled'
  );
  const total_revenue = payments.rows.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);
  const total_commissions = payments.rows.reduce((sum: number, p: any) => sum + (parseFloat(p.commission) || 0), 0);

  res.json({
    total_users: users.rows.length,
    total_professionals: pros.rows.length,
    active_professionals: activePros.rows.length,
    pending_professionals: pendingPros.rows.length,
    total_missions: missions.rows.length,
    active_missions: activeMissions.length,
    total_revenue,
    total_commissions,
  });
});

router.get('/professionals', async (req: AuthRequest, res: Response) => {
  const status = (req.query.status as string) || 'all';
  let sql = 'SELECT * FROM professionals';
  const params: any[] = [];

  if (status !== 'all') {
    sql += ' WHERE status = $1';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';

  const result = await query(sql, params);
  res.json(result.rows);
});

router.patch('/professionals/:id/validate', validate(validateProSchema), async (req: AuthRequest, res: Response) => {
  const { action } = req.body;
  const newStatus = action === 'approve' ? 'active' : 'rejected';

  const result = await query(
    'UPDATE professionals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [newStatus, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Professional not found' });
  res.json(result.rows[0]);
});

router.get('/users', async (_req: AuthRequest, res: Response) => {
  const result = await query('SELECT * FROM users ORDER BY created_at DESC LIMIT 100');
  res.json(result.rows);
});

router.patch('/users/:id/suspend', async (req: AuthRequest, res: Response) => {
  const result = await query(
    "UPDATE users SET status = 'suspended', updated_at = NOW() WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
});

router.get('/missions', async (req: AuthRequest, res: Response) => {
  const status = (req.query.status as string) || 'all';
  let sql = `SELECT m.*, u.first_name as user_name, p.first_name as pro_name
             FROM missions m
             LEFT JOIN users u ON m.user_id = u.id
             LEFT JOIN professionals p ON m.professional_id = p.id`;
  const params: any[] = [];

  if (status !== 'all') {
    sql += ' WHERE m.status = $1';
    params.push(status);
  }
  sql += ' ORDER BY m.created_at DESC LIMIT 100';

  const result = await query(sql, params);
  res.json(result.rows);
});

router.get('/payments', async (_req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT p.*, u.first_name as user_name, pr.first_name as pro_name
     FROM payments p
     LEFT JOIN users u ON p.user_id = u.id
     LEFT JOIN professionals pr ON p.professional_id = pr.id
     ORDER BY p.created_at DESC LIMIT 100`
  );
  res.json(result.rows);
});

export default router;
