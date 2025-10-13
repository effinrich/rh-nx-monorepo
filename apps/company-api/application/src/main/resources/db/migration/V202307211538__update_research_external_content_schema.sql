ALTER TABLE research_external_content ADD COLUMN api_id varchar(255) UNIQUE;
ALTER TABLE research_external_content ADD COLUMN attachment_disclaimer_accepted boolean;

ALTER TABLE research_external_content DROP COLUMN email;
ALTER TABLE research_external_content DROP COLUMN company;
ALTER TABLE research_external_content DROP COLUMN note_raw;
ALTER TABLE research_external_content DROP COLUMN interview_source;
ALTER TABLE research_external_content DROP COLUMN associated_entities;
ALTER TABLE research_external_content DROP COLUMN authors;

ALTER TABLE research_external_content RENAME COLUMN name TO title;
