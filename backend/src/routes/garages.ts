import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReviewSchema } from '../schemas';

const router = Router();

router.get('/', async (_req: AuthRequest, res: Response) => {
  const { lat, lng, specialty } = _req.query;
  let sql = `
    SELECT g.*, p.rating, p.rating_count, p.first_name, p.last_name,
           p.photo_url, p.specialties
    FROM garages g
    JOIN professionals p ON g.professional_id = p.id
    WHERE p.status = 'active'
  `;
  const params: any[] = [];

  if (specialty) {
    sql += ' AND $1 = ANY(p.specialties)';
    params.push(specialty);
  }
  sql += ' ORDER BY p.rating DESC NULLS LAST LIMIT 50';

  const result = await query(sql, params);
  res.json(result.rows);
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT g.*, p.rating, p.rating_count, p.first_name, p.last_name,
            p.photo_url, p.specialties, p.phone, p.hours
     FROM garages g
     JOIN professionals p ON g.professional_id = p.id
     WHERE g.id = $1`,
    [req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Garage not found' });
  res.json(result.rows[0]);
});

router.use(authenticate);

router.post('/reviews', validate(createReviewSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { mission_id, professional_id, rating, comment } = req.body;

    const review = await query(
      `INSERT INTO reviews (mission_id, user_id, professional_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [mission_id, req.userId, professional_id, rating, comment || null]
    );

    const avg = await query(
      `SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE professional_id = $1`,
      [professional_id]
    );
    await query(
      'UPDATE professionals SET rating = $1, rating_count = $2 WHERE id = $3',
      [Math.round(avg.rows[0].avg * 10) / 10, avg.rows[0].count, professional_id]
    );

    res.status(201).json(review.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Review failed' });
  }
});

export default router;
