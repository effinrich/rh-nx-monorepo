ALTER TABLE company ADD COLUMN has_platform_agreement BOOL;
Update company set has_platform_agreement = false where has_platform_agreement is NULL;
