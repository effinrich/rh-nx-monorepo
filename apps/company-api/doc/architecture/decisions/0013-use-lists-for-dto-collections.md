# 13. Use Lists for DTO Collections

Date: 2022-11-28

## Status

Accepted

## Context

Our OpenAPI definition file adds `uniqueItems=true`([more info](https://swagger.io/docs/specification/data-models/data-types/#uniqueItems)) when `java.util.Set` is used for a field definition.

The following Java code
```java
private Set<Integer> items;
```
Generates the OpenAPI definition snippet
```yml
type: array
items:
  type: integer
uniqueItems: true
```
The above definition, generates the following in Typescript

```typescript
interface MyObject {
    items: Set<int>;
}
```
However, the native Javascript API for `fetch` can't differentiate between `Arrays` and `Sets` when it deserializes JSON.
```typescript
fetch('/my-object').then(res => res.json()).then(console.log);
// { "items": [1 , 2, 3 ,4] <- is this an array or set???
```
This leads to a mismatch in terms of reconciling generated OpenAPI types with `fetch`.


## Decision
We'd either have to
1. recursively go through the Javascript response and convert fields to `Sets`  based on the type definition
2. ignore `uniqueItems` when generating the Typescript types
3. update our OpenAPI definition file to have `uniqueItems=false`

We will leverage `java.util.Lists` in all DTOs to force `uniqueItems=false`.

## Consequences

We lose some context around with fields are allowed to have duplicate entries and which ones
aren't. It seems like it'll be very rare that we'd allow duplicates in any list anyway.

In the future, if OpenAPI generators allow us to ignore `uniqueItems`, we could add the requirement back to the definition
file.

