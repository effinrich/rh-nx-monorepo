# portal-features-research-hub

Feature library for the **Research Hub** section of the Platform Portal. Provides research sprint reports, call notes, and associated file management.

## Key Components

- `ResearchHubPage` — tabbed view of research sprints and call notes
- `ResearchSprintForm` — form for creating / editing research sprint reports
- `CallNotesForm` — form for creating / editing call notes with drag-and-drop file upload
- `AddResearchMenu` — dropdown to add a new research sprint or call notes entry

## Consumed By

`apps/portal` at the `/research-hub` route.

## Running Tests

```bash
nx test portal-features-research-hub
```
