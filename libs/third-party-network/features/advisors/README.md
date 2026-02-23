# third-party-network-features-advisors

Feature library for the **Advisor Network** — a browsable directory of third-party advisors integrated into the Redesign Health platform.

## Key Components

- `AdvisorList` — searchable, filterable grid of advisor cards
- `AdvisorCard` — card displaying advisor bio, expertise, and action menu (view bio, request introduction, request contract)
- `AdvisorDetail` — full advisor profile page
- `IntroductionRequest` — modal/form for requesting an introduction to an advisor

## Data

API calls go through `libs/third-party-network/data-assets`. Advisor data is sourced from the Company API and Jira integration.

## Running Tests

```bash
nx test third-party-network-features-advisors
```
