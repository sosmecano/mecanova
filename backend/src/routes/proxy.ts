import { Router, Request, Response } from 'express';

const router = Router();

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const OSRM_BASE = 'https://router.project-osrm.org';

router.get('/nominatim/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query param q required' });
    const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(q as string)}&limit=1`;
    const response = await fetch(url, { headers: { 'User-Agent': 'MecaCI/1.0' } });
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Geocoding service unavailable' });
  }
});

router.get('/nominatim/reverse', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
    const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'MecaCI/1.0' } });
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Geocoding service unavailable' });
  }
});

router.get('/osrm/driving/:coordinates', async (req: Request, res: Response) => {
  try {
    const { coordinates } = req.params;
    const url = `${OSRM_BASE}/route/v1/driving/${coordinates}?geometries=geojson&overview=full`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Routing service unavailable' });
  }
});

export default router;