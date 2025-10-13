ALTER TABLE ceo
  ADD column created TIMESTAMPTZ,
  ADD column created_by VARCHAR(255),
  ADD column last_modified TIMESTAMPTZ,
  ADD column last_modified_by VARCHAR(255);
