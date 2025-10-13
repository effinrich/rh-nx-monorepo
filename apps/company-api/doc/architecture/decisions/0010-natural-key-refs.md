# 10. Natural key refs

Date: 2022-11-14

## Status

Accepted

## Context

Many of our tables leverage natural keys instead of primary keys to avoid leaking database details through our API.
These natural keys are passed around as raw types (string, int, etc.). 
```java
// Example of raw natural key
public Person getPerson(String email) {
    return repo.findByEmail(email);
}
```

## Decision

I'd like to start leveraging `refs` to give context when natural keys are used.

Here are some benefits
 - sanitization on initialization - (e.g. lowercase emails)
 - type-safety when using natural keys as parameters (e.g. `public void method(Ref key)` vs `public void method(String key)`)
 - consistent path parameter naming (e.g. `/company/{opCoSlug}` and `/infra-request/{opCoSlug}`)
 - look up usage of natural keys throughout the code (e.g. show me everywhere emails are being used in the code)
```java

public Person getPerson(PersonRef personRef);
```

## Consequences

1. Our code will be more verbose at times with creating refs
```java

public Person getPerson(String email)  {
    return repo.findPersonByEmail(PersonRef.of(email));
}
```
2. We'll have to maintain a translation/converter between database column and DAO column. We'll leverage `AttributeConverters` for this
