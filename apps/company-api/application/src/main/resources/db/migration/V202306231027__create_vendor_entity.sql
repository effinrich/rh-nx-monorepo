CREATE TABLE vendor (
  vendor_id                   INT PRIMARY KEY NOT NULL,
  name                        VARCHAR(256),
  vendor_agency_contractor    VARCHAR(256),
  category                    VARCHAR(256),
  subcategory                 VARCHAR(256),
  description                 VARCHAR(2048),
  best_way_to_engage          VARCHAR(2048),
  researched_for_which_opcos  VARCHAR(256),
  opcos_using_or_used_vendor  VARCHAR(256),
  pricing                     VARCHAR(2048),
  feedback_from_opcos         VARCHAR(2048),
  pros                        VARCHAR(2048),
  cons                        VARCHAR(2048),
  notes                       VARCHAR(2048),
  features                    VARCHAR(2048),
  created_on                  TIMESTAMPTZ
);
