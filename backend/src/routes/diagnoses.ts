import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createDiagnosisSchema, updateDiagnosisStatusSchema } from '../schemas';

const router = Router();

router.get('/mission/:missionId', authenticate, async (req: AuthRequest, res: Response) => {
  const result = await query(
    'SELECT * FROM diagnoses WHERE mission_id = $1 ORDER BY created_at DESC',
    [req.params.missionId]
  );
  res.json(result.rows);
});

router.post('/', authenticate, validate(createDiagnosisSchema), async (req: AuthRequest, res: Response) => {
  const { mission_id, description, amount } = req.body;

  const result = await query(
    `INSERT INTO diagnoses (mission_id, professional_id, description, amount, status)
     VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
    [mission_id, req.proId, description, amount || null]
  );
  res.status(201).json(result.rows[0]);
});

router.patch('/:id/status', authenticate, validate(updateDiagnosisStatusSchema), async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  const existing = await query('SELECT professional_id FROM diagnoses WHERE id = $1', [req.params.id]);
  if (existing.rows.length === 0) return res.status(404).json({ error: 'Diagnosis not found' });
  if (req.userRole !== 'admin' && existing.rows[0].professional_id !== req.proId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  const result = await query(
    'UPDATE diagnoses SET status = $1 WHERE id = $2 RETURNING *',
    [status, req.params.id]
  );
  res.json(result.rows[0]);
});

export default router;
