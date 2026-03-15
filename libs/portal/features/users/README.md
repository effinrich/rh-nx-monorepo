# portal-features-users

Feature library for the **Users** section of the Platform Portal. Provides the users listing page and user profile management.

## Key Components

- `UsersPage` — paginated, searchable list of all platform users
- `UserDetail` — view and edit a user's profile, role, and company membership

## Consumed By

`apps/portal` at the `/users` route.

## Running Tests

```bash
nx test portal-features-users
```
