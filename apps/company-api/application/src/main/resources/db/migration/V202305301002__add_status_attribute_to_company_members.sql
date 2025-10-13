CREATE TYPE company_member_status AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE company_members ADD COLUMN status company_member_status;
