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
Content-Length: 543

{
  "name" : "DOUS",
  "id" : "1KlMnh9a",
  "number" : 1111,
  "legalName" : "Dous Living, Inc.",
  "description" : "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
  "created" : "1970-01-01T00:00:00Z",
  "lastModified" : "1970-01-01T00:00:00Z",
  "links" : [ {
    "rel" : "self",
    "href" : "http://localhost:8080/op-co/1KlMnh9a"
  }, {
    "rel" : "members",
    "href" : "http://localhost:8080/op-co/1KlMnh9a/members"
  } ]
}
```