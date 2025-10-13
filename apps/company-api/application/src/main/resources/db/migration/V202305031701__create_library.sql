CREATE TABLE library (
  id int,
  api_id varchar(255),
  display_name varchar(255),
  PRIMARY KEY (id),
  UNIQUE (api_id)
);

CREATE SEQUENCE library_seq START 1 INCREMENT 50;
