```bash
$ curl 'http://localhost:8080/op-co' -i -X POST \
    -H 'Content-Type: application/json;charset=UTF-8' \
    -d '{
  "number" : 1111,
  "legalName" : "Ever/body Inc.",
  "name" : "Ever/body",
  "description" : "Cosmetic dermatology for every tone, texture, age, gender, and body."
}'
```