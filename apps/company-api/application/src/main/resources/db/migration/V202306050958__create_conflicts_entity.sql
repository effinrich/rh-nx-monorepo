CREATE TABLE company_conflicts (
  id int8,
  member_of_id int8,
  company_conflicts_id int8,
PRIMARY KEY (id)
);
CREATE SEQUENCE company_conflicts_seq START 1 INCREMENT 50;
