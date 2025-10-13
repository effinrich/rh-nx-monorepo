create table research_external_content_companies(
  research_external_content_id INT references research_external_content,
  companies_id INT references company,
  primary key (research_external_content_id, companies_id)
);
