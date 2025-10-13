BEGIN;
ALTER TABLE company_vendor
    DROP CONSTRAINT IF EXISTS "company_vendor_pkey";
ALTER TABLE company_vendor
  ADD PRIMARY KEY (id);
COMMIT;
