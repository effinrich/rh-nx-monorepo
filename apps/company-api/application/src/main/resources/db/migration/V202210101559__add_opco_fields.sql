ALTER TABLE operating_company ADD COLUMN legal_name VARCHAR(255);
ALTER TABLE operating_company ADD COLUMN number INT8 UNIQUE;
ALTER TABLE operating_company ADD COLUMN description TEXT;
