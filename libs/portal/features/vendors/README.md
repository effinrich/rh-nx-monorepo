# portal-features-vendors

Feature library for the **Vendor References** section of the Platform Portal. Provides a searchable vendor directory and vendor reference management forms.

## Key Components

- `VendorReferencesPage` — filterable vendor listing
- `VendorDetail` — vendor profile and reference detail view
- `CompanyVendorForm` — form to add or edit a vendor reference, including contract date picker

## Consumed By

`apps/portal` at the `/vendor-references` route.

## Running Tests

```bash
nx test portal-features-vendors
```
