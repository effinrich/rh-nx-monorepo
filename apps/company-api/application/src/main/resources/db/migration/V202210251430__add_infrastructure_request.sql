CREATE TABLE infrastructure_request (
  id int8,
  op_co_id int8 REFERENCES operating_company,
  jira_issue_id VARCHAR(255) UNIQUE,
  status SMALLINT,
  created TIMESTAMP,
  created_by VARCHAR(255) REFERENCES person(email),
  last_modified TIMESTAMP,
  last_modified_by VARCHAR(255) REFERENCES person(email),
  PRIMARY KEY(id),
  UNIQUE(jira_issue_id)
);

CREATE TABLE request_form (
  id INT8,
  type SMALLINT,
  status SMALLINT,
  form JSONB,
  infrastructure_request_id INT8 REFERENCES infrastructure_request,
  created TIMESTAMP,
  created_by VARCHAR(255) REFERENCES person(email),
  last_modified TIMESTAMP,
  last_modified_by VARCHAR(255) REFERENCES person(email),
  PRIMARY KEY (id),
  UNIQUE(type, infrastructure_request_id)
);