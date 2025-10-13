# 14. Super Admin Role

 Date: 2023-02-13

 ## Status

 Accepted

 ## Context
 Currently there is no way to perform developer/administrative tasks across all data.

 ## Decision
 We'll introduce a role called `ROLE_SUPER_ADMIN`. Only people with `ROLE_SUPER_ADMIN` can add this role
 to other accounts.

 ## Consequences
 If someone were able to maliciously gain access to this role, they'd have full access to our entire system.

- I'd like to eventually add audit logs to track what people are updating in the app
- I'd like to send out periodic emails about who has `ROLE_SUPER_ADMIN`