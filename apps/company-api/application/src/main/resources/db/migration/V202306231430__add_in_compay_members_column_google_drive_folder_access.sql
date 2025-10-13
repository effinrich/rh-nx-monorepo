ALTER TABLE company_members ADD COLUMN google_drive_folder_access boolean;
UPDATE company_members SET google_drive_folder_access = true;
