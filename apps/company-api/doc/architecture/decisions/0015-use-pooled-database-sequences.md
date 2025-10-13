# 15. Use Pooled Database Sequences

Date: 2023-01-25

## Status

Accepted

## Context

We currently use a shared `hibernate_sequence` for generating new IDs across all of our tables.

This has two problems
1. Anytime a new entity is created, an additional call is made to get the next value of `hibernate_sequence` for the entity's ID.
```sql
SELECT nextval('hibernate_sequence');
INSERT INTO TABLE table_name VALUES (....);
```

3. The `hibernate_sequence` is shared amongst all tables and is locked when it is requested.
```sql
SELECT nextval('hibernate_sequence');
INSERT INTO TABLE table_name VALUES (....);
SELECT nextval('hibernate_sequence');
INSERT INTO TABLE table_name_2 VALUES (....);
```

## Decision

We will use [pooled](https://vladmihalcea.com/hibernate-hidden-gem-the-pooled-lo-optimizer/) sequences to alleviate problem one.
Each sequence will increment by `50` (this is the default hibernate expects).

We will use separate sequences per entity type to alleviate problem two. Each sequence will have the form
`table_name_seq`. 

Sequences will now be created with the following

```sql
create sequence table_name_seq start 1 increment 50
```

## Consequences
When tables are created/destroyed, we are now responsible for creating/destroying their associated sequence.
```sql
CREATE TABLE table_name (...);
CREATE SEQUENCE table_name_seq START 1 increment 50;
```
```sql
DROP TABLE table_name;
DROP SEQUENCE table_name_seq;
```
