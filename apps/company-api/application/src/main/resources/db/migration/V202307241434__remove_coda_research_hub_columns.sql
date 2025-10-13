-- Expert Note uses note_taker instead of authors
ALTER TABLE expert_note DROP COLUMN authors;

-- Research Exteranl Content uses created_by instead of note_taker
UPDATE research_external_content
SET created_by = note_taker;
ALTER TABLE research_external_content DROP COLUMN note_taker;

-- Research External Content uses href instead of note_href
ALTER TABLE research_external_content DROP COLUMN note_href;
