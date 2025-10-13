CREATE TABLE company_vendor(
   id INT,
   api_id VARCHAR(255),
   vendor_id INT references vendor,
   company_id INT references company,
   engagement_status COMPANY_VENDOR_ENGAGEMENT_STATUS,
   start_date TIMESTAMPTZ,
   end_date TIMESTAMPTZ,
   created TIMESTAMPTZ,
   created_by VARCHAR(255),
   last_modified TIMESTAMPTZ,
   last_modified_by VARCHAR(255),
   primary key (id),
   UNIQUE (api_id),
   UNIQUE (vendor_id, company_id)
);
