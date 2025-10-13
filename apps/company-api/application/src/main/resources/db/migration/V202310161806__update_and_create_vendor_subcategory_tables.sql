ALTER TABLE company_vendor_subcategories RENAME TO vendor_subcategories;
ALTER TABLE vendor_subcategories RENAME COLUMN company_vendor_id to vendor_id;

CREATE TABLE company_vendor_subcategories(
   company_vendor_id INT references company_vendor,
   subcategory_id INT references subcategory,
   primary key (company_vendor_id, subcategory_id)
);
