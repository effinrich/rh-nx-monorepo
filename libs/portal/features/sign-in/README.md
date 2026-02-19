# portal-features-sign-in

Feature library for the **Sign In** flow of the Platform Portal. Provides the login page with Google OAuth integration via the Google Identity Services SDK.

## Key Components

- `SignInPage` — login page with Google One Tap / Sign In With Google button
- Auth callback and session initialization logic

## Consumed By

`apps/portal` at the `/sign-in` route.

## Running Tests

```bash
nx test portal-features-sign-in
```
