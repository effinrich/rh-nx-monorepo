ALTER TABLE company ADD COLUMN linked_api_id VARCHAR(255) NULL REFERENCES company(api_id);
