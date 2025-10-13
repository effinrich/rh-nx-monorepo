-- Remove foreign keys from all audit trails
-- We want to preserve audits even when the person or company is deleted
ALTER TABLE company_members_audit
DROP CONSTRAINT IF EXISTS company_members_audit_created_by_fkey;

ALTER TABLE company_members_audit
DROP CONSTRAINT IF EXISTS company_members_audit_last_modified_by_fkey;

ALTER TABLE company_members_audit
DROP CONSTRAINT IF EXISTS company_members_audit_member_of_id_fkey;

ALTER TABLE company_members_audit
DROP CONSTRAINT IF EXISTS company_members_audit_members_id_fkey;




