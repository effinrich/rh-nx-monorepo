import {
  IpMarketplaceRequestContactInfoSummary,
  IpMarketplaceSummary
} from '../../ip/types'
import { Filters, PagedResult } from '../../types'

export const mockIpListing: IpMarketplaceSummary = {
  organization: {
    name: 'Marketplace Seller',
    activityType: {
      displayName: 'Enterprise Seller',
      value: 'ENTERPRISE_SELLER'
    },
    organizationType: {
      displayName: 'Medical Device Company',
      value: 'MEDICAL_DEVICE_COMPANY'
    },
    region: {
      displayName: 'Southeast',
      value: 'SOUTHEAST'
    }
  },
  name: 'Marvelous Idea',
  executiveSummary:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  therapeuticNeedOrTrendsBeingAddressed:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  technologyOverview:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  licenseRestriction: true,
  aboutLicenseRestriction:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  preferredTerms: [
    {
      displayName: 'Equity',
      value: 'EQUITY'
    },
    {
      displayName: 'Other',
      value: 'OTHER'
    }
  ],
  preferredTermsOther:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  associatedFilesOrMedia: [
    {
      href: 'https://example.com',
      name: 'report_url'
    }
  ],
  patentStatus: {
    displayName: 'Other',
    value: 'OTHER'
  },
  patentIssueDate: '2023-11-01T15:12:59.605Z',
  patentGeographicValidity: [
    {
      displayName: 'Other',
      value: 'OTHER'
    }
  ],
  patentGeographicValidityOther:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  patentStatusOtherInfo:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  disease:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  organOfFocus: [
    {
      displayName: 'Adrenal glands',
      value: 'ADRENAL_GLANDS'
    }
  ],
  technologyType: [
    {
      displayName: 'Medical Devices',
      value: 'MEDICAL_DEVICES'
    }
  ],
  speciality: [
    {
      displayName: 'Allergy and Immunology',
      value: 'ALLERGY_AND_IMMUNOLOGY'
    }
  ],
  sellerSummaryTechTransferApproach:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun',
  responsibleInventor: 'John Smith',
  technologyLevelOfMaturity: [
    {
      displayName: 'Animal study',
      value: 'ANIMAL_STUDY'
    }
  ],
  patentStatusHref: 'https://example.com',
  freedomToOperateCertification: {
    displayName: 'Yes',
    value: 'YES'
  },
  id: 'D0CuB24u',
  legalPatentabilityAssessmentAvailable: true,
  copyrighted: true,
  links: []
}

export const mockIpListingWithOwner: IpMarketplaceSummary = {
  ...mockIpListing,
  owner: {
    email: 'snow.villiers@redesignhealth.com',
    givenName: 'Snow',
    familyName: 'Villiers'
  }
}

export const mockIpListingWithMetrics: IpMarketplaceSummary = {
  ...mockIpListingWithOwner,
  metrics: {
    viewCount: 5,
    requestCount: 6
  }
}

export const mockIpListingWithRequests: IpMarketplaceSummary = {
  ...mockIpListing,
  requestContactInfo: [
    {
      buyerInfo: {
        email: 'terra.branford@example.com',
        givenName: 'Terra',
        familyName: 'Branford',
        companyName: 'Avalanche'
      },
      sellerInfo: {
        email: 'lighting.mcfaron@example.com',
        givenName: 'Lighting',
        familyName: 'McFaron',
        companyName: 'Ever/body'
      },
      dateRelease: '2023-11-02T15:12:59.605Z',
      dateRequest: '2023-11-01T15:12:59.605Z'
    },
    {
      buyerInfo: {
        companyName: 'Avalanche',
        email: 'tifa.lockhart@example.com'
      },
      sellerInfo: {
        companyName: 'Ever/body'
      },
      dateRequest: '2023-04-01T15:12:59.605Z'
    },
    {
      buyerInfo: {
        companyName: 'Avalanche',
        email: 'jane.doe@example.com'
      },
      sellerInfo: {
        companyName: 'Ever/body'
      },
      dateRequest: '2023-05-04T15:12:59.605Z'
    }
  ]
}

export const mockIpListingWithReleasedIPRequest: IpMarketplaceSummary = {
  ...mockIpListing,
  requestContactInfo: [
    {
      buyerInfo: {
        email: 'terra.branford@example.com',
        givenName: 'Terra',
        familyName: 'Branford',
        companyName: 'Avalanche'
      },
      sellerInfo: {
        email: 'lighting.mcfaron@example.com',
        givenName: 'Lighting',
        familyName: 'McFaron',
        companyName: 'Ever/body'
      },
      dateRelease: '2023-11-02T15:12:59.605Z',
      dateRequest: '2023-11-01T15:12:59.605Z'
    }
  ]
}

export const mockIpListingWithUnreleasedIPRequest: IpMarketplaceSummary = {
  ...mockIpListing,
  requestContactInfo: [
    {
      buyerInfo: {
        email: 'terra.branford@example.com',
        companyName: 'Avalanche'
      },
      sellerInfo: {
        companyName: 'Ever/body'
      },
      dateRequest: '2023-11-01T15:12:59.605Z'
    }
  ]
}

export const mockIpMarketplaceNoResults: PagedResult<IpMarketplaceSummary> = {
  links: [
    {
      rel: 'self',
      href: 'http://localhost:8080/ip-marketplace?size=20'
    }
  ],
  content: [],
  page: {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0
  }
}

export const mockIpMarketplaceWithMetrics: PagedResult<IpMarketplaceSummary> = {
  links: [
    {
      rel: 'self',
      href: 'http://localhost:8080/ip-marketplace?expand=metrics&page=0&size=20'
    }
  ],
  content: [mockIpListingWithMetrics],
  page: {
    size: 20,
    totalElements: 1,
    totalPages: 1,
    number: 0
  }
}

export const mockIpMarketplaceWithRequests: PagedResult<IpMarketplaceSummary> =
  {
    links: [
      {
        rel: 'self',
        href: 'http://localhost:8080/ip-marketplace?expand=metrics&page=0&size=20'
      }
    ],
    content: [mockIpListingWithRequests],
    page: {
      size: 20,
      totalElements: 1,
      totalPages: 1,
      number: 0
    }
  }

export const mockIpMarketplaceFilters: Filters = {
  links: [],
  content: [
    {
      key: 'technologyType',
      options: [
        {
          keyword: 'MEDICAL_DEVICES',
          count: 2,
          displayName: 'Medical Devices'
        }
      ]
    },
    {
      key: 'organizationType',
      options: [
        {
          keyword: 'ACADEMIC_MEDICAL_CENTER',
          count: 1,
          displayName: 'Academic Medical Center'
        },
        {
          keyword: 'IDN_HEALTH_SYSTEM',
          count: 1,
          displayName: 'IDN/Health System'
        }
      ]
    },
    {
      key: 'organOfFocus',
      options: [
        {
          keyword: 'ADRENAL_GLANDS',
          count: 2,
          displayName: 'Adrenal glands'
        }
      ]
    },
    {
      key: 'region',
      options: [
        {
          keyword: 'NORTHEAST',
          count: 1,
          displayName: 'Northeast'
        },
        {
          keyword: 'SOUTHEAST',
          count: 1,
          displayName: 'Southeast'
        }
      ]
    },
    {
      key: 'speciality',
      options: [
        {
          keyword: 'ALLERGY_AND_IMMUNOLOGY',
          count: 2,
          displayName: 'Allergy and Immunology'
        }
      ]
    }
  ]
}

export const mockIpMarketplaceContactInfo: IpMarketplaceRequestContactInfoSummary =
  {
    date: '2018-03-18T15:12:59.605Z'
  }
