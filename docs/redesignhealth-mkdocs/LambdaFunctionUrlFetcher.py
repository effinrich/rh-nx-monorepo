from typing import Optional
from mkdocs.plugins import BasePlugin
from mkdocs.structure.pages import Page
from mkdocs.structure.nav import Section, Navigation
from mkdocs.structure.files import Files, File
import requests
import os
import bs4
import pprint
import json
import boto3
from botocore.exceptions import ClientError
import google.oauth2
import google.oauth2.id_token
import google.auth
import google.auth.transport.requests
import googleapiclient.discovery


CONFIG_MAP = {
    'staging': {
        'ekl-library': 'BrhOU64b',
        'developer-library': '1omThfaC',
        'mkdocs-s3-bucket': 'rh-staging-developer-library',
        'company-api-base-url': 'https://company-api.staging.redesignhealth.com'
    },
    'dev': {
        'ekl-library': 'MnDeoylC',
        'developer-library': 'TkGC8nvM',
        'mkdocs-s3-bucket': 'rh-developer-library-dev',
        'company-api-base-url': 'https://company-api.dev.redesignhealth.com'
    },
    'prod': {
        'ekl-library': 'xoK3mG8Q',
        'developer-library': 'ELagNxhb',
        'mkdocs-s3-bucket': 'rh-developer-library-prod',
        'company-api-base-url': 'https://company-api.redesignhealth.com'
    },
    'local': {
        'ekl-library': 'NFtgrVHV',
        'developer-library': 'Df7LyeJR',
        'mkdocs-s3-bucket': 'dev-design.redesignhealth.com',
        'company-api-base-url': 'http://localhost:8080'
    }
}


class LambdaFunctionUrlFetcher(BasePlugin):
    def __init__(self) -> None:
        super().__init__()
        self.COMPANY_API_KEY = self.get_svc_acct_openid_jwt()
        self.CATEGORIES_SOLUTIONS = {}
        self.NAV_ITEM_ORDER = {}
        self.S3_CLIENT = boto3.session.Session().client('s3')

        self.CONFIG = CONFIG_MAP[os.getenv("AWS_ACCOUNT")]
        self.S3_BUCKET = self.CONFIG['mkdocs-s3-bucket']
        self.COMPANY_API_BASE_URL = self.CONFIG['company-api-base-url']
        self.LIBRARY_MAP = {
            'Expert Knowledge Library': self.CONFIG['ekl-library'],
            'Platform Developer Library': self.CONFIG['developer-library']
        }
        self.client = self.configure_client()

        self.should_delete_library_content = self.get_existing_library_content_ids()

    def get_svc_acct_openid_jwt(self):
        km_docs_private = self.get_secret("km-docs-svc")
        scopes = [
            'https://www.googleapis.com/auth/iam',
        ]
        credentials = google.oauth2.service_account.Credentials.from_service_account_info(
            km_docs_private, scopes=scopes)
        auth_req = google.auth.transport.requests.Request()
        credentials.refresh(auth_req)
        access_token = credentials.token
        audience = "510999103231-emldsjte0kvs5oee7gtleoqsfhtqc3ge.apps.googleusercontent.com"
        svc_account_unique_id = km_docs_private["client_id"]
        request_body = {
            "audience": audience,
            "includeEmail": True
        }
        request_url = f"https://content-iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/{svc_account_unique_id}:generateIdToken?access_token={access_token}&alt=json"
        response = requests.post(request_url, json=request_body)
        return response.json()["token"]

    def get_secret(self, secret_name):
        REGION = "us-east-1"
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

    def configure_client(self):
        client = requests.Session()
        client.headers.update({
            "Authorization": f"Bearer {self.COMPANY_API_KEY}"
        })
        return client

    def get_existing_library_content_ids(self):
        all_categories_and_descendants = self.client.get(f"{self.COMPANY_API_BASE_URL}/library-content?expand=descendants&filter=type,CATEGORY")
        should_delete = {}
        for category in all_categories_and_descendants.json()["content"]:
            should_delete[category["id"]] = True
            for descendant in category["descendants"]:
              should_delete[descendant["id"]] = True
        return should_delete

    def on_nav(self, nav: Navigation, config, files: Files):
        print("on_nav: invoked")
        self.apply_order(0, nav, tuple())
        print("on_nav: returning")
        return nav

    def apply_order(self, start_order_at, nav_item, path):
        if hasattr(nav_item, "title"):
            path = path + (nav_item.title,)
        self.NAV_ITEM_ORDER[path] = start_order_at
        # print(f"{start_order_at} | {path}")
        start_order_at += 1
        if hasattr(nav_item, "items") and nav_item.items:
            for child_item in nav_item.items:
                start_order_at = self.apply_order(start_order_at, child_item, path)
        elif hasattr(nav_item, "children") and nav_item.children:
            for child_item in nav_item.children:
                start_order_at = self.apply_order(start_order_at, child_item, path)
        return start_order_at

    def on_post_page(self, output, page, config):
        if not page.parent:
            return
        elif 'googleDocId' in page.meta:
            remote_content_source = "GOOGLE_DRIVE"
            doc_id = page.meta['googleDocId']
            print(f"LambdaFunctionUrlFetcher.on_post_page (GD): {doc_id}")
            if 'labels' in page.meta and 'template' in page.meta['labels']:
                print(f"LambdaFunctionUrlFetcher.on_post_page (GD): {doc_id}: is a template, put HTML to S3")
                self.S3_CLIENT.put_object(Body=output, Bucket=self.S3_BUCKET, Key=page.meta['googleDocId'])
        else:
            remote_content_source = "MKDOCS"
            doc_id = "S3://" + self.S3_BUCKET + "/" + page.url
            print(f"LambdaFunctionUrlFetcher.on_post_page (S3): {doc_id}")
            self.S3_CLIENT.put_object(Body=output, Bucket=self.S3_BUCKET, Key=page.url)
        print(pprint.pformat(page))
        print(pprint.pformat(page.meta))
        title = page.title
        description = page.meta["description"] if "description" in page.meta else ''
        category, library_name = self.walk_up_tree_for_category(page)
        library_id = self.LIBRARY_MAP[library_name]
        nav_path = self.walk_nav_from_root(page)
        extras = {
            "url": page.url,
            "labels": page.meta["labels"] if "labels" in page.meta else [],
            "parent": page.parent.title if page.parent else None,
            "parentDescription": page.parent.children[0].meta["description"] if page.parent.children and len(page.parent.children) > 0 and "description" in page.parent.children[0].meta else None
        }
        self.publish_to_company_api(doc_id, title, description, category, extras,
                                    library_id, remote_content_source, nav_path)

    # def on_page_content(self, html: str, *, page: Page, config, files: Files) -> Optional[str]:
    #     if not page.parent:
    #         return
    #     path = self.walk_nav_from_root(page)
    #     print(f"{path} - {self.NAV_ITEM_ORDER[path]}")
    #     if 'googleDocId' not in page.meta:
    #         return
    #     if 'labels' in page.meta and 'template' in page.meta['labels']:
    #         return
    #     doc_id = page.meta['googleDocId']
    #     pprint.pprint(page.meta)
    #     print(f"LambdaFunctionUrlFetcher.on_page_content: {doc_id}")
    #     print(pprint.pformat(page))
    #     url = "https://jr5xrr4ma4bnuiwoc6dqylgrym0rmfun.lambda-url.us-east-1.on.aws/?html&docId=" + doc_id
    #     response = requests.get(url)
    #     print(response.status_code)
    #     soup = bs4.BeautifulSoup(response.content, 'html.parser')
    #     return soup.prettify()

    def walk_nav_from_root(self, page: Page) -> tuple:
        page_to_root = []
        node = page
        while hasattr(node, 'title'):
            page_to_root.append(node.title)
            node = node.parent
        page_to_root.reverse()
        return tuple(page_to_root)

    def walk_up_tree_for_category(self, page: Page) -> str:
        node = page
        if not node.parent:
            return "BUG - Not Determined"
        while node.parent.title not in ['Expert Knowledge Library', 'Platform Developer Library']:
            node = node.parent
        return (node.title, node.parent.title)

    # def publish_to_helpjuice(self, soup, slug, title, description):
    #     API_KEY = os.getenv("HJ_API_KEY")
    #     if not API_KEY:
    #         print("Can't publish_to_helpjuice() without HJ_API_KEY")
    #         return
    #     URL = "https://redesignhealth.helpjuice.com/api/v3/articles?api_key=" + API_KEY
    #     print(f"LambdaFunctionUrlFetcher.publish_to_helpjuice: {slug}")
    #     body = soup.findChild('body').decode_contents()
    #     req = {
    #         "article": {
    #             "name": title,
    #             "description": description,
    #             "codename": slug,
    #             "published": True,
    #             "category_ids": [428701],
    #             "body": body
    #         }
    #     }
    #     response = requests.post(URL, json=req)
    #     print(response.status_code)

    def labels_to_content_type(self, labels):
        if 'template' in labels:
            return 'TEMPLATE'
        if 'video' in labels:
            return 'VIDEO'
        if 'third-party' in labels:
            return 'THIRD_PARTY'
        if 'tool' in labels:
            return 'TOOL'
        return 'ARTICLE'

    def publish_to_company_api(self, id, title, description, category, extras, library_id, remote_content_source, nav_path):
        ALLOW_UPDATES = True
        solution = extras["parent"] or "BUG - No Solution"
        solutionDescription = extras["parentDescription"] or "BUG - No Solution Description"
        URL = f"{self.COMPANY_API_BASE_URL}/library-content"
        print(f"LambdaFunctionUrlFetcher.publish_to_company_api: {id}")
        order_id = self.NAV_ITEM_ORDER[nav_path]
        cat_order_id = self.NAV_ITEM_ORDER[nav_path[0:2]]
        sln_order_id = self.NAV_ITEM_ORDER[nav_path[0:3]]
        if title == 'Overview':
            solution_id = self.establish_solution_id(
                category, solution, description, library_id, cat_order_id, sln_order_id)
            print(f"Created or adopted solution_id {solution_id} for the Overview at {extras['url']}")
            return

        solution_id = self.establish_solution_id(
            category, solution, solutionDescription, library_id, cat_order_id, sln_order_id)
        req = {
            "description": description,
            "libraryId": library_id,
            "parentId": solution_id,
            "remoteContentSource": remote_content_source,
            "remoteContentId": id,
            "title": title,
            "type": self.labels_to_content_type(extras["labels"]),
            "orderId": order_id
        }
        print(json.dumps(req))
        exists_check = f"{self.COMPANY_API_BASE_URL}/library-content/{solution_id}?expand=children"
        response = self.client.get(exists_check)
        response_parsed = response.json()
        # pprint.pprint(response_parsed)
        content = response_parsed["children"] if "children" in response_parsed else []
        filtered_content = list(filter(lambda x: x["title"] == title, content))
        if len(filtered_content) > 0:
            if not ALLOW_UPDATES:
                return
            module_id = filtered_content[0]["id"]
            URL = URL + "/" + module_id
            print(f"put {module_id}")
            response = self.client.put(URL, json=req)
            self.should_delete_library_content[module_id] = False
        else:
            print(f"post")
            response = self.client.post(URL, json=req)
        print(response.status_code)
        if response.status_code < 200 or response.status_code > 299:
            print(response.content)

    def establish_category_id(self, category_name, library_id, order_id):
        if category_name in self.CATEGORIES_SOLUTIONS:
            print('category cache hit')
            return self.CATEGORIES_SOLUTIONS[category_name][0]

        exists_check = f"{self.COMPANY_API_BASE_URL}/library/{library_id}/content?page=0&size=20&q={category_name}&filter=type%2CCATEGORY"
        response = self.client.get(exists_check)
        print(response)
        content = response.json()["content"]
        # pprint.pprint(content)
        filtered_content = list(filter(lambda x: x["title"] == category_name, content))
        if len(filtered_content) > 0:
            desired_id = filtered_content[0]["id"]
            put_body = {
                "title": category_name,
                "type": "CATEGORY",
                "libraryId": library_id,
                "orderId": order_id
            }
            print("Going to PUT a category")
            pprint.pprint(put_body)

            response = self.client.put(f"{self.COMPANY_API_BASE_URL}/library-content/{desired_id}", json=put_body)
            self.CATEGORIES_SOLUTIONS[category_name] = (desired_id, {})
            self.should_delete_library_content[desired_id] = False
            return desired_id

        post_body = {
            "title": category_name,
            "type": "CATEGORY",
            "libraryId": library_id,
            "orderId": order_id
        }

        response = self.client.post(f"{self.COMPANY_API_BASE_URL}/library-content", json=post_body)

        id = response.json()["id"]
        self.CATEGORIES_SOLUTIONS[category_name] = (id, {})
        return id

    def establish_solution_id(self, category_name, solution_name, maybe_solution_description, library_id, cat_order_id, sln_order_id):
        category_id = self.establish_category_id(category_name, library_id, cat_order_id)
        print(f"category_name {category_name} => {category_id}")
        solution_dict = self.CATEGORIES_SOLUTIONS[category_name][1]

        if solution_name in solution_dict:
            print('solution cache hit')
            return solution_dict[solution_name]

        exists_check = f"{self.COMPANY_API_BASE_URL}/library-content/{category_id}?expand=children"
        response = self.client.get(exists_check)
        response_parsed = response.json()
        # pprint.pprint(response_parsed)
        content = response_parsed["children"] if "children" in response_parsed else []
        filtered_content = list(filter(lambda x: x["title"] == solution_name, content))
        if len(filtered_content) > 0:
            desired_id = filtered_content[0]["id"]
            put_body = {
                "title": solution_name,
                "parentId": category_id,
                "type": "SOLUTION",
                "description": maybe_solution_description,
                "libraryId": library_id,
                "orderId": sln_order_id
            }
            print("Going to PUT a solution")
            pprint.pprint(put_body)

            response = self.client.put(f"{self.COMPANY_API_BASE_URL}/library-content/{desired_id}", json=put_body)
            solution_dict[solution_name] = desired_id
            self.should_delete_library_content[desired_id] = False
            return desired_id

        post_body = {
            "title": solution_name,
            "parentId": category_id,
            "type": "SOLUTION",
            "description": maybe_solution_description,
            "libraryId": library_id,
            "orderId": sln_order_id
        }
        print("Going to POST a solution")
        pprint.pprint(post_body)
        response = self.client.post(f"{self.COMPANY_API_BASE_URL}/library-content", json=post_body)

        response_parsed = response.json()
        # pprint.pprint(response_parsed)
        id = response_parsed["id"]
        solution_dict[solution_name] = id
        return id
    def on_post_build(self, config):
      print ("on_post_build")
      for library_content in self.should_delete_library_content.keys():
          if self.should_delete_library_content[library_content]:
              # delete
              self.client.delete(f"{self.COMPANY_API_BASE_URL}/library-content/{library_content}")
              print("Removed library content: ", library_content)
