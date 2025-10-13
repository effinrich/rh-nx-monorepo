CREATE TABLE company_vendor_subcategories(
  company_vendor_id INT REFERENCES company_vendor(id),
  subcategory_id INT REFERENCES subcategory(id),
  PRIMARY KEY (company_vendor_id, subcategory_id)
);
