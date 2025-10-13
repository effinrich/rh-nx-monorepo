# 18. Store Enums as Strings

Date: 2023-02-16

## Status

Accepted

## Context

Hibernate by default stores enums as integers. This is great for storage, but it's
brittle when it comes to adding and reordering enums in our entities. 

| my_enum |
|---------|
| 1       |

## Decision

We will use strings to represent our enums in our database.

| my_enum |
|-----------|
| AWAITING_SUBMISSION |

This requires enum entity fields to be marked with the following annotation:
```java
@Entity
public class Entity {
    @Enumerated(STRING)
    private MyEnum fieldName;
}
```

This will also allow us to move away from enums for a field if we need more flexibility.

## Consequences
Cockroach stores number values at variable lengths, and we'll probably always have values < 10.
Enum numbers will take up ~1 byte of space.
Strings take up ~1 byte per character (Cockroach uses Unicode encoding but doesn't specify storage estimates). A string value of `IN_PROGRESS` will take ~10 bytes per row. That's a 10x increase in storage.
