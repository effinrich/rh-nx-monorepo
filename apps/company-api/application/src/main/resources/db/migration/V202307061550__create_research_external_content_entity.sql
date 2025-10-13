create table research_external_content
(
  id                     int primary key,
  name                   varchar(255),
  email                  varchar(255),
  company                varchar(255),
  type                   varchar(255),
  note_raw               text,
  interview_source       varchar(255),
  associated_entities    jsonb,
  stakeholders           jsonb,
  tags                   jsonb,
  attachments            jsonb,
  href                   varchar(2048),
  note_taker             varchar(255),
  created                timestamptz,
  created_by             varchar(255),
  last_modified          timestamptz,
  last_modified_by       varchar(255),
  note_href              varchar(255),
  authors                jsonb,
  company_api_company_id jsonb
);

create sequence research_external_content_seq start 1 increment 50;
