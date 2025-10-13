-- Add Cascading Deletes for all Person relations
-- See "./V202212071113__add_cascade_on_delete_for_op_co.sql" for more info
ALTER TABLE operating_company_members
  DROP CONSTRAINT operating_company_members_members_id_fkey;
ALTER TABLE operating_company_members
  ADD CONSTRAINT operating_company_members_members_id_fkey
    FOREIGN KEY (members_id)
      REFERENCES person (id)
      ON DELETE CASCADE;

ALTER TABLE person_roles
  DROP CONSTRAINT person_roles_person_id_fkey;
ALTER TABLE person_roles
  ADD CONSTRAINT person_roles_person_id_fkey
    FOREIGN KEY (person_id)
      REFERENCES person (id)
      ON DELETE CASCADE;

-- Remove foreign keys from all audit trails
-- We want to preserve audits even when the person is deleted
ALTER TABLE infrastructure_request
  DROP CONSTRAINT infrastructure_request_created_by_fkey;
ALTER TABLE infrastructure_request
  DROP CONSTRAINT infrastructure_request_last_modified_by_fkey;

ALTER TABLE operating_company
  DROP CONSTRAINT operating_company_created_by_fkey;
ALTER TABLE operating_company
  DROP CONSTRAINT operating_company_last_modified_by_fkey;

ALTER TABLE person
  DROP CONSTRAINT person_created_by_fkey;
ALTER TABLE person
  DROP CONSTRAINT person_last_modified_by_fkey;

ALTER TABLE person_request
  DROP CONSTRAINT person_request_created_by_fkey;
ALTER TABLE person_request
  DROP CONSTRAINT person_request_last_modified_by_fkey;

ALTER TABLE request_form
  DROP CONSTRAINT request_form_created_by_fkey;
ALTER TABLE request_form
  DROP CONSTRAINT request_form_last_modified_by_fkey;
