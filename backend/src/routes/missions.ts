import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createMissionSchema, updateMissionStatusSchema, locationSchema } from '../schemas';
import { haversineDistance } from '../utils/haversine';

const router = Router();

router.use(authenticate);

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'MecaCI/1.0' } });
    const data = await res.json() as any[];
    if (data?.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {}
  return null;
}

function canAccess(mission: any, req: AuthRequest): boolean {
  return mission.user_id === req.userId
    || mission.professional_id === req.proId
    || req.userRole === 'admin';
}

router.post('/', validate(createMissionSchema), async (req: AuthRequest, res: Response) => {
  try {
    const {
      vehicle_id, service_type, description,
      location_lat, location_lng, location_address,
      destination_lat, destination_lng, destination_address,
      is_urgent
    } = req.body;

    let dlat = destination_lat;
    let dlng = destination_lng;

    if (destination_address && !dlat && !dlng) {
      const coords = await geocodeAddress(destination_address);
      if (coords) {
        dlat = coords.lat;
        dlng = coords.lng;
      }
    }

    const result = await query(
      `INSERT INTO missions
        (user_id, vehicle_id, service_type, description,
         location_lat, location_lng, location_address,
         destination_lat, destination_lng, destination_address, is_urgent, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending') RETURNING *`,
      [req.userId, vehicle_id || null, service_type, description,
       location_lat, location_lng, location_address,
       dlat || null, dlng || null, destination_address || null,
       is_urgent || false]
    );

    const io = req.app.get('io');

    const lat = parseFloat(location_lat);
    const lng = parseFloat(location_lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      const pros = await query(
        `SELECT id, zone_center_lat, zone_center_lng, zone_radius_km
         FROM professionals WHERE is_available = true AND status = 'active'`,
        []
      );
      for (const pro of pros.rows) {
        if (pro.zone_center_lat != null && pro.zone_center_lng != null && pro.zone_radius_km != null) {
          const dist = haversineDistance(lat, lng, pro.zone_center_lat, pro.zone_center_lng);
          if (dist <= pro.zone_radius_km) {
            io.to(`pro:${pro.id}`).emit('new:mission', {
              mission: result.rows[0],
              distance: dist,
              urgent: is_urgent,
            });
          }
        }
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create mission' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const result = await query(`SELECT * FROM missions WHERE id = $1`, [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Mission not found' });
  const mission = result.rows[0];
  if (!canAccess(mission, req)) return res.status(403).json({ error: 'Forbidden' });

  if (mission.user_id) {
    const user = await query(`SELECT * FROM users WHERE id = $1`, [mission.user_id]);
    if (user.rows.length > 0) {
      mission.user_first_name = user.rows[0].first_name;
      mission.user_last_name = user.rows[0].last_name;
      mission.user_phone = user.rows[0].phone;
    }
  }
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

  res.json(mission);
});

router.patch('/:id/accept', async (req: AuthRequest, res: Response) => {
  if (!req.proId) return res.status(403).json({ error: 'Forbidden' });
  const result = await query(
    `UPDATE missions SET professional_id = $1, status = 'accepted', updated_at = NOW()
     WHERE id = $2 AND status = 'pending' RETURNING *`,
    [req.proId, req.params.id]
  );
  if (result.rows.length === 0) return res.status(400).json({ error: 'Cannot accept' });

  const io = req.app.get('io');
  io.to(`user:${result.rows[0].user_id}`).emit('mission:accepted', result.rows[0]);
  res.json(result.rows[0]);
});

router.patch('/:id/status', validate(updateMissionStatusSchema), async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  const mission = await query('SELECT * FROM missions WHERE id = $1', [req.params.id]);
  if (mission.rows.length === 0) return res.status(404).json({ error: 'Mission not found' });
  if (!canAccess(mission.rows[0], req)) return res.status(403).json({ error: 'Forbidden' });

  const completedSql = status === 'completed' ? ', completed_at = NOW()' : '';
  const cancelledSql = status === 'cancelled' ? ', cancelled_at = NOW()' : '';

  const result = await query(
    `UPDATE missions SET status = $1, updated_at = NOW()${completedSql}${cancelledSql}
     WHERE id = $2 RETURNING *`,
    [status, req.params.id]
  );

  const io = req.app.get('io');
  io.to(`user:${result.rows[0].user_id}`).emit('mission:status', result.rows[0]);
  io.to(`pro:${result.rows[0].professional_id}`).emit('mission:status', result.rows[0]);
  io.to(`mission:${req.params.id}`).emit('mission:status', result.rows[0]);
  res.json(result.rows[0]);
});

router.post('/:id/location', validate(locationSchema), async (req: AuthRequest, res: Response) => {
  const { lat, lng } = req.body;

  const mission = await query('SELECT * FROM missions WHERE id = $1', [req.params.id]);
  if (mission.rows.length === 0) return res.status(404).json({ error: 'Mission not found' });
  if (!canAccess(mission.rows[0], req)) return res.status(403).json({ error: 'Forbidden' });

  const io = req.app.get('io');
  io.to(`mission:${req.params.id}`).emit('tracking:update', {
    lat, lng, timestamp: Date.now(),
  });
  res.json({ ok: true });
});

router.get('/nearby/professionals', async (req: AuthRequest, res: Response) => {
  const { lat, lng, type } = req.query;
  let limit = parseInt(req.query.limit as string) || 10;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;

  let sql = `SELECT id, first_name, last_name, type, specialties, photo_url, rating, rating_count,
             zone_center_lat, zone_center_lng, zone_radius_km
             FROM professionals WHERE is_available = true AND status = 'active'`;
  const params: any[] = [];

  if (type) {
    sql += ' AND type = $1';
    params.push(type);
  }
  sql += ' ORDER BY rating DESC LIMIT $' + (params.length + 1);
  params.push(limit);

  const result = await query(sql, params);
  res.json(result.rows);
});

export default router;