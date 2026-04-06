-- Adds an explicit actor_type column to property_update_log so SYSTEM-initiated
-- entries (e.g. PropertyRoutineCheckScheduler) are first-class instead of falling
-- through to "UNKNOWN" in the API response.
--
-- Run this BEFORE deploying the app, otherwise existing rows will have
-- actor_type = NULL and the mapper will return "UNKNOWN" for them.
--
-- NOTE on column names: Hibernate (default Spring Boot physical naming strategy)
-- maps the FK fields as below. Verify against your live schema before running:
--   updated_by_admin -> updated_by_admin_username
--   updated_by_user  -> updated_by_user_phone_no

ALTER TABLE property_update_log ADD COLUMN actor_type VARCHAR(16);

UPDATE property_update_log
SET actor_type = 'ADMIN'
WHERE updated_by_admin_username IS NOT NULL;

UPDATE property_update_log
SET actor_type = 'USER'
WHERE updated_by_user_phone_no IS NOT NULL;

-- Anything left with both FKs null was created by the routine-check scheduler.
UPDATE property_update_log
SET actor_type = 'SYSTEM'
WHERE actor_type IS NULL;

ALTER TABLE property_update_log ALTER COLUMN actor_type SET NOT NULL;
