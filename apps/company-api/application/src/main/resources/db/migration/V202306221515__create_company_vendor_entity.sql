CREATE TYPE company_vendor_engagement_status AS ENUM ('CONSIDERED', 'ACTIVE', 'FORMER');
CREATE TABLE company_vendor (
  id INT,
  company_id INT REFERENCES company,
  vendor_id INT,
  api_id VARCHAR(256),
  name VARCHAR(256),
  category VARCHAR(256),
  sub_category VARCHAR(256),
  status company_vendor_engagement_status,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  willing_to_discuss BOOLEAN,
  created TIMESTAMPTZ,
  created_by VARCHAR(255),
  last_modified TIMESTAMPTZ,
  last_modified_by VARCHAR(255)
);
create sequence company_vendor_seq start 1 increment 50;
