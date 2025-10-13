# 9. expand query parameter

Date: 2022-10-21

## Status

Accepted

## Context

API Clients have one-off use cases for including child entity information while requesting parent objects. 

We want to avoid creating special API calls per business case. GraphQL solves this use case but we don't have the time to spin up a GraphQL server today. 

## Decision

We'll expose a query parameter `?expand` to expand child elements.

Other companies have similar concepts:
* [Atlassian](https://developer.atlassian.com/server/confluence/expansions-in-the-rest-api/)
* [Stripe](https://stripe.com/docs/api/expanding_objects)

If we have have an entity `Person` with the following schema
```
Person {
    memberOf: OperationCompany[] Lazy loaded
    roles: Role[] Eager loaded
}
```

`roles` will always be returned in the API response 
```json
{
    "roles": [{}, {}]
}
```

If a client wants to include `memberOf`, they'd pass the following
`?expand=memberOf`.
```json
{
    "roles": [{}, {}],
    "memberOf": [{}]
}
```
## Consequences

1. We'll need some way to document which expansions are available per entity type. 

2. We'll need to guard against expensive database reads. Giving API clients this flexibility could lead them to doing pretty intense queries. We'll need some way to weigh how expensive queries are and whether we will accept the request from the user.
