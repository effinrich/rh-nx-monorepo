DROP TABLE company_vendor_op_co_contact;

CREATE TABLE company_vendor_contact (
  id int,
  company_vendor_id INT references company_vendor,
  contact_id INT references person,
  willing_to_discuss BOOL default false,
  UNIQUE (company_vendor_id, contact_id),
  PRIMARY KEY (id)
)

