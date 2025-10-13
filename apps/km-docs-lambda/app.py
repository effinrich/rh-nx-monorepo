import sys
import json
import pprint
import bs4
import boto3
import requests
import re
import traceback
from botocore.exceptions import ClientError
import google.oauth2
import google.oauth2.id_token
import google.auth
import google.auth.transport.requests
import googleapiclient.discovery

REGION = "us-east-1"
S3_URL_PREFIX = "S3://"
S3_CLIENT = boto3.session.Session().client('s3')


def get_secret(secret_name):
    try:
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=REGION,
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


svc_account_creds = get_secret("km-docs-svc")
mkdocs_s3_bucket = svc_account_creds["mkdocs_s3_bucket"] if "mkdocs_s3_bucket" in svc_account_creds else None


def get_gdocs_creds():
    scopes = [
        'https://www.googleapis.com/auth/documents.readonly'
    ]
    return google.oauth2.service_account.Credentials.from_service_account_info(svc_account_creds, scopes=scopes)


def get_gdocs_client():
    gdocs_creds = get_gdocs_creds()
    return googleapiclient.discovery.build('docs', 'v1', credentials=gdocs_creds, cache_discovery=False)


def get_gdrive_creds():
    scopes = [
        'https://www.googleapis.com/auth/iam',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
    ]
    return google.oauth2.service_account.Credentials.from_service_account_info(svc_account_creds, scopes=scopes)


def get_gdrive_client():
    gdrive_creds = get_gdrive_creds()
    return googleapiclient.discovery.build('drive', 'v3', credentials=gdrive_creds, cache_discovery=False)


def copy(doc_id, email, new_parent):
    gdrive_client = get_gdrive_client()
    response = gdrive_client.files().copy(
        fileId=doc_id, body={'parents': [new_parent], 'writersCanShare': True, 'copyRequiresWriterPermission': False}).execute()
    print(response)
    copy_id = response['id']
    response = gdrive_client.permissions().create(
        fileId=copy_id, body={'type': 'user', 'role': 'writer', 'emailAddress': email}).execute()
    print(response)
    return copy_id


def get_gdoc(doc_id):
    gdocs_client = get_gdocs_client()
    document = gdocs_client.documents().get(documentId=doc_id).execute()
    content = document.get('body').get('content')
    return content


def gdoc_to_json(doc_id):
    content = get_gdoc(doc_id)
    return json.dumps(content, indent=2)


def gdoc_to_xml(doc_id):
    content = get_gdoc(doc_id)
    xml = dicttoxml.dicttoxml(content, custom_root='bodyContentArray', attr_type=False)
    return xml.decode('utf-8')


def gdoc_to_html(doc_id):
    gdrive_client = get_gdrive_client()

    bytes = gdrive_client.files().export(fileId=doc_id, mimeType="text/html").execute()
    return bytes.decode('utf-8')


def enforce_doctype_decl(soup):
    has_doctype = any([isinstance(child, bs4.Doctype) for child in soup.children])
    if not has_doctype:
        soup.insert(0, bs4.Doctype("html"))


def remove_comments(soup):
    comment_refs = soup.find_all('a', id=lambda x: x and x.startswith('cmnt_ref'))
    for tag in comment_refs:
        # we go only one level up to kill the sup tag that contains the cmnt_ref
        parent = tag.parent
        parent.decompose()
    comments = soup.find_all('a', id=lambda x: x and x.startswith('cmnt'))
    for tag in comments:
        # we go two levels up to kill the div that contains the cmnt
        ancestor = tag.parent.parent
        ancestor.decompose()


def open_links_in_new_tabs(soup):
    external_anchors = soup.find_all('a', href=lambda x: x and x.startswith('https://www.google.com/url?q='))
    for external_anchor in external_anchors:
        external_anchor['target'] = '_blank'


def resolve_css_import_url(soup):
    style_tag = soup.findChild('head').findChild('style')
    if not style_tag:
        return
    style = str(style_tag.string)
    new_style = style
    p = re.compile("@import url\\((.*)?(\\);)")
    s = p.search(style)
    if s:
        css_url = s.group(1)
        start = s.start()
        end = s.end()
        css_response = requests.get(css_url)
        css_text = str(css_response.content, 'utf-8')
        new_style = new_style[0:start] + css_text + ";" + new_style[end:]
    style_tag.string.replace_with(new_style)
    del style_tag["type"]


def one_div_to_rule_them_all(soup):
    original_body = soup.findChild('body')
    original_body.name = "div"
    wrapper_body = soup.new_tag("body")
    soup.append(wrapper_body)
    original_body.wrap(wrapper_body)


def make_soup(html):
    soup = bs4.BeautifulSoup(html, features='html.parser')
    enforce_doctype_decl(soup)
    resolve_css_import_url(soup)
    remove_comments(soup)
    open_links_in_new_tabs(soup)
    one_div_to_rule_them_all(soup)
    return soup


def soup_to_react_friendly(soup):
    doc_content = soup.find_all("div", class_="doc-content")[0]
    del doc_content["style"]
    style_tag = soup.findChild('head').findChild('style')
    div_wrapper = soup.new_tag("div")
    div_wrapper["class"] = "doc-content-wrapper"
    div_wrapper["style"] = "max-width: 100%"
    div_wrapper.append(style_tag)
    div_wrapper.append(doc_content)
    return div_wrapper.prettify()


def gdoc_to_soup(doc_id):
    html = gdoc_to_html(doc_id)
    soup = make_soup(html)
    return soup.prettify()


failed_gets = {}


def gdoc_to_react(doc_id):
    if mkdocs_s3_bucket and doc_id not in failed_gets:
        try:
            override_html = s3_to_react(mkdocs_s3_bucket, doc_id, False)
            return override_html
        except ClientError as e:
            failed_gets[doc_id] = 1

    html = gdoc_to_html(doc_id)
    soup = make_soup(html)
    return soup_to_react_friendly(soup)


def mkdocs_to_html(doc_id):
    return s3_fetch(doc_id, False)


def mkdocs_to_text(doc_id):
    return s3_fetch(doc_id, True)


def s3_fetch(url: str, extract_text=False):
    bucket_start = len(S3_URL_PREFIX)
    bucket_key_separator = url.find('/', bucket_start)
    bucket = url[bucket_start:bucket_key_separator]
    key = url[bucket_key_separator+1:]
    return s3_to_react(bucket, key, extract_text)


def s3_to_react(bucket, key, extract_text=False):
    obj = S3_CLIENT.get_object(Bucket=bucket, Key=key)
    soup = bs4.BeautifulSoup(obj['Body'], features='html.parser')
    original_article_tag = soup.find_all("article")[0]
    original_article_tag.name = 'div'
    if extract_text:
        stripped = []
        for s in original_article_tag.stripped_strings:
            stripped.append(s)
        return '\n'.join(stripped)
    return original_article_tag.prettify()


def handler(event, context):
    try:
        pprint.pprint(event)
        params = event['queryStringParameters']
        doc_id = params['docId']
        headers = event['headers']
    except KeyError as e:
        return {
            'statusCode': 400,
            'body': {
                'help': 'Must provide docId parameter, and that doc must be shared with km-docs',
                'type': type(e).__name__,
                'statusCode': 400
            }
        }

    try:
        if 'oldSchool' in params:
            gdoc_fn = gdoc_to_xml
            content_type = 'text/xml'
        elif 'html' in params:
            has_accept = "accept" in headers
            wants_text = has_accept and headers['accept'] == 'text/plain'
            is_s3_url = doc_id.upper().startswith(S3_URL_PREFIX)
            if is_s3_url and not wants_text:
                gdoc_fn = mkdocs_to_html
                content_type = 'text/html; charset=utf-8'
            elif is_s3_url and wants_text:
                gdoc_fn = mkdocs_to_text
                content_type = 'text/plain; charset=utf-8'
            else:
                gdoc_fn = gdoc_to_react
                content_type = 'text/html; charset=utf-8'
        else:
            gdoc_fn = gdoc_to_json
            content_type = 'application/json'

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': content_type,
                'access-control-allow-origin': '*'
            },
            'body': gdoc_fn(doc_id)
        }
    except Exception as e:
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {
                'content-type': 'application/json',
                'access-control-allow-origin': '*'
            },
            'body': {
                'help': f"Could not transform this docId to {content_type}. Is it valid and shared with km-docs? {doc_id}",
                'type': type(e).__name__,
                'statusCode': 500
            }
        }


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(f"Usage: python {sys.argv[0]} <gdoc_id> # where gdoc_id has been shared with the km-docs service")
        exit(1)
    data = gdoc_to_react(sys.argv[1])
    print(data)
