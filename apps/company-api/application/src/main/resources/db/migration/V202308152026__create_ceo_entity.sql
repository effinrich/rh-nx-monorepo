CREATE TABLE ceo(
  id int,
  api_id varchar(255),
  email varchar(255) NOT NULL REFERENCES person(email),
  picture_href varchar(2048),
  business_type ceo_business_type,
  location varchar(255),
  market_service_area jsonb,
  customer_segment jsonb,
  healthcare_sector ceo_healthcare_sector,
  business_focus_area jsonb,
  bio varchar(2048),
  additional_info varchar(2048),
  visible ceo_visible,
  linkedin_href  varchar(2048),
  PRIMARY KEY(id),
  UNIQUE(email)
);
