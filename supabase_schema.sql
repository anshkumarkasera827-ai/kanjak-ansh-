-- ==============================================================================
-- KANJAK PUJA PLATFORM - DATABASE SCHEMA & PRIVACY RULES (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. Hosts Table (Devotee families offering Puja)
CREATE TABLE IF NOT EXISTS hosts (
  id TEXT PRIMARY KEY,
  host_token TEXT NOT NULL UNIQUE,
  family_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  puja_date DATE NOT NULL,
  tithi TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  total_slots INT NOT NULL DEFAULT 9,
  booked_slots INT NOT NULL DEFAULT 0,
  dakshina_amount INT NOT NULL DEFAULT 101,
  prasad_menu TEXT NOT NULL,
  gifts TEXT NOT NULL,
  approximate_area TEXT NOT NULL,
  landmark TEXT,
  exact_address TEXT NOT NULL, -- PROTECTED: Revealed only to confirmed guardians
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'closed', 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Guardians Table (Privacy-Preserved Child Registrations)
CREATE TABLE IF NOT EXISTS guardians (
  id TEXT PRIMARY KEY,
  guardian_token TEXT NOT NULL UNIQUE,
  child_first_name TEXT NOT NULL, -- Only first name or devotional alias
  child_age INT NOT NULL CHECK (child_age >= 1 AND child_age <= 14),
  child_type TEXT NOT NULL DEFAULT 'kanjak', -- 'kanjak' or 'langur'
  guardian_name TEXT NOT NULL,
  guardian_relation TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  locality TEXT NOT NULL,
  dietary_notes TEXT DEFAULT 'Satvik (Pure Vegetarian)',
  consent_given BOOLEAN NOT NULL DEFAULT TRUE,
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Bookings Table (Slot Reservations)
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  guardian_id TEXT NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  guardian_token TEXT NOT NULL,
  child_first_name TEXT NOT NULL,
  child_age INT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
  booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_host_guardian UNIQUE (host_id, guardian_token)
);

-- ==============================================================================
-- CONCURRENCY-SAFE ATOMIC BOOKING FUNCTION (PostgreSQL Stored Procedure)
-- ==============================================================================
CREATE OR REPLACE FUNCTION book_kanjak_slot(
  p_host_id TEXT,
  p_guardian_token TEXT,
  p_notes TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_host RECORD;
  v_guardian RECORD;
  v_existing RECORD;
  v_booking_id TEXT;
BEGIN
  -- 1. Lock the host row exclusively to prevent race conditions
  SELECT * INTO v_host FROM hosts WHERE id = p_host_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'status', 404, 'message', 'Puja host not found');
  END IF;

  IF v_host.status != 'open' THEN
    RETURN jsonb_build_object('success', false, 'conflict', true, 'status', 409, 'message', 'Puja slots for this host are closed');
  END IF;

  IF v_host.booked_slots >= v_host.total_slots THEN
    RETURN jsonb_build_object('success', false, 'conflict', true, 'status', 409, 'message', 'This slot was just claimed. Total capacity reached.');
  END IF;

  -- 2. Verify guardian exists
  SELECT * INTO v_guardian FROM guardians WHERE guardian_token = p_guardian_token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'status', 401, 'message', 'Invalid Guardian Token');
  END IF;

  -- 3. Check for existing booking
  SELECT * INTO v_existing FROM bookings 
  WHERE host_id = p_host_id AND guardian_token = p_guardian_token AND status = 'confirmed';
  
  IF FOUND THEN
    RETURN jsonb_build_object('success', false, 'status', 400, 'message', 'You already booked a slot with this host');
  END IF;

  -- 4. Atomically increment and insert booking
  UPDATE hosts SET booked_slots = booked_slots + 1 WHERE id = p_host_id;
  
  v_booking_id := 'BK-' || floor(1000 + random() * 9000)::text;

  INSERT INTO bookings (id, host_id, guardian_id, guardian_token, child_first_name, child_age, notes, status)
  VALUES (v_booking_id, v_host.id, v_guardian.id, v_guardian.guardian_token, v_guardian.child_first_name, v_guardian.child_age, p_notes, 'confirmed');

  -- 5. Return success and reveal address to confirmed guardian
  RETURN jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'child_first_name', v_guardian.child_first_name,
    'host_family_name', v_host.family_name,
    'tithi', v_host.tithi,
    'time_slot', v_host.time_slot,
    'dakshina_amount', v_host.dakshina_amount,
    'prasad_menu', v_host.prasad_menu,
    'gifts', v_host.gifts,
    'exact_address', v_host.exact_address,
    'contact_person', v_host.contact_person,
    'phone', v_host.phone
  );
END;
$$;
