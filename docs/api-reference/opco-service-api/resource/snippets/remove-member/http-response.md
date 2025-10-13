```http
HTTP/1.1 200 OK
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Content-Disposition: inline;filename=f.txt
Content-Type: application/json
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Pragma: no-cache
Expires: 0
X-Frame-Options: DENY
Content-Length: 187

{
  "links" : [ {
    "rel" : "members",
    "href" : "http://localhost:8080/op-co/1KlMnh9a/members"
  }, {
    "rel" : "opCo",
    "href" : "http://localhost:8080/op-co/1KlMnh9a"
  } ]
}
```