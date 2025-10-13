CREATE TABLE subcategory(
   id INT,
   category_id INT REFERENCES category,
   name varchar(256) NOT NULL,
   api_id varchar(256),
   created TIMESTAMPTZ,
   created_by VARCHAR(255),
   last_modified TIMESTAMPTZ,
   last_modified_by VARCHAR(255),
   PRIMARY KEY(id),
   UNIQUE(name)
);

create sequence subcategory_seq start 1 increment 50;
