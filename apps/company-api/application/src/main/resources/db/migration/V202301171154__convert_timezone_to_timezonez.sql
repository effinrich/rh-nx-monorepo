ALTER TABLE person DROP COLUMN created;
ALTER TABLE person DROP COLUMN last_modified;
ALTER TABLE person ADD COLUMN created timestamptz DEFAULT now();
ALTER TABLE person ADD COLUMN last_modified timestamptz DEFAULT now();

ALTER TABLE operating_company DROP COLUMN created ;
ALTER TABLE operating_company DROP COLUMN last_modified;
ALTER TABLE operating_company ADD COLUMN created timestamptz DEFAULT now();
ALTER TABLE operating_company ADD COLUMN last_modified timestamptz DEFAULT now();

ALTER TABLE infrastructure_request DROP COLUMN created;
ALTER TABLE infrastructure_request DROP COLUMN last_modified;
ALTER TABLE infrastructure_request ADD COLUMN created timestamptz DEFAULT now();
ALTER TABLE infrastructure_request ADD COLUMN last_modified timestamptz DEFAULT now();

ALTER TABLE request_form DROP COLUMN created;
ALTER TABLE request_form DROP COLUMN last_modified;
ALTER TABLE request_form ADD COLUMN created timestamptz DEFAULT now();
ALTER TABLE request_form ADD COLUMN last_modified timestamptz DEFAULT now();

ALTER TABLE person_request DROP COLUMN created;
ALTER TABLE person_request DROP COLUMN last_modified;
ALTER TABLE person_request ADD COLUMN created timestamptz DEFAULT now();
ALTER TABLE person_request ADD COLUMN last_modified timestamptz DEFAULT now();
