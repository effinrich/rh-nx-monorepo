create table research (
  id                     int primary key,
  sprint_order           int not null,
  sprint_name            varchar(255) not null,
  research_objectives    text,
  methods                jsonb,
  opco_spr_new           varchar(255),
  patient_segments       jsonb,
  url_spr                varchar(2048),
  research_services      jsonb,
  research_methods_sub   jsonb,
  topline_segments       jsonb,
  research_sample_size   int,
  team_role              varchar(255),
  insights_leads         jsonb,
  created                timestamptz,
  created_by             varchar(255),
  last_modified          timestamptz,
  last_modified_by       varchar(255),
  document_links         jsonb,
  company_api_company_id varchar(255),
  authors                jsonb
);

create sequence research_seq start 1 increment 50;
