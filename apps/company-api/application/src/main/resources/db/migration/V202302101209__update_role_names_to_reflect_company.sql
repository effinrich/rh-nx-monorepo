UPDATE role
SET display_name = 'Company User'
WHERE authority = 'ROLE_OP_CO_USER';

UPDATE role
SET display_name = 'Company Contractor'
WHERE authority = 'ROLE_OP_CO_CONTRACTOR';
