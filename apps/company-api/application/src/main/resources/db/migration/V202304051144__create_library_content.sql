CREATE TABLE library_content (
  id int,
  api_id varchar(255),
  type varchar(255) NOT NULL,
  title varchar(255),
  description varchar(255),
  path varchar(255),
  remote_content_source varchar(255),
  remote_content_id varchar(255),
  created timestamptz,
  created_by varchar(255),
  last_modified timestamptz,
  last_modified_by varchar(255),
  PRIMARY KEY (id),
  UNIQUE (api_id)
);

CREATE SEQUENCE library_content_seq START 1 INCREMENT 50;
