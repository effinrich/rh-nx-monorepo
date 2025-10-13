# 19. JSON Schema Library

Date: 2023-02-22

## Status

Accepted

## Context

We've been looking for a tool that will allow us to maintain dynamic forms,
while also giving us type safety. This discussion started after we realized the backend and frontend both needed to understand the shape of our form results: https://redesignhealth.atlassian.net/wiki/x/AQBlCw

## Decision

We've landed on an open standard called [JSON Schema](https://json-schema.org). It
gives us a way to add type safety to our form results. Libraries such as [JSON Forms](https://jsonforms.io), [react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/), and [OpenAPI](https://swagger.io/docs/specification/data-models/keywords/) all leverage this schema.

We will use the [json-schema-validator](https://github.com/networknt/json-schema-validator) on the backend to validate incoming schemas and results. We chose this library as it had the most Users, Contributors, and most recent release on GitHub.

## Consequences
We are adding another library we'll need to maintain version upgrade with.
