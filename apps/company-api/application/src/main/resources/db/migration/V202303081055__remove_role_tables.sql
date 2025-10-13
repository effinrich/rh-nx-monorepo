ALTER TABLE person ADD COLUMN role varchar(255);

-- Set person role with value from join table
UPDATE person p
SET role = r.authority
FROM person_roles pr, role r
WHERE p.id = pr.person_id AND pr.roles_id = r.id;

ALTER TABLE person_request ADD COLUMN role varchar(255);

-- Update person_request role with value from join table
UPDATE person_request pr
SET role = r.authority
FROM person_request_roles prr, role r
WHERE pr.id = prr.person_request_id AND prr.roles_id = r.id;

DROP TABLE person_roles;
DROP TABLE person_request_roles;
DROP TABLE role;
