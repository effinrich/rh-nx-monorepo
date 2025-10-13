# 20. Store roles in memory

Date: 2023-03-08

## Status

Accepted

## Context

The `role` system was originally written to be backed by a SQL table called `role`.
This would allow us to dynamically update roles as needed. This had some unintended consequences.

1. Anytime a `display_name` needed to be updated, this could not be done through a data update. This was due to how our database was seeded. When a new DB was built, the old `display_names` were used. When automated tests are run, they use a fresh instance of the database. This led to needing a new migration script anytime an update was needed.
2. Calls to get a person's roles required an extra join/database call. Storing this in code allows us to speed up this operation. This is important as roles are required to authenticate requests.
3. We currently allow people to have `n` number of roles assigned to them. The original idea was to have roles per OpCo. We have since moved away from this system and now use an OpCo membership check.

## Decision

1. Roles will now be stored in code via [RoleAuthority](../../../application/src/main/java/com/redesignhealth/company/api/entity/request/RoleAuthority.java).
2. `person` and `person_request` tables will only allow one role to be assigned.
3. `roles` will always be included on `person` resource requests and `expand=roles` will do nothing.

## Consequences

1. The API interface will continue to use `role[]` until we can migrate the frontend to `role`. Making this move will simplify a lot of frontend code making `person.roles[0].displayName` type logic.
