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
Content-Length: 394

{
  "name" : "Ever/body",
  "id" : "t1mtzCBy",
  "number" : 1111,
  "legalName" : "Ever/body Inc.",
  "description" : "Cosmetic dermatology for every tone, texture, age, gender, and body.",
  "members" : [ ],
  "links" : [ {
    "rel" : "self",
    "href" : "http://localhost:8080/op-co/t1mtzCBy"
  }, {
    "rel" : "members",
    "href" : "http://localhost:8080/op-co/t1mtzCBy/members"
  } ]
}
```