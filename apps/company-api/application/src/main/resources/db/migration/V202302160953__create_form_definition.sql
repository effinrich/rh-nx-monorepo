CREATE TABLE form_definition (
  id int,
  type varchar(255),
  schema jsonb,
  PRIMARY KEY (id),
  UNIQUE (type)
);

CREATE SEQUENCE form_definition_seq START 1 INCREMENT 50;
