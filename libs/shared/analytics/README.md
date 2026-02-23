# @redesignhealth/shared-analytics

Shared Google Analytics 4 event helpers for Redesign Health frontend applications. Wraps `react-ga4` with typed, named event functions that follow the GA4 recommended event schema.

## Usage

```ts
import analytics from '@redesignhealth/shared-analytics'

// Fire a page view
analytics.sendPageView()

// Fire a search event
analytics.sendSearchEvent({
  query: 'health tech',
  filters: [{ field: 'category', value: 'research' }],
  sort: 'relevance'
})

// Fire a select_content event
analytics.sendSelectContentEvent({
  content_type: 'company',
  content_id: 'acme-corp'
})

// Fire a view_item_list event
analytics.sendViewItemListEvent({
  items: [{ item_id: '1', item_name: 'Acme', index: 0, affiliation: 'portal' }]
})

// Fire a custom disclaimer-accept event
analytics.sendDisclaimerAccept({ type: 'BUYER' })
```

## Initialization

Analytics is initialized in the portal entry point (`apps/portal/src/main.tsx`). The `VITE_GA4_MEASUREMENT_ID` environment variable must be set; initialization is skipped if the variable is absent (e.g. in local development without a measurement ID).

```ts
import ReactGA from 'react-ga4'

if (import.meta.env.VITE_GA4_MEASUREMENT_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA4_MEASUREMENT_ID)
}
```

## Structure

```
src/lib/
├── config.ts   # Initialization helpers
├── events.ts   # Named GA4 event functions
└── hooks.ts    # React hooks for analytics
```

## Running Tests

```bash
nx test shared-analytics
```
