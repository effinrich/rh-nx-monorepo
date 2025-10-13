CREATE TYPE company_status AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');
ALTER TABLE company ADD COLUMN status company_status;
