# 4. Database Migration Tool

Date: 2022-09-26

## Status

Accepted

## Context

We need a way to document database changes and have them applied automatically to any environment.

## Decision

We will use [Flyway](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/html/howto-database-initialization.html#howto-execute-flyway-database-migrations-on-startup) moving forward.

### Migration Directory
Each migration will live in `src/resources/db/migration`

### File Format
`V<version>__<name>.sql`
* `version` is a timestamp in the format YYYYMMDDHHMM.
```bash
$ date +%Y%m%d%H%M
```
* `name` will be a kabab-case descriptor (ex. `create-doctor-table`)

Example file: `V202210011654__create-doctor-table.sql`

## Consequences

We will no longer leverage hibernates [ddl-auto](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/html/howto-database-initialization.html#howto-initialize-a-database-using-hibernate). This means some of our JPA annotations might get out of sync with our underlying database. For the most part, hibernate should warn us when there is a mismatch between our ORM and datastore.
