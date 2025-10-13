CREATE TABLE expert_note_companies(
expert_note_id INT references expert_note,
company_id INT references company,
primary key (expert_note_id, company_id)
)
