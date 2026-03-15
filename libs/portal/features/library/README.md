# portal-features-library

Feature library for the **Knowledge Library** section of the Platform Portal. Provides a browsable library of solution modules, documents, and resources, with rich HTML content rendering via the `Prose` component.

## Key Components

- `LibraryPage` — categorized solution and document browser
- `SolutionDetail` / `ModuleDetail` — drill-down views for library content
- `Parser` — renders HTML library content with typographic styles

## Consumed By

`apps/portal` at the `/library` route.

## Running Tests

```bash
nx test portal-features-library
```
