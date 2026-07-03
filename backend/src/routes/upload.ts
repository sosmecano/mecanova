import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/auth';
import { query } from '../db/pool';

const router = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const IMAGE_SIGNATURES: Record<string, string[]> = {
  'jpg': ['ffd8ff'],
  'jpeg': ['ffd8ff'],
  'png': ['89504e47'],
  'gif': ['47494638'],
  'webp': ['52494646'],
};

function getImageMagicBytes(filepath: string): string | null {
  try {
    const fd = fs.openSync(filepath, 'r');
    const buf = Buffer.alloc(12);
    fs.readSync(fd, buf, 0, 12, 0);
    fs.closeSync(fd);
    return buf.toString('hex').toLowerCase();
  } catch {
    return null;
  }
}

function isValidImage(filepath: string): boolean {
  const hex = getImageMagicBytes(filepath);
  if (!hex) return false;
  return Object.values(IMAGE_SIGNATURES).some(sigs =>
    sigs.some(sig => hex.startsWith(sig))
  );
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Only .jpg, .jpeg, .png, .gif, .webp images allowed'));
    }
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  },
});

router.post('/photo', authenticate, upload.single('photo'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filepath = req.file.path;
    if (!isValidImage(filepath)) {
      fs.unlinkSync(filepath);
      return res.status(400).json({ error: 'Invalid image file' });
    }

    const url = `/uploads/${req.file.filename}`;

    if (req.proId) {
      await query('UPDATE professionals SET photo_url = $1 WHERE id = $2', [url, req.proId]);
    } else if (req.userId) {
      await query('UPDATE users SET photo_url = $1 WHERE id = $2', [url, req.userId]);
    }

    res.json({ url });
  } catch (err: any) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;