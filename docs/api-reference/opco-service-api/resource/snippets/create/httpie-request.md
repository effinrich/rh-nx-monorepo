```bash
$ echo '{
  "number" : 1111,
  "legalName" : "Ever/body Inc.",
  "name" : "Ever/body",
  "description" : "Cosmetic dermatology for every tone, texture, age, gender, and body."
}' | http POST 'http://localhost:8080/op-co' \
    'Content-Type:application/json;charset=UTF-8'
```