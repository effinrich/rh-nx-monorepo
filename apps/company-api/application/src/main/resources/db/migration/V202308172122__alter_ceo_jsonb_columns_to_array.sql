ALTER TABLE ceo DROP COLUMN customer_segment;
ALTER TABLE ceo DROP COLUMN business_focus_area;

ALTER TABLE ceo
  ADD COLUMN customer_segment ceo_customer_segment[],
  ADD COLUMN business_focus_area  ceo_business_focus_area[];

