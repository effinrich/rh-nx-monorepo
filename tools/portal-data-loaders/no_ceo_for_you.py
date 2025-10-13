import requests
import csv
import sys
import pprint
import os
import json

base_url = os.getenv('BASE_URL')
if not base_url:
    raise Exception('Need BASE_URL')
jwt = os.getenv('JWT')
if not jwt:
    raise Exception('Need JWT')
with open(sys.argv[1], 'r') as f:
    data = list(csv.DictReader(f))


def get_person(email):
    print(f'GET /person/{email}')
    headers = {'Authorization': 'Bearer ' + jwt}
    response_person = requests.get(base_url + '/person/' + email, headers=headers)
    print(response_person.status_code)
    # print(response_person.text)
    if response_person.status_code != 200:
        return None
    response_dict = response_person.json()
    return response_dict


def clean_ceo_data(user):
    user['email'] = user['email'].strip()
    if len(user['businessType']) == 0:
        user['businessType'] = 'B2B'
    for field in ['businessFocusArea', 'customerSegment', 'marketServiceArea']:
        if len(user[field].strip()) == 0:
            field_as_list = []
        else:
            field_as_list = user[field].split(', ')
        user[field] = field_as_list
    # pprint.pprint(user)


def post_rh_ceo(user):
    print(f'POST /ceos')
    headers = {'Authorization': 'Bearer ' + jwt}
    response_ceo = requests.post(base_url + '/ceos', headers=headers, json=user)
    # print(response_ceo.text)
    print(response_ceo.status_code)
    if (response_ceo.status_code != 201):
        print(response_ceo.text)
        pprint.pprint(user)
    print('')


def put_rh_ceo(user, ceo_id):
    print(f'PUT /ceos/{user["email"]}/{ceo_id}')
    headers = {'Authorization': 'Bearer ' + jwt}
    response_ceo = requests.put(base_url + '/ceos/' + ceo_id, headers=headers, json=user)
    # print(response_ceo.text)
    print(response_ceo.status_code)
    if (response_ceo.status_code != 200):
        print(response_ceo.text)
        pprint.pprint(user)
    print('')


def put_rh_user(email, given_name, family_name):
    print(f'PUT /person/{email}')
    headers = {'Authorization': 'Bearer ' + jwt}
    response_person = requests.put(base_url + '/person/' + email, json={
        'givenName': given_name.capitalize(),
        'familyName': family_name.capitalize()
    }, headers=headers)
    # print(response_person.text)
    print(response_person.status_code)
    print(f'PUT /person/{email}/role/RH_USER')
    headers = {'Authorization': 'Bearer ' + jwt}
    response_role = requests.put(base_url + '/person/' + email + '/role/ROLE_RH_USER', headers=headers)
    print(response_role.status_code)
    print('')


# pprint.pprint(data)

def insert_test_person_for_email(user):
    """
    Mutates the user's email domain to example.com, makes up single letter first and last names
    Only use on dev! The real users already exist on prod
    """
    user['email'] = user['email'].split('@')[0] + '@example.com'
    person = get_person(user['email'].strip())
    if not person:
        test_given_name = user['email'][0].capitalize()
        test_family_name = user['email'][1].capitalize()
        put_rh_user(user['email'], test_given_name, test_family_name)


for user in data:
    # insert_test_person_for_email(user)
    clean_ceo_data(user)
    person = get_person(user['email'])
    is_already_top_dog = person['ceoInfo']['ceo']
    if is_already_top_dog:
        put_rh_ceo(user, person['ceoInfo']['id'])
    else:
        print(f'Big promotion for {user["email"]}')
        post_rh_ceo(user)
