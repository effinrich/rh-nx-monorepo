-- Update type field to use string instead of raw enum

-- 1. RequestForm.Type
-- We have to do some "create temp field", "update temp", "remove original"
-- bits since this field is an index
ALTER TABLE request_form ADD COLUMN type_string varchar(255);

UPDATE request_form
SET type_string = 'TECH_STACK'
WHERE type = 0;

UPDATE request_form
SET type_string = 'PRIVACY_QUESTIONNAIRE'
WHERE type = 1;

drop index request_form_type_infrastructure_request_id_key cascade;

ALTER TABLE request_form DROP COLUMN type;
ALTER TABLE request_form RENAME COLUMN type_string TO type;

alter table request_form
  add unique (infrastructure_request_id, type);

-- Converting types is experimental
-- Since we only have a development environment atm, this
-- seemed fine to use.
SET enable_experimental_alter_column_type_general = true;

-- 2. Handle RequestForm.Status
ALTER TABLE request_form ALTER COLUMN status TYPE string;

UPDATE request_form
SET status = 'NOT_STARTED'
WHERE status = '0';

UPDATE request_form
SET status = 'DRAFT'
WHERE status = '1';

UPDATE request_form
SET status = 'COMPLETED'
WHERE status = '2';

-- 3. Handle InfrastructureRequest.Status
ALTER TABLE infrastructure_request ALTER COLUMN status TYPE string;
UPDATE infrastructure_request
SET status = 'AWAITING_SUBMISSION'
WHERE status = '0';

UPDATE infrastructure_request
SET status = 'PENDING'
WHERE status = '1';

UPDATE infrastructure_request
SET status = 'DONE'
WHERE status = '2';

UPDATE infrastructure_request
SET status = 'IN_PROGRESS'
WHERE status = '3';

-- Unset experimental flag for safety
SET enable_experimental_alter_column_type_general = false;
