import pprint
import logging
from shared import DataLoader

VENDORS_SHEET_ID = '1AjULATjGbEmirr_EZzcLIi-kp_vH1TkxL15Ptrj05LM'
TAGS_SHEET_ID = '1whp40-FO_-L_Dv9zgHWVRIFu1EX5lx70NNuQHfbKu_0'
FEEDBACK_SHEET_ID = '1yU-v_RBPMJEfUq_C7miVGC4j4Yhlq-VrO6Sf6lSLTHw'

# DELETEs all categories and their subcategories via API
TAGS_FORCE_FRESH_START = False

# Vendors columns

NAME = 'Name'
SUBCAT = 'Subcategory'
DESC = 'Description'
TYPE = 'Vendor / Agency / Contractor'
POC = 'POC'
PRICING = 'Pricing'
DISCOUNT = 'Discount info'
PROS = 'Pros'
CONS = 'Cons'
FEATS = 'Features'
AGREE = 'Signed Agreement?'


# Tags columns

CAT = 'Category'
TAG = 'Tag'

# Feedback columns

COMPANY_VENDOR = 'Vendor name'
WILLING_TO_DISCUSS = 'willingToDiscuss'
COMPANY = 'Company Name'
COMPANY_REVIEWER_EMAIL = 'OpCo point of contact email'


class VendorDataLoader(DataLoader):
    def __init__(self) -> None:
        logging.info(f'Setting up VendorDataLoader')
        super().__init__(VENDORS_SHEET_ID)
        logging.debug(f'Target company-api is {self.aws_account} in {self.aws_region} at {self.base_url}\n')
        logging.debug(f'Detected column headers:\n{self.data[0].keys()}')
        self.tag_columns = [col for col in self.data[0].keys() if col.startswith(TAG)]
        logging.debug(f'Detected {len(self.tag_columns)} tag columns')
        self.poc_columns = [col for col in self.data[0].keys() if col.startswith(POC)]
        logging.debug(f'Detected {len(self.poc_columns)} POC columns')

    def load(self):
        logging.info(f'Caching subcategories from api')
        self.subcat_cache = self.cache_subcategories()
        self.subcat_only_lookup = self.create_subcat_only_lookup(self.subcat_cache.keys())
        logging.info(f'Starting vendor load')
        responses = [self.load_row(row) for row in self.data if self.is_valid_row(row)]
        return responses

    def load_row(self, row):
        name = row[NAME]
        vendor_type = row[TYPE].upper()
        signed_agreement = row[AGREE].upper() == 'YES'
        description = row[DESC]
        pricing = row[PRICING] or None
        discount = row[DISCOUNT] or None
        features = row[FEATS] or None
        pros = row[PROS] or None
        cons = row[CONS] or None
        pocs = [row[col] for col in self.poc_columns if len(row[col]) > 0]
        vendor_poc = '; '.join(pocs) or None
        tags = self.tags_for_row(row)
        subcategories = [self.subcat_cache[self.subcat_only_lookup[tag]]
                         for tag in tags if tag in self.subcat_only_lookup]
        unknown_tags = [tag for tag in tags if tag not in self.subcat_only_lookup]
        if unknown_tags:
            logging.warning(f'[{name}] Unknown tags: {unknown_tags}')
        logging.debug(f'[{name}] {len(subcategories)} subcategories mapped')
        body = {
            'name': name,
            'vendorType': vendor_type,
            'description': description,
            'subcategories': subcategories,
            'vendorPointContact': vendor_poc,
            'pricing': pricing,
            'discountInfo': discount,
            'pros': pros,
            'cons': cons,
            'features': features,
            'hasPlatformAgreement': signed_agreement
        }
        logging.debug(pprint.pformat(body))
        exists = self.vendor_by_name(name)
        if exists:
            api_id = exists["apiId"]
            response = self.client.put(self.base_url + f'/vendor/{api_id}', json=body)
            logging.info(f'[{name}] PUT /vendor/{api_id} {response.status_code}')
            if response.status_code != 200:
                logging.warning(pprint.pformat(response.json()))
            return response

        response = self.client.post(self.base_url + f'/vendor', json=body)
        logging.info(f'[{name}] POST /vendor {response.status_code}')
        if response.status_code != 201:
            logging.warning(pprint.pformat(response.json()))
        return response

    def tags_for_row(self, row):
        tags = [row[col] for col in self.tag_columns if row[col]]
        return tags

    def is_valid_row(self, row):
        return len(row[NAME]) > 0 and len(row[DESC]) > 0 and len(self.tags_for_row(row)) > 0

    def vendor_by_name(self, name):
        response = self.client.get(self.base_url + f'/vendor?q={name}')
        if response.status_code != 200:
            return None
        matches = [vendor for vendor in response.json()["content"] if vendor["name"] == name]
        if len(matches) > 0:
            return matches[0]
        return None

    def cache_subcategories(self):
        remote_cats = self.server_cats()
        cat_map = {}
        for outer in remote_cats:
            for inner in outer['subcategories']:
                cat_map[(outer['name'], inner['name'])] = {
                    'name': inner['name'],
                    'apiId': inner['apiId'],
                    'category': {
                        'name': outer['name'],
                        'apiId': outer['apiId']
                    }
                }

        return cat_map

    def create_subcat_only_lookup(self, subcats):
        subcat_map = {}
        for (cat, subcat) in subcats:
            subcat_map[subcat] = (cat, subcat)

        return subcat_map

    def server_cats(self):
        return self.client.get(self.base_url + '/categories?expand=subcategories').json()


class VendorTagsDataLoader(DataLoader):
    def __init__(self) -> None:
        logging.info(f'Setting up VendorTagsDataLoader')
        super().__init__(TAGS_SHEET_ID)
        logging.debug(f'Target company-api is {self.aws_account} in {self.aws_region} at {self.base_url}\n')
        logging.debug(f'Detected column headers:\n{self.data[0].keys()}')

    def is_valid_row(self, row):
        return len(row[CAT]) > 0 and len(row[TAG]) > 0

    def load(self):
        if (TAGS_FORCE_FRESH_START):
            self.force_fresh_start()
        self.merge_cats()

    def cats(self):
        pairs = [(row[CAT], row[TAG]) for row in self.data if self.is_valid_row(row)]
        distinct_pairs = set(pairs)
        return distinct_pairs

    def server_cats(self):
        return self.client.get(self.base_url + '/categories?expand=subcategories').json()

    def force_fresh_start(self):
        logging.info("Forcing fresh start for categories and tags (fka subcategories)")
        remote_cats = self.server_cats()
        logging.info(f"{len(remote_cats)} top-level categories to delete")
        for cat in remote_cats:
            api_id = cat['apiId']
            for subcat in cat['subcategories']:
                subcat_api_id = subcat['apiId']
                subcat_url = f"/categories/{api_id}/subcategories/{subcat_api_id}"
                logging.info(f"DELETE {subcat_url}")
                subcat_response = self.client.delete(self.base_url + subcat_url)
                if subcat_response.status_code != 204:
                    logging.warning(pprint.pformat(subcat_response.json(), indent=4))

            url = f"/categories/{api_id}"
            logging.info(f"DELETE {url}")
            response = self.client.delete(self.base_url + url)
            logging.info(response.status_code)
            if response.status_code != 204:
                logging.warning(pprint.pformat(response.json(), indent=4))

    def merge_cats(self):
        known_cats = set()
        remote_cats = self.server_cats()
        cat_map = {}
        for outer in remote_cats:
            cat_map[outer['name']] = outer
            for inner in outer['subcategories']:
                known_cats.add((outer['name'], inner['name']))
        local_cats = self.cats()
        work_set = local_cats.difference(known_cats)
        logging.info(
            f'{len(work_set)} cat/subcat pairs to merge, {len(local_cats)} pairs found in this sheet, and {len(remote_cats)} cats were searched in the company api')
        for cat_and_sub in work_set:
            (cat, subcat) = cat_and_sub
            if cat not in cat_map:
                response = self.client.post(self.base_url + '/categories', json={'name': cat})
                logging.info(f'[{cat}] POST /categories {response.status_code}')
                if response.status_code != 201:
                    logging.warning(pprint.pformat(response.json(), indent=4))
                cat_map[cat] = response.json()
            api_id = cat_map[cat]["apiId"]
            response = self.client.post(self.base_url + f'/categories/{api_id}/subcategories', json={
                'category': cat_map[cat],
                'name': subcat
            })
            logging.info(f'[{cat} > {subcat}] POST /categories/{api_id}/subcategories {response.status_code}')
            if response.status_code != 201:
                logging.warning(pprint.pformat(response.json(), indent=4))


class VendorFeedbackDataLoader(DataLoader):
    def __init__(self) -> None:
        logging.info(f'Setting up VendorFeedbackDataLoader')
        super().__init__(FEEDBACK_SHEET_ID)
        logging.debug(f'Target company-api is {self.aws_account} in {self.aws_region} at {self.base_url}\n')
        logging.debug(f'Detected column headers:\n{self.data[0].keys()}')
        self.company_ids = self.server_companies()
        self.vendor_subcategories = self.server_vendors()

    def server_companies(self):
        response = self.client.get(self.base_url + '/company?page=0&size=500').json()['content']
        companies = {}
        for company in response:
            companies[company['name'].lower()] = company['id']
        return companies

    def server_vendors(self):
        response = self.client.get(self.base_url + '/vendor?page=0&size=500').json()['content']
        vendors = {}
        for vendor in response:
            vendors[vendor['name'].lower()] = vendor['subcategories']
        return vendors

    def load(self):
        for row in self.data:
            self.load_row(row)

    def load_row(self, row):
        company_name = row[COMPANY]
        willing_to_discuss = row[WILLING_TO_DISCUSS].lower().startswith('y')
        vendor_name = row[COMPANY_VENDOR]
        email = row[COMPANY_REVIEWER_EMAIL]
        if company_name.lower() not in self.company_ids:
            logging.warning(f'[{company_name} -> {vendor_name}] SKIPPED, no company {company_name}')
            return
        if vendor_name.lower() not in self.vendor_subcategories:
            logging.warning(f'[{company_name} -> {vendor_name}] SKIPPED, no vendor {vendor_name}')
            return
        company_id = self.company_ids[company_name.lower()]
        vendor_subcategories = self.vendor_subcategories[vendor_name.lower()]
        person = self.get_person(email)
        headers = {
            'RH-Impersonation-Email': email
        }
        if not person:
            logging.warning(f'[{company_name} -> {vendor_name}] SKIPPED, no user {email}')
            return

        body = {
            'name': vendor_name,
            'engagementStatus': 'ACTIVE',
            'subcategories': vendor_subcategories,
            'willingToDiscuss': willing_to_discuss
        }

        if willing_to_discuss:
            body['contacts'] = [{
                'email': email,
                'willingToDiscuss': willing_to_discuss
            }]

        company_vendors = self.server_company_vendors(company_id)
        if vendor_name.lower() in company_vendors:
            api_id = company_vendors[vendor_name.lower()]
            put_url = f"/company/{company_id}/vendor/{api_id}"
            put_response = self.client.put(self.base_url + put_url, headers=headers, json=body)
            logging.info(f"[{company_name} -> {vendor_name}] PUT {put_url} {put_response.status_code}")
            if put_response.status_code != 200:
                logging.warning(pprint.pformat(put_response.json()))
            return

        post_url = f"/company/{company_id}/vendor"
        post_response = self.client.post(self.base_url + post_url, headers=headers, json=body)
        logging.info(f"[{company_name} -> {vendor_name}] POST {post_url} {post_response.status_code}")
        if post_response.status_code != 201:
            logging.warning(pprint.pformat(post_response.json()))

    def server_company_vendors(self, company_id):
        url = f"/company/{company_id}/vendor"
        response = self.client.get(self.base_url + url).json()['content']
        company_vendors = {}
        for company_vendor in response:
            company_vendors[company_vendor['name'].lower()] = company_vendor['id']
        return company_vendors


def load_all_vendor_sources():
    tags = VendorTagsDataLoader()
    tags.load()
    vendors = VendorDataLoader()
    vendors.load()
    feedback = VendorFeedbackDataLoader()
    feedback.load()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='[{levelname}] {message}', style='{')
    load_all_vendor_sources()
