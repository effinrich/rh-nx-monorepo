CREATE TYPE company_members_cud_operation AS ENUM ('INSERT', 'UPDATE', 'DELETE');
CREATE TABLE company_members_audit (
  id int8,
  member_of_id int8 REFERENCES company,
  members_id int8 REFERENCES person,
  status company_member_status,
  operation company_members_cud_operation,
  created TIMESTAMP,
  created_by VARCHAR(255) REFERENCES person(email),
  last_modified TIMESTAMP,
  last_modified_by VARCHAR(255) REFERENCES person(email),
  PRIMARY KEY(id)
);
create sequence company_members_audit_seq start 1 increment 50;
