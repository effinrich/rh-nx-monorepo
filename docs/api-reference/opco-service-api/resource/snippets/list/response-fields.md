Path | Type | Description
---- | ---- | -----------
`content` | `Array` | List of OpCos
`links` | `Array` | Links to other resources
`content[].id` | `String` | Base62 encoded identifier
`content[].name` | `String` | Internal name/shorthand for legal name
`content[].legalName` | `String` | Official name of corporation
`content[].description` | `String` | Long-form copy about the company
`content[].members` | `Array` | People with access to this company (requires ?expand=members)
`content[].created` | `String` | Format: ISO 8601 timestamp.
`content[].lastModified` | `String` | Format: ISO 8601 timestamp. When entity was last updated.
`page.size` | `Number` | Requested page size
`page.number` | `Number` | Page number
`page.totalElements` | `Number` | Number of elements in the database
`page.totalPages` | `Number` | Number of pages available to scan
