ALTER TABLE expert_note
  add column api_id VARCHAR(256);
ALTER TABLE expert_note
  add column attachment_disclaimer_accepted BOOL;
ALTER TABLE expert_note DROP COLUMN associated_entities;
