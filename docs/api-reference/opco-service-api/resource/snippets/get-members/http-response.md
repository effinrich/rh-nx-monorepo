```http
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Content-Type: application/json
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
X-Frame-Options: DENY
Content-Length: 1030

{
  "links" : [ {
    "rel" : "opCo",
    "href" : "http://localhost:8080/op-co/1KlMnh9a"
  } ],
  "content" : [ {
    "email" : "test@redesignhealth.com",
    "givenName" : "Terra",
    "familyName" : "Branford",
    "roles" : [ {
      "authority" : "ROLE_OP_CO_USER",
      "displayName" : "OpCo User"
    } ],
    "memberOf" : [ {
      "name" : "Springtide",
      "id" : "1KlMnh9a",
      "number" : 1111,
      "legalName" : "Springtide Child Development, Inc.",
      "description" : "The integrated, evidence-based autism center that seeks to transform the way families receive care.",
      "created" : "1970-01-01T00:00:00Z",
      "lastModified" : "1970-01-01T00:00:00Z",
      "links" : [ {
        "rel" : "self",
        "href" : "http://localhost:8080/op-co/1KlMnh9a"
      }, {
        "rel" : "members",
        "href" : "http://localhost:8080/op-co/1KlMnh9a/members"
      } ]
    } ],
    "links" : [ {
      "rel" : "self",
      "href" : "http://localhost:8080/person/test@redesignhealth.com"
    } ]
  } ]
}
```