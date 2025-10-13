-- See ADR 15 "Use Pooled Database Sequences"
create sequence operating_company_seq start 1 increment 50;
select setval('operating_company_seq', nextval('hibernate_sequence'));

create sequence person_seq start 1 increment 50;
select setval('person_seq', nextval('hibernate_sequence'));

create sequence infrastructure_request_seq start 1 increment 50;
select setval('infrastructure_request_seq', nextval('hibernate_sequence'));

create sequence person_request_seq start 1 increment 50;
select setval('person_request_seq', nextval('hibernate_sequence'));

create sequence request_form_seq start 1 increment 50;
select setval('request_form_seq', nextval('hibernate_sequence'));

create sequence role_seq start 1 increment 50;
select setval('role_seq', nextval('hibernate_sequence'));

create sequence task_history_seq start 1 increment 50;
select setval('task_history_seq', nextval('hibernate_sequence'));
