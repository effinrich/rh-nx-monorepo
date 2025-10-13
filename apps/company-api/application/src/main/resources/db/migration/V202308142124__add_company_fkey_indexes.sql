-- Recommendation From CockroachDB about `RETRY_SERIALIZABLE` errors

-- Add indexes for foreign key references to a company
-- These are all checked during DELETE FROM company to check for
-- referential integrity
CREATE INDEX ON company (linked_api_id);
CREATE INDEX ON company_conflicts (company_conflicts_id);
CREATE INDEX ON company_vendor (company_id);
CREATE INDEX ON expert_note_companies (company_id);
CREATE INDEX ON research_external_content_companies(companies_id);
CREATE INDEX ON research (company_id);

-- Add index for looking up a Person's membership to companies
CREATE INDEX ON company_members (members_id);
