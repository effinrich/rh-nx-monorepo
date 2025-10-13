ALTER TABLE research ADD COLUMN api_id varchar(255) UNIQUE;
ALTER TABLE research ADD COLUMN company_id int references company;

ALTER TABLE research RENAME COLUMN sprint_name to title;
ALTER TABLE research RENAME COLUMN research_methods_sub to specialized_methods;

ALTER TABLE research DROP COLUMN sprint_order;
ALTER TABLE research DROP COLUMN opco_spr_new;
ALTER TABLE research DROP COLUMN insights_leads;
ALTER TABLE research DROP COLUMN url_spr;
