# 14. SQL TIMESTAMP data type

Date: 2023-01-17

## Status

Accepted

## Context

We currently use the [TIMESTAMP](https://www.cockroachlabs.com/docs/stable/timestamp.html) data type in CockroachDB. This data type does not include timezone related information and is assumed to be UTC.

There's currently a problem with our Hibernate implementation getting confused by this data type and causing information to be stored in local time vs. UTC. This bug only appears on machines where the system clock is not UTC (e.g. my laptop).

## Decision

We will use [TIMESTAMPTZ](https://www.cockroachlabs.com/docs/stable/timestamp.html) by default when creating new datetime columns.

This is also recommended by CockroachDB's team.

> ### Best practices
>
> We recommend always using the TIMESTAMPTZ variant because the TIMESTAMP variant can sometimes lead to unexpected behaviors when it ignores a session offset. However, we also recommend you avoid setting a session time zone offset for your database.

## Consequences

- Size considerations: Both `TIMESTAMP` and `TIMESTAMPTZ` take up 12 bytes of space
- Migration: We will have to blow away all of our current `TIMESTAMP` columns. CockroachDB doesn't have
  support out of the box for migrating columns ([Github issue](https://github.com/cockroachdb/cockroach/issues/49329?version=v22.2)). Luckily these
  `TIMESTAMP` columns are only used for auditing and we aren't in production yet ([see migration here](../../../application/src/main/resources/db/migration/V202301171154__convert_timezone_to_timezonez.sql)).
