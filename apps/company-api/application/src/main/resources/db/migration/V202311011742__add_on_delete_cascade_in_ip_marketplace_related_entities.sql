ALTER TABLE ip_marketplace
DROP CONSTRAINT ip_marketplace_company_ip_marketplace_id_fkey;
ALTER TABLE ip_marketplace
  ADD CONSTRAINT ip_marketplace_company_ip_marketplace_id_fkey
    FOREIGN KEY (company_ip_marketplace_id)
      REFERENCES company_ip_marketplace (id)
      ON DELETE CASCADE;

ALTER TABLE ip_marketplace_track
DROP CONSTRAINT ip_marketplace_track_buyer_company_ip_marketplace_id_fkey;
ALTER TABLE ip_marketplace_track
  ADD CONSTRAINT ip_marketplace_track_buyer_company_ip_marketplace_id_fkey
    FOREIGN KEY (buyer_company_ip_marketplace_id)
      REFERENCES company_ip_marketplace (id)
      ON DELETE CASCADE;

ALTER TABLE ip_marketplace_track
DROP CONSTRAINT ip_marketplace_track_buyer_id_fkey;
ALTER TABLE ip_marketplace_track
  ADD CONSTRAINT ip_marketplace_track_buyer_id_fkey
    FOREIGN KEY (buyer_id)
      REFERENCES person (id)
      ON DELETE CASCADE;

ALTER TABLE ip_marketplace_track
DROP CONSTRAINT ip_marketplace_track_ip_marketplace_id_fkey;
ALTER TABLE ip_marketplace_track
  ADD CONSTRAINT ip_marketplace_track_ip_marketplace_id_fkey
    FOREIGN KEY (ip_marketplace_id)
      REFERENCES ip_marketplace (id)
      ON DELETE CASCADE;

ALTER TABLE ip_marketplace_seller
DROP CONSTRAINT ip_marketplace_seller_ip_marketplace_id_fkey;
ALTER TABLE ip_marketplace_seller
  ADD CONSTRAINT ip_marketplace_seller_ip_marketplace_id_fkey
    FOREIGN KEY (ip_marketplace_id)
      REFERENCES ip_marketplace (id)
      ON DELETE CASCADE;

ALTER TABLE ip_marketplace_seller
DROP CONSTRAINT ip_marketplace_seller_seller_id_fkey;
ALTER TABLE ip_marketplace_seller
  ADD CONSTRAINT ip_marketplace_seller_seller_id_fkey
    FOREIGN KEY (seller_id)
      REFERENCES person (id)
      ON DELETE CASCADE;
