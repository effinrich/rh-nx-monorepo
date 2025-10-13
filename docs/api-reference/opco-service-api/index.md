
## Authentication 
Authentication is done through the Authorization header using a Json Web Token (JWT) from GoogleID.

JWTs are generated using the OAuth2 authorization_code flow. You’ll need a client_id/client_sercret to generate a JWT yourself. Information on generating a JWT can be found here: https://developers.google.com/identity/protocols/oauth2/native-app

Once a JWT is obtained, you can make requests to the API with the header `Authorization: Bearer JWT`.

```bash
$ curl -h 'Authorization: bearer token.value.goes-here` https://prod-opco-service-api.redesignhealth.com/op-co
```

## Pagination
Each list endpoint (ex. `GET /op-co`) supports pagination.

The following query parameters are used to control results returned:

* `?page` - which page to retrieve (starts at `0`)
* `?size` - how many elements to retrieve

Here's an example of fetching OpCos #21-40

```bash
$ curl {service-host}/op-co?page=1&size=20
```
Metadata about the results will be included in each response

* `size` - the amount of elements fetched (this may be smaller than the `?size` requested)
* `totalElements` - how many elements exist in total
* `totalPages` - how many pages exist based on the requested size
* `number` - the current page you are on (this is the same as `?page`)

```json
{
  "page": {
    "size": 20,
    "totalElements": 200,
    "totalPages": 10,
    "number": 1
  }
}
```

HAL links are included to help you navigate across pages (e.g. if you requested the last elements available, `next` and
`last` will be omitted).  All query parameters are preserved in these links.

```json
{
  "links": [{
    "rel": "first",
    "href": "{service-host}/op-co?page=0&size=20"
  }, {
    "rel": "next",
    "href": "{service-host}/op-co?page=2&size=20"
  }, {
    "rel": "pervious",
    "href": "{service-host}/op-co?page=0&size=20"
  }, {
    "rel": "last",
    "href": "{service-host}/op-co?page=9&size=20"
  }]
}
```

## Field Expansion
Some of our APIs support field expansion for child entities. Each section below will include a list of available expansion
options. Field expansion can be accomplished through the query parameter `?expand`.

```bash
$ curl {service-host}/op-co?expand=members
```

Multiple `?expand` parameters can be provided to expand multiple fields

```bash
$ curl {service-host}/op-co?expand=members&expand=forms
```
