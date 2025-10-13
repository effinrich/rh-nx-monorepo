# 12. Date Field Format ISO 8601

Date: 2022-11-22

## Status

Accepted

## Context

We are starting to support Date fields in our API and we need to decide on a format.

## Decision

We will use [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) moving forward. This will be used both in request
and response bodies.
```json
{
  "created": "1970-01-01T00:00:00Z"
}
```
The reason I chose ISO 8601 over [Unix timestamps](https://en.wikipedia.org/wiki/Unix_time) was readibility in API response.
It enables developers to glance at Date fields and understand their value immediately. This could shorten troubleshooting timelines. With
Unix timestamps, a conversion is neccessary to understand the underlying date.

## Consequences
* Payload is slightly bigger with a string vs. 64-bit number
* Conversion may be more challenging depending on ISO 8601 support by programming language