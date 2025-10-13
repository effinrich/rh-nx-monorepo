CREATE TYPE company_fundraise_status AS ENUM ('PRE_LAUNCH_PHASE', 'PRE_SERIES_A', 'SERIES_A', 'SERIES_B', 'SERIES_C');
ALTER TABLE company
Add column fundraise_status company_fundraise_status,
Add column href varchar(2048);
UPDATE company SET fundraise_status = 'PRE_LAUNCH_PHASE', href = '' WHERE fundraise_status is NULL;
