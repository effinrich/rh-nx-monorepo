create table expert_note (
  id                     int primary key,
  interviewee_name       varchar(255),
  interviewee_email      varchar(255),
  interviewee_company    varchar(255),
  type                   varchar(255),
  note_raw               text,
  interview_source       varchar(255),
  associated_entities    jsonb,
  stakeholders           jsonb,
  tags                   jsonb,
  attachments            jsonb,
  note_taker             varchar(255),
  profile_url            varchar(255),
  authors                jsonb,
  created                timestamptz,
  created_by             varchar(255),
  last_modified          timestamptz,
  last_modified_by       varchar(255),
  note_href              varchar(2048),
  company_api_company_id jsonb
);

create sequence expert_note_seq start 1 increment 50;
