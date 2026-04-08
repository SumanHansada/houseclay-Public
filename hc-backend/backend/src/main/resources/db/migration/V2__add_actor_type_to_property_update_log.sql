-- Adds an explicit actor_type column to property_update_log so SYSTEM-initiated
-- entries (e.g. PropertyRoutineCheckScheduler) are first-class instead of falling
-- through to "UNKNOWN" in the API response.
--
-- Run this BEFORE deploying the app. If running manually in a GUI client like
-- TablePlus, execute each numbered block separately to avoid the whole script
-- being rolled back as a single transaction on partial failure.
--
-- Verified column names against prod schema:
--   updated_by_admin_username (FK to admin.username)
--   updated_by_user_phone_no  (FK to user.phone_no)

-- 1. Add the column (idempotent)
ALTER TABLE property_update_log ADD COLUMN IF NOT EXISTS actor_type VARCHAR(16);

-- 2. Backfill existing rows
UPDATE property_update_log
SET actor_type = 'ADMIN'
WHERE updated_by_admin_username IS NOT NULL
  AND actor_type IS NULL;

UPDATE property_update_log
SET actor_type = 'USER'
WHERE updated_by_user_phone_no IS NOT NULL
  AND actor_type IS NULL;

-- Anything left with both FKs null was created by the routine-check scheduler.
UPDATE property_update_log
SET actor_type = 'SYSTEM'
WHERE actor_type IS NULL;

-- 3. Enforce NOT NULL once every row has a value
ALTER TABLE property_update_log ALTER COLUMN actor_type SET NOT NULL;
