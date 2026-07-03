import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema, createVehicleSchema } from '../schemas';

const router = Router();

router.use(authenticate);

router.get('/me', async (req: AuthRequest, res: Response) => {
  const result = await query('SELECT * FROM users WHERE id = $1', [req.userId]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
});

router.put('/me', validate(updateUserSchema), async (req: AuthRequest, res: Response) => {
  const { first_name, last_name, email, city, language, photo_url } = req.body;
  const result = await query(
    `UPDATE users SET
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      email = COALESCE($3, email),
      city = COALESCE($4, city),
      language = COALESCE($5, language),
      photo_url = COALESCE($6, photo_url),
      updated_at = NOW()
    WHERE id = $7 RETURNING *`,
    [first_name, last_name, email, city, language, photo_url, req.userId]
  );
  res.json(result.rows[0]);
});

router.get('/vehicles', async (req: AuthRequest, res: Response) => {
  const result = await query('SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC', [req.userId]);
  res.json(result.rows);
});

router.post('/vehicles', validate(createVehicleSchema), async (req: AuthRequest, res: Response) => {
  const { brand, model, year, license_plate, fuel_type, transmission, mileage, color } = req.body;
  const result = await query(
    `INSERT INTO vehicles (user_id, brand, model, year, license_plate, fuel_type, transmission, mileage, color)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [req.userId, brand, model, year, license_plate, fuel_type, transmission, mileage, color]
  );
  res.status(201).json(result.rows[0]);
});

router.delete('/vehicles/:id', async (req: AuthRequest, res: Response) => {
  await query('DELETE FROM vehicles WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
  res.json({ message: 'Deleted' });
});

router.get('/missions', async (req: AuthRequest, res: Response) => {
  const result = await query(
    `SELECT * FROM missions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
    [req.userId]
  );
  for (const mission of result.rows) {
    if (mission.professional_id) {
      const pro = await query(`SELECT * FROM professionals WHERE id = $1`, [mission.professional_id]);
      if (pro.rows.length > 0) {
        mission.pro_first_name = pro.rows[0].first_name;
        mission.pro_last_name = pro.rows[0].last_name;
        mission.pro_phone = pro.rows[0].phone;
        mission.pro_photo = pro.rows[0].photo_url;
        mission.pro_rating = pro.rows[0].rating;
      }
    }
  }
  res.json(result.rows);
});

export default router;
