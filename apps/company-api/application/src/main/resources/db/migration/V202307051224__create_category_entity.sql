CREATE TABLE category(
  id INT,
  name varchar(256) NOT NULL,
  api_id varchar(256),
  created TIMESTAMPTZ,
  created_by VARCHAR(255),
  last_modified TIMESTAMPTZ,
  last_modified_by VARCHAR(255),
  PRIMARY KEY(id),
  UNIQUE(name)
);

create sequence category_seq start 1 increment 50;
