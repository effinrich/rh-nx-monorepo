import requests
import csv
import sys
import pprint
import os

base_url = os.getenv('BASE_URL')
if not base_url:
    raise Exception('Need BASE_URL')
jwt = os.getenv('JWT')
if not jwt:
    raise Exception('Need JWT')
with open(sys.argv[1], 'r') as f:
    data = list(csv.DictReader(f))


def put_rh_user(email, given_name, family_name):
    print(email)
    headers = {'Authorization': 'Bearer ' + jwt}
    response_person = requests.put(base_url + '/person/' + email, json={
        'givenName': given_name.capitalize(),
        'familyName': family_name.capitalize()
    }, headers=headers)
    print(response_person.text)
    print(response_person.status_code)
    response_role = requests.put(base_url + '/person/' + email + '/role/ROLE_RH_USER', headers=headers)
    print(response_role.status_code)
    print('')


fake_list = [{
    '': '',
    'Email': 'philip.poley@redesignhealth.com',
    'First name': 'Philip',
    'Last name': 'Poley'
}]

# pprint.pprint(fake_list)

for user in fake_list:
    put_rh_user(user['Email'], user['First name'], user['Last name'])
