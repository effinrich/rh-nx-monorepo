DELETE FROM company_members_audit;
ALTER TABLE company_members_audit DROP COLUMN member_of_id;
ALTER TABLE company_members_audit ADD COLUMN member_of_id varchar(256);
ALTER TABLE company_members_audit DROP COLUMN members_id;
ALTER TABLE company_members_audit ADD COLUMN members_id varchar(256);

