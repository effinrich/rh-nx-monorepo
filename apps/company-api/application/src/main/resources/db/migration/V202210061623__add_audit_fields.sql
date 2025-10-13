ALTER TABLE operating_company ADD COLUMN created TIMESTAMP;
ALTER TABLE operating_company ADD COLUMN created_by VARCHAR(255) REFERENCES person(email);
ALTER TABLE operating_company ADD COLUMN last_modified TIMESTAMP;
ALTER TABLE operating_company ADD COLUMN last_modified_by VARCHAR(255) REFERENCES person(email);

ALTER TABLE person ADD COLUMN created TIMESTAMP;
ALTER TABLE person ADD COLUMN created_by VARCHAR(255) REFERENCES person(email);
ALTER TABLE person ADD COLUMN last_modified TIMESTAMP;
ALTER TABLE person ADD COLUMN last_modified_by VARCHAR(255) REFERENCES person(email);
