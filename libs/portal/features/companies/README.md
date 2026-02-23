# portal-features-companies

Feature library for the **Companies** section of the Platform Portal. Provides the companies listing page, company detail/edit views, and the add-company flow (both RH company and marketplace company variants).

## Key Components

- `CompaniesPage` — paginated, searchable company list
- `CompanyDetail` — view and edit an individual company's profile
- `AddCompanyButton` — dropdown menu for creating a new RH or marketplace company
- Company member and conflict management views

## Consumed By

`apps/portal` at the `/companies` route.

## Running Tests

```bash
nx test portal-features-companies
```
