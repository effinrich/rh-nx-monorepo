# 15. Impersonation

Date: 2023-02-13

 ## Status

Accepted

 ## Context

We are unable to test different roles and permissions without access to multiple Google ID/Okta accounts. If a customer is experiencing issues with our tools, we are unable to view the state of their experience.

 ## Decision
Clients can add a `RH-Impersonation-Email` header to make requests on behalf of an email registered in our system.

The impersonation happens top of funnel during the authentication process.
```
Request made -> Decode JWT -> Look up JWT email details -> Check for ROLE_SUPER_ADMIN role -> Look up impersonation email details -> Set impersonation as principal
```
All authorization will be handled on behalf of the impersonated user.

Clients are required to have the `ROLE_SUPER_ADMIN` role.

Clients without sufficient access, but provide the header, will be given a `401`. An alternative is to default to the client's actual email and let the request
pass through. I believe failing the request will help give clients more feedback if they were attempting to impersonate.
```
401
Cannot impersonate {EMAIL} with this level of access
```

## Consequences
- We have no way of auditing whether a `ROLE_SUPER_ADMIN` or the actual customer performed the action. We'll need some way to keep track impersonated requests going forward.
- Requests will require an additional call to the database to look up impersonated details. Since these requests will only be made by super admins, the additional load will be localized to our team.