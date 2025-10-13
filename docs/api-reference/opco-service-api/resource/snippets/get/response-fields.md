Path | Type | Description
---- | ---- | -----------
`id` | `String` | Base62 encoded identifier
`name` | `String` | Internal name/shorthand for legal name
`legalName` | `String` | Official name of corporation
`number` | `Number` | Used for placeholder shell entity name until legal name exists (i.e. RH Studio 2 OpCo [#], Inc.)
`description` | `String` | Long-form copy about the company
`members` | `Array` | People with access to this company (requires ?expand=members)
`created` | `String` | Format: ISO 8601 timestamp.
`lastModified` | `String` | Format: ISO 8601 timestamp. When entity was last updated.
`links` | `Array` | Links to other resources
