# 11. API ID Generator

Date: 2022-11-16

## Status

Accepted

## Context

Today we represent OpCo's with a slug (e.g. Ever/Body has a slug `ever-body`)

Unfortunately, OpCo names change sometime around funding. We cannot rely on this name as a unique identifier. 
Companies and employees might be confused having a slug with an old name.

OpCos have numbers assigned to them, but we've been asked by security not to expose these as keys.

Also, we'd like to hide table primary keys from API users in case we ever move our data to another store.

## Decision

We need to find a keying solution that is easy to use, has low chance of collisions, and is performant.

I'd like to move forward with an ID system similar to TinyURL IDs and Youtube video IDs.

We will generate unique [Base62](https://en.wikipedia.org/wiki/Base62) IDs. These IDs will be susceptible to collisions and we'll
need to choose a length to avoid collisions. We will use length `8` for now. We can ballpark the [chance of a collision](https://preshing.com/20110504/hash-collision-probabilities/) with the equation
```
(chance of collision) = (number of entities)^2 / (2 * (number of possible ids))
```

We'll estimate we'll never have more than `10,000` companies made and a Base62 string of length 8 has `62^8` possible values.

```
2 x 10^-7 chance of collision <- less than the chance of being struck by lightning
```

As a backup, we'll query the database for collisions and generate new IDs if this occurs. We'll log when collisions happen to 
monitor if we need to increase the key size.
## Consequences

We lose context of what our ids represent. What does `a2JkxQQl` represent compared to `ever-body`?
I'd like to move towards a human-readable format in the future. This format will need to allow slugs to change and be
forwarded for backwards compatibility. Github does this in a sensible way when you change the name
of your repository.