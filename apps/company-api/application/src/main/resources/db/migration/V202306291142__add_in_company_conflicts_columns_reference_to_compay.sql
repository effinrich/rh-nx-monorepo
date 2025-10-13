ALTER TABLE company_conflicts
ADD FOREIGN KEY (member_of_id) REFERENCES Company(id);

ALTER TABLE company_conflicts
ADD FOREIGN KEY (company_conflicts_id) REFERENCES Company(id);
