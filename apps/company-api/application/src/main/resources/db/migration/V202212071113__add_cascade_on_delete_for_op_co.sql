-- Add Cascading Deletes for all OpCo relations
--
-- This enables us to delete an OpCo and remove all child entities related to an OpCo.
-- Some day we'll want to look into soft deletes to preserve data. The complexity with
-- soft deletes is maintaining all of these relationships in sync when a soft delete is executed.
--
-- A simpler solution for now would be taking database snapshots and referencing those when
-- information is accidentally changed.
--
-- If we are worried about clutter we could add a visibility feature to our OpCos as well.
ALTER TABLE operating_company_members
DROP CONSTRAINT operating_company_members_member_of_id_fkey;
ALTER TABLE operating_company_members
ADD CONSTRAINT operating_company_members_member_of_id_fkey
   FOREIGN KEY (member_of_id)
   REFERENCES operating_company(id)
   ON DELETE CASCADE;


ALTER TABLE person_request_op_cos
DROP CONSTRAINT person_request_op_cos_op_cos_id_fkey;
ALTER TABLE person_request_op_cos
  ADD CONSTRAINT person_request_op_cos_op_cos_id_fkey
    FOREIGN KEY (op_cos_id)
      REFERENCES operating_company(id)
      ON DELETE CASCADE;


ALTER TABLE infrastructure_request
DROP CONSTRAINT infrastructure_request_op_co_id_fkey;
ALTER TABLE infrastructure_request
ADD CONSTRAINT infrastructure_request_op_co_id_fkey
  FOREIGN KEY (op_co_id)
    REFERENCES operating_company(id)
    ON DELETE CASCADE;

ALTER TABLE request_form
DROP CONSTRAINT request_form_infrastructure_request_id_fkey;
ALTER TABLE request_form
  ADD CONSTRAINT request_form_infrastructure_request_id_fkey
  FOREIGN KEY (infrastructure_request_id)
    REFERENCES infrastructure_request(id)
    ON DELETE CASCADE;

