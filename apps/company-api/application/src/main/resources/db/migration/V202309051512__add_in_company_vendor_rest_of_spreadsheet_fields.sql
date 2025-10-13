ALTER TABLE company_vendor
ADD COLUMN vendor_type company_vendor_type,
ADD COLUMN vendor_point_contact VARCHAR(256),
ADD COLUMN description TEXT,
ADD COLUMN pros TEXT,
ADD COLUMN pricing TEXT,
ADD COLUMN discount_info TEXT,
ADD COLUMN feedback_from_opcos TEXT,
ADD COLUMN cons TEXT,
ADD COLUMN features TEXT;
