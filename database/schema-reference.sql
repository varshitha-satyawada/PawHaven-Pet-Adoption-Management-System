-- Optional reference only. Spring Data JPA creates/updates these tables on first run.
CREATE DATABASE IF NOT EXISTS pawhaven_db;
USE pawhaven_db;

-- The application manages table creation via Hibernate.
-- To promote a registered user to a role:
-- UPDATE users SET role = 'SHELTER' WHERE email = 'shelter@example.com';
-- UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
