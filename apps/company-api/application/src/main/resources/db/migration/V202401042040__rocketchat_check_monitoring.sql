CREATE TABLE rocket_chat_check_monitoring
(
  id INT,
  user_id INT REFERENCES person,
  room_id VARCHAR(255),
  last_check TIMESTAMPTZ,
  created TIMESTAMPTZ,
  created_by VARCHAR(255),
  last_modified TIMESTAMPTZ,
  last_modified_by VARCHAR(255),
  primary key (id)
);
create sequence rocket_chat_check_monitoring_seq start 1 increment 50;
