-- Expert Notes
INSERT INTO expert_note_companies (expert_note_id, company_id)
SELECT en.id as expert_note_id, c.id as company_id FROM expert_note en, company c
where c.api_id in (SELECT (jsonb_array_elements_text(en.company_api_company_id)));

-- Research Articles
INSERT INTO research_external_content_companies (research_external_content_id, companies_id)
SELECT en.id as research_external_content_id, c.id as companies_id FROM research_external_content en, company c
where c.api_id in (SELECT (jsonb_array_elements_text(en.company_api_company_id)));
