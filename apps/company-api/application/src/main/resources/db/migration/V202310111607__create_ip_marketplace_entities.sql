CREATE TABLE company_ip_marketplace
(
  activity_type company_ip_marketplace_type,
  company_id INT REFERENCES company,
  id INT,
  organization_type company_ip_marketplace_organization_type,
  region company_ip_marketplace_region,
  created TIMESTAMPTZ,
  created_by VARCHAR(255),
  last_modified TIMESTAMPTZ,
  last_modified_by VARCHAR(255),
  primary key (id)
);
create sequence company_ip_marketplace_seq start 1 increment 50;

CREATE TABLE ip_marketplace(
  id int,
  api_id varchar(255),
  name TEXT,
  company_ip_marketplace_id INT REFERENCES company_ip_marketplace,
  executive_summary TEXT,
  therapeutic_need_or_trends_being_addressed TEXT,
  license_restriction BOOL,
  about_license_restriction TEXT,
  preferred_terms ip_marketplace_preferred_terms[],
  patent_status ip_marketplace_patent_status,
  patent_issue_date TIMESTAMPTZ,
  patent_geographic_validity ip_marketplace_patent_geography_validity[],
  patent_status_other_info TEXT,
  disease TEXT,
  technology_type ip_marketplace_technology_type[],
  specialty ip_marketplace_speciality[],
  organ_of_focus TEXT,
  seller_summary_tech_transfer_approach TEXT,
  responsible_inventor TEXT,
  technology_level_of_maturity ip_marketplace_technology_level_of_maturity[],
  patent_geographic_validity_other TEXT,
  patent_status_href varchar(2048),
  freedom_to_operate_certification  ip_marketplace_freedom_to_operate_certification,
  files JSONB,
  created TIMESTAMPTZ,
  created_by VARCHAR(255),
  last_modified TIMESTAMPTZ,
  last_modified_by VARCHAR(255),
  primary key (id),
  UNIQUE(api_id)
);
create sequence ip_marketplace_seq start 1 increment 50;

CREATE TABLE ip_marketplace_track(
  ip_marketplace_id INT REFERENCES ip_marketplace,
  id INT,
  buyer_company_ip_marketplace_id INT REFERENCES  company_ip_marketplace,
  buyer_id INT REFERENCES person,
  status ip_marketplace_track_contact_info,
  date_requested TIMESTAMPTZ,
  date_released_seller_contact_info TIMESTAMPTZ,
  created TIMESTAMPTZ,
  created_by VARCHAR(255),
  last_modified TIMESTAMPTZ,
  last_modified_by VARCHAR(255),
  primary key (id),
  UNIQUE(ip_marketplace_id, buyer_company_ip_marketplace_id, buyer_id) /*a buyer only can do a request*/
);
create sequence ip_marketplace_track_seq start 1 increment 50;

CREATE TABLE ip_marketplace_seller
(
  ip_marketplace_id INT REFERENCES ip_marketplace,
  id INT,
  seller_id INT REFERENCES person,
  created TIMESTAMPTZ,
  created_by VARCHAR(255),
  last_modified TIMESTAMPTZ,
  last_modified_by VARCHAR(255),
  primary key (id),
  UNIQUE(ip_marketplace_id, seller_id) /*an ip record has an unique seller*/
);
create sequence ip_marketplace_seller_seq start 1 increment 50;




