ALTER TABLE ip_marketplace ADD COLUMN status ip_marketplace_status;
UPDATE ip_marketplace set status = 'ACTIVE' where status IS NULL;
