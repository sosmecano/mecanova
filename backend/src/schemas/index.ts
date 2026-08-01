import { z } from 'zod';

function normalizePhone(val: string): string {
  return val.replace(/[\s\-\+\(\)]/g, '');
}

export const phoneSchema = z.string().transform(normalizePhone).pipe(
  z.string().regex(/^\d{6,15}$/, 'Numéro de téléphone invalide')
);

export const sendOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'Code must be 6 digits'),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
});

export const adminVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const updateUserSchema = z.object({
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  language: z.string().max(10).optional(),
  photo_url: z.string().max(500).optional(),
});

export const createVehicleSchema = z.object({
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(2030),
  license_plate: z.string().min(1).max(20),
  fuel_type: z.string().max(50).optional(),
  transmission: z.string().max(50).optional(),
  mileage: z.number().int().min(0).optional(),
  color: z.string().max(50).optional(),
});

export const registerProSchema = z.object({
  phone: phoneSchema,
  type: z.enum(['mechanic', 'tow_truck', 'garage']),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  business_name: z.string().max(200).optional(),
  specialties: z.array(z.string()).optional(),
  mobile_money_number: z.string().max(20).optional(),
});

export const updateProSchema = z.object({
  business_name: z.string().max(200).optional(),
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  specialties: z.array(z.string()).optional(),
  zone_center_lat: z.number().min(-90).max(90).optional(),
  zone_center_lng: z.number().min(-180).max(180).optional(),
  zone_radius_km: z.number().min(0).max(1000).optional(),
  hours: z.record(z.string(), z.array(z.string())).optional(),
  photo_url: z.string().max(500).optional(),
});

export const availabilitySchema = z.object({
  is_available: z.boolean(),
});

export const createMissionSchema = z.object({
  vehicle_id: z.string().uuid().optional(),
  service_type: z.enum(['mechanic', 'emergency', 'towing', 'garage_appointment']),
  description: z.string().max(2000).optional(),
  location_lat: z.number().min(-90).max(90),
  location_lng: z.number().min(-180).max(180),
  location_address: z.string().max(500).optional(),
  destination_lat: z.number().min(-90).max(90).optional(),
  destination_lng: z.number().min(-180).max(180).optional(),
  destination_address: z.string().max(500).optional(),
  is_urgent: z.boolean().optional(),
});

export const updateMissionStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled']),
});

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

export const verifyProOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const createPaymentSchema = z.object({
  mission_id: z.string().uuid(),
  amount: z.number().int().min(1, 'Amount must be positive'),
  method: z.enum(['orange_money', 'mtn_momo', 'wave', 'cash']),
});

export const createReviewSchema = z.object({
  mission_id: z.string().uuid(),
  professional_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const createDiagnosisSchema = z.object({
  mission_id: z.string().uuid(),
  description: z.string().max(2000),
  amount: z.number().int().min(0),
});

export const updateDiagnosisStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected']),
});

export const createSubscriptionSchema = z.object({
  plan: z.string().min(1).max(50),
  mission_limit: z.number().int().min(1),
});

export const validateProSchema = z.object({
  action: z.enum(['approve', 'reject']),
});