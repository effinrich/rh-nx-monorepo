import os
import io
import pprint
import json
import requests
import csv
import boto3
import tempfile
from botocore.exceptions import ClientError
import google.oauth2
import google.oauth2.id_token
import google.auth
import google.auth.transport.requests
import googleapiclient.discovery

CONFIG_MAP = {
    'dev': {
        'company-api-base-url': 'https://company-api.dev.redesignhealth.com'
    },
    'staging': {
        'company-api-base-url': 'https://company-api.staging.redesignhealth.com'
    },
    'prod': {
        'company-api-base-url': 'https://company-api.redesignhealth.com'
    },
    'local': {
        'company-api-base-url': 'http://localhost:8080'
    }
}

SVC_ACCT_SECRET_NAME = "km-docs-svc"
SVC_ACCT_APP_NAME = "510999103231-emldsjte0kvs5oee7gtleoqsfhtqc3ge.apps.googleusercontent.com"


class DataLoader():
    def __init__(self, sheet_id) -> None:
        self.aws_account = os.getenv("AWS_ACCOUNT")
        self.aws_region = os.getenv("AWS_REGION")
        svc_acct_creds = self.get_secret(SVC_ACCT_SECRET_NAME)
        gdrive_creds = self.get_gdrive_creds(svc_acct_creds)
        self.gdrive = googleapiclient.discovery.build(
            'drive', 'v3', credentials=gdrive_creds, cache_discovery=False)
        self.jwt = self.get_svc_acct_openid_jwt(gdrive_creds, svc_acct_creds['client_id'])
        self.base_url = CONFIG_MAP[self.aws_account]['company-api-base-url']
        self.client = self.configure_client()
        self.sheet_id = sheet_id
        self.data = self.get_csv_data(sheet_id)

    def get_csv_data(self, sheet_id):
        bytes = self.gdrive.files().export(fileId=sheet_id, mimeType="text/csv").execute()
        with tempfile.TemporaryFile() as temp:
            temp.write(bytes)
            temp.seek(0)
            data = list(csv.DictReader(io.TextIOWrapper(temp, 'utf-8'), strict=True))
        return data

    def get_gdrive_creds(self, svc_acct_creds):
        scopes = [
            'https://www.googleapis.com/auth/iam',
            'https://www.googleapis.com/auth/drive'
        ]
        gdrive_creds = google.oauth2.service_account.Credentials.from_service_account_info(
            svc_acct_creds, scopes=scopes)
        return gdrive_creds

    def get_svc_acct_openid_jwt(self, gdrive_creds, svc_acct_unique_id):
        auth_req = google.auth.transport.requests.Request()
        gdrive_creds.refresh(auth_req)
        access_token = gdrive_creds.token
        audience = SVC_ACCT_APP_NAME
        request_body = {
            "audience": audience,
            "includeEmail": True
        }
        request_url = f"https://content-iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/{svc_acct_unique_id}:generateIdToken?access_token={access_token}&alt=json"
        response = requests.post(request_url, json=request_body)
        return response.json()["token"]

    def get_secret(self, secret_name):
        try:
            session = boto3.session.Session()
            client = session.client(
                service_name='secretsmanager',
                region_name=self.aws_region,
            )
            get_secret_value_response = client.get_secret_value(
                SecretId=secret_name
            )
        except ClientError as e:
            print("Unexpected error %s" % e.response['Error']['Code'])
            pprint.pprint(e)
        else:
            if 'SecretString' in get_secret_value_response:
                text_secret_data = get_secret_value_response['SecretString']
                parsed_secret_data = json.loads(text_secret_data)
                return parsed_secret_data
            else:
                print("Expected SecretString in data")
                return None

    def configure_client(self):
        client = requests.Session()
        client.headers.update({
            "Authorization": f"Bearer {self.jwt}"
        })
        return client

    def get_person(self, email):
        response_person = self.client.get(self.base_url + '/person/' + email)
        if response_person.status_code != 200:
            return None
        response_dict = response_person.json()
        return response_dict
