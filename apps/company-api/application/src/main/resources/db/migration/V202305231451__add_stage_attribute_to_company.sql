CREATE TYPE stage AS ENUM ('THEME', 'CONCEPT', 'NEW_CO', 'OP_CO');
ALTER TABLE company ADD COLUMN stage stage;

