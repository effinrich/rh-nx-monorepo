# third-party-network-data-assets

Data-layer library for the Third-Party Network (advisor-facing) application. Contains API clients, React Query hooks, and data utilities for advisors and Jira integration.

## Structure

```
src/lib/
├── company-api/   # Company API client for advisor data
└── jira-data/     # Jira integration — data types, fetching utilities, and constants
```

## Usage

```ts
import { useAdvisors } from '@redesignhealth/third-party-network/data-assets'
```

## Running Tests

```bash
nx test third-party-network-data-assets
```
