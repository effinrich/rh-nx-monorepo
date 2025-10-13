-- Expert Notes
-- Related ticket: https://redesignhealth.atlassian.net/browse/PUD-393

-- DELETE old company references for Expert Notes with more than 3 Company references
DELETE FROM expert_note_companies
WHERE expert_note_id in (
  SELECT id FROM expert_note
  WHERE jsonb_array_length(company_api_company_id) > 3
);

-- Insert single 'Redesign Health' (id:PHIvQQI1) Theme reference into relationship table for each expert note
INSERT INTO expert_note_companies (expert_note_id, company_id)
SELECT expert_note.id as expert_note_id, c.id as company_id FROM expert_note, company c
WHERE c.api_id = 'PHIvQQI1'
  AND
    expert_note.id in (SELECT en.id as expert_note_id
                       FROM expert_note en,
                            company c
                       where c.api_id in (SELECT (jsonb_array_elements_text(en.company_api_company_id)))
                       GROUP BY en.id
                       HAVING count(en.id) > 3
  );

-- Update API ids to Redesign Health Theme
UPDATE expert_note
SET company_api_company_id = '["PHIvQQI1"]'
WHERE jsonb_array_length(company_api_company_id) > 3;
