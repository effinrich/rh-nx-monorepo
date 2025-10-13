Path | Type | Description
---- | ---- | -----------
`id` | `String` | Base62 encoded identifier
`name` | `String` | Internal name/shorthand for legal name
`description` | `String` | Long-form copy about the company
`legalName` | `String` | Official name of corporation
`number` | `Number` | Used for placeholder shell entity name until legal name exists (i.e. RH Studio 2 OpCo [#], Inc.)
`members` | `Array` | People with access to this company (requires ?expand=members)
`links` | `Array` | Links to other resources
