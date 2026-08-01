CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(100),
  language VARCHAR(10) DEFAULT 'fr',
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  license_plate VARCHAR(20) NOT NULL,
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  mileage INTEGER,
  color VARCHAR(50),
  insurance_date DATE,
  tech_inspection_date DATE,
  last_oil_change_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE pro_type AS ENUM ('mechanic', 'tow_truck', 'garage');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE pro_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  type pro_type NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  business_name VARCHAR(200),
  specialties TEXT[],
  photo_url TEXT,
  city VARCHAR(100),
  zone_center_lat DOUBLE PRECISION,
  zone_center_lng DOUBLE PRECISION,
  zone_radius_km DOUBLE PRECISION DEFAULT 10,
  is_available BOOLEAN DEFAULT false,
  status pro_status DEFAULT 'pending',
  rating DOUBLE PRECISION DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  mobile_money_number VARCHAR(20),
  id_document_url TEXT,
  certificate_url TEXT,
  workshop_photo_url TEXT,
  hours JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE mission_status AS ENUM ('pending', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE service_type AS ENUM ('mechanic', 'emergency', 'towing', 'garage_appointment');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  professional_id UUID REFERENCES professionals(id),
  service_type service_type NOT NULL,
  status mission_status DEFAULT 'pending',
  description TEXT,
  photo_urls TEXT[],
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  location_address TEXT,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  destination_address TEXT,
  estimated_price_min INTEGER,
  estimated_price_max INTEGER,
  final_price INTEGER,
  platform_commission INTEGER,
  professional_net INTEGER,
  is_urgent BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('orange_money', 'mtn_momo', 'wave', 'cash');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  professional_id UUID REFERENCES professionals(id),
  amount INTEGER NOT NULL,
  commission INTEGER NOT NULL DEFAULT 0,
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_ref VARCHAR(255),
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id),
  professional_id UUID NOT NULL REFERENCES professionals(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id),
  plan VARCHAR(50) NOT NULL,
  mission_limit INTEGER DEFAULT 5,
  status subscription_status DEFAULT 'active',
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS garages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) UNIQUE,
  name VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone VARCHAR(20) NOT NULL,
  specialties TEXT[],
  hours JSONB,
  photos TEXT[],
  indicative_prices JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id),
  professional_id UUID NOT NULL REFERENCES professionals(id),
  description TEXT,
  amount INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_missions_user ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_professional ON missions(professional_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_created ON missions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_professionals_location ON professionals(city);
CREATE INDEX IF NOT EXISTS idx_professionals_type_status ON professionals(type, status);
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pro_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  token VARCHAR(128) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_pro ON refresh_tokens(pro_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_user ON vehicles(user_id);
