ALTER TABLE operating_company RENAME TO company;
ALTER TABLE operating_company_members RENAME to company_members;
ALTER TABLE person_request_op_cos RENAME to person_request_companies;
ALTER TABLE person_request_companies RENAME COLUMN op_cos_id to company_id;
ALTER TABLE infrastructure_request RENAME COLUMN op_co_id to company_id;
ALTER SEQUENCE operating_company_seq RENAME TO company_seq;
