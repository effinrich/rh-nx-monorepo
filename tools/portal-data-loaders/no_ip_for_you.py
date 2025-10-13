import sys
import pprint
import logging
from shared import DataLoader

# Google Sheets file ID
# Must be shared with km-docs-svc@redesign-os.iam.gserviceaccount.com
# We only import the *first* tab
SHEET_ID = '1LJoWG7Go9JkdvO3RvbS_7do58NTC8G2GDlR8yFHCFQM'

# Columns we will import
# These strings must match cells in row 1 *exactly*
NAME = 'Name'
COMPANY_ID = 'Company ID'
EXEC_SUMMARY = 'Exec Summary'
TECH_TYPE = 'Tech Type'
EMAIL = 'Email'
THERAPEUTICS = 'Therapeutics'
ORGAN = 'Organs of Focus'
SPECIAL = 'Specialties'
PATENT_LINK = 'patentStatusHref'
INVENTOR = 'responsibleInventor'
PATENT_GEOGRAPHY = 'patentGeographicValidity'
TERMS = 'preferredTerms'
DISEASE = 'disease'
TECH_MATURITY = 'technologyLevelOfMaturity'
PATENT_STATUS = 'patentStatus'



class IpMarketplaceDataLoader(DataLoader):
    def __init__(self) -> None:
        logging.info(f'Setting up IpMarketplaceDataLoader')
        super().__init__(SHEET_ID)
        logging.debug(f'Target company-api is {self.aws_account} in {self.aws_region} at {self.base_url}\n')
        logging.debug(f'Detected column headers:\n{self.data[0].keys()}')

    def load(self):
        logging.info(f'Starting IP Marketplace load')
        responses = [self.load_row(row) for row in self.data if self.is_valid_row(row)]
        return responses

    def load_row(self, row):
        name = row[NAME]
        company_id = row[COMPANY_ID]
        email = row[EMAIL]
        executive_summary = row[EXEC_SUMMARY]
        technology_type = row[TECH_TYPE].split(', ') if row[TECH_TYPE] else None
        therapeutics = row[THERAPEUTICS]
        specialties = row[SPECIAL].split(', ') if row[SPECIAL] else None
        organs = row[ORGAN].split(', ') if row[ORGAN] else None
        patentStatusHref = row[PATENT_LINK]
        responsibleInventor = row[INVENTOR]
        patentGeographicValidity = row[PATENT_GEOGRAPHY].split(', ') if row[PATENT_GEOGRAPHY] else None
        preferredTerms = row[TERMS].split(', ') if row[TERMS] else None
        disease = row[DISEASE]
        technologyLevelOfMaturity = row[TECH_MATURITY].split(', ') if row[TECH_MATURITY] else None
        patentStatus = row[PATENT_STATUS]

        body = {
            'name': name,
            'companyId': company_id,
            'email': email,
            'executiveSummary': executive_summary,
            'technologyType': technology_type,
            'therapeuticNeedOrTrendsBeingAddressed': therapeutics,
            'speciality': specialties,
            'organOfFocus': organs,
            'patentStatusHref': patentStatusHref,
            'responsibleInventor': responsibleInventor,
            'patentGeographicValidity': patentGeographicValidity,
            'preferredTerms': preferredTerms,
            'disease': disease,
            'technologyLevelOfMaturity': technologyLevelOfMaturity,
            'patentStatus': patentStatus
          
        }
        logging.debug(pprint.pformat(body))
        exists = self.ip_by_name(name)
        if exists:
            api_id = exists["id"]
            response = self.client.put(self.base_url + f'/ip-marketplace/{api_id}', json=body)
            logging.info(f'[{name}] PUT /ip-marketplace/{api_id} {response.status_code}')
            if response.status_code != 200:
                logging.warning(pprint.pformat(response.json()))
            return response

        response = self.client.post(self.base_url + f'/ip-marketplace', json=body)
        logging.info(f'[{name}] POST /ip-marketplace {response.status_code}')
        if response.status_code != 201:
            logging.warning(pprint.pformat(response.json()))
        return response

    def is_valid_row(self, row):
        return len(row[NAME]) > 0 and len(row[COMPANY_ID]) > 0

    def ip_by_name(self, name):
        response = self.client.get(self.base_url + f'/ip-marketplace?q={name}')
        if response.status_code != 200:
            return None
        matches = [ip for ip in response.json()["content"] if ip["name"] == name]
        if len(matches) > 0:
            return matches[0]
        return None


def main(argv):
    logging.basicConfig(level=logging.INFO, format='[{levelname}] {message}', style='{')
    loader = IpMarketplaceDataLoader()
    loader.load()


if __name__ == '__main__':
    main(sys.argv)
