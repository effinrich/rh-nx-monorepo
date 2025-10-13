CREATE TABLE task_history (
  id INT8,
  name VARCHAR(255),
  last_run timestamptz,
  PRIMARY KEY (id),
  UNIQUE (name)
)
