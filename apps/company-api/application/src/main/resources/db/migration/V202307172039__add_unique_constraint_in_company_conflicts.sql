ALTER TABLE company_conflicts
  ADD CONSTRAINT member_company_unique UNIQUE (member_of_id, company_conflicts_id);
