CREATE TABLE company_vendor_op_co_contact (
  company_vendor_id INT REFERENCES company_vendor(id),
  company_id INT REFERENCES company(id),
  contact_id INT REFERENCES  person(id),
  willing_to_discuss BOOLEAN,
  UNIQUE(company_vendor_id, company_id, contact_id)
);
