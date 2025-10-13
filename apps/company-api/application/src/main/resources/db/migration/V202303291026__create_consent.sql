CREATE TABLE consent (
  id int,
  type varchar(255) NOT NULL,
  version varchar(255),
  person_id int references person ON DELETE CASCADE,
  accepted timestamptz,
  created timestamptz,
  created_by varchar(255) references person(email),
  last_modified timestamptz,
  last_modified_by varchar(255) references person(email),
  PRIMARY KEY (id),
  UNIQUE (type, person_id)
);

CREATE SEQUENCE consent_seq START 1 INCREMENT 50;
