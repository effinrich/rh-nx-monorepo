CREATE TABLE person_request (
    id INT8, 
    email VARCHAR(255),
    given_name VARCHAR(255),
    family_name VARCHAR(255),
    jira_issue_id VARCHAR(255),
    status SMALLINT,
    created TIMESTAMP,
		created_by VARCHAR(255) REFERENCES person(email),
		last_modified TIMESTAMP,
		last_modified_by VARCHAR(255) REFERENCES person(email),
    PRIMARY KEY (id),
    UNIQUE (jira_issue_id)
);

CREATE TABLE person_request_roles (
  person_request_id INT8 REFERENCES person_request,
  roles_id INT8 REFERENCES role,
  PRIMARY KEY (person_request_id, roles_id)
);

CREATE TABLE person_request_op_cos (
  person_request_id INT8 REFERENCES person_request,
  op_cos_id INT8 REFERENCES operating_company,
  PRIMARY KEY (person_request_id, op_cos_id)
);
