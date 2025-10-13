import { Ceo } from '../../ceo-directory/types'
import { Filters, PagedResult } from '../../types'

export const mockCeoOptIn: Ceo = {
  member: {
    email: 'sazh.katzroy@redesignhealth.com',
    givenName: 'Sazh',
    familyName: 'Katzroy',
    company: {
      id: '6aBCde12',
      name: 'Ever/Body',
      stage: 'THEME',
      description:
        'Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.',
      href: 'https://example.com',
      fundraiseStatus: {
        value: 'string',
        displayName: 'string'
      }
    }
  },
  businessType: {
    value: 'string',
    displayName: 'string'
  },
  location: 'Atlanta',
  marketServiceArea: ['California'],
  customerSegment: [
    {
      value: 'string',
      displayName: 'string'
    }
  ],
  healthcareSector: {
    value: 'string',
    displayName: 'string'
  },
  businessFocusArea: [
    {
      value: 'string',
      displayName: 'string'
    }
  ],
  pictureHref: 'string',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
  additionalInfo:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
  visible: {
    value: 'OPT_IN',
    displayName: 'Opt in'
  },
  linkedinHref: 'https://example.com',
  id: '6nuT80li'
}

export const mockCeoOptOut: Ceo = {
  member: {
    email: 'sazh.katzroy@redesignhealth.com',
    givenName: 'Sazh',
    familyName: 'Katzroy',
    company: {
      id: '6aBCde12',
      name: 'Ever/Body',
      stage: 'THEME',
      description:
        'Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.',
      href: 'https://example.com',
      fundraiseStatus: {
        value: 'string',
        displayName: 'string'
      }
    }
  },
  businessType: {
    value: 'string',
    displayName: 'string'
  },
  location: 'Atlanta',
  marketServiceArea: ['California'],
  customerSegment: [
    {
      value: 'string',
      displayName: 'string'
    }
  ],
  healthcareSector: {
    value: 'string',
    displayName: 'string'
  },
  businessFocusArea: [
    {
      value: 'string',
      displayName: 'string'
    }
  ],
  pictureHref: 'string',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
  additionalInfo:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
  visible: {
    value: 'OPT_OUT',
    displayName: 'Opt out'
  },
  linkedinHref: 'https://example.com',
  id: '6nuT80li'
}

export const mockCeos: PagedResult<Ceo> = {
  links: [
    {
      rel: 'first',
      href: 'http://localhost:8080/ceos?page=0&size=20'
    }
  ],
  content: [
    {
      member: {
        email: 'rhdevopstest3@gmail.com',
        givenName: 'Renée-Noël',
        familyName: 'Núñez',
        company: {
          id: '308E2n6A',
          name: 'Shinra Corp',
          stage: 'OP_CO',
          description: '',
          href: 'https://example.com',
          fundraiseStatus: {
            displayName: 'Series B',
            value: 'SERIES_B'
          }
        }
      },
      businessType: {
        displayName: 'B2B',
        value: 'B2B'
      },
      location: 'Atlanta',
      marketServiceArea: ['California'],
      customerSegment: [
        {
          displayName: 'Health Plan',
          value: 'HEALTH_PLAN'
        }
      ],
      healthcareSector: {
        displayName: 'Biopharma & Device',
        value: 'BIOPHARMA_AND_DEVICE'
      },
      businessFocusArea: [
        {
          displayName: 'APM Incentives',
          value: 'APM_INCENTIVES'
        }
      ],
      pictureHref:
        'https://assets.redesignhealth.com/jPfOBSxL5eEejybPc3Iex7SchgDYTkhqzJ3GkB65/Avatar-2.png',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      additionalInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      visible: {
        displayName: 'Opt out',
        value: 'OPT_OUT'
      },
      id: 'W2Lw66sF',
      links: []
    },
    {
      member: {
        email: 'rhdevopstest4@gmail.com',
        givenName: 'Temperance',
        familyName: 'MagdalenaAndersonmacdontald-Smithjones',
        company: {
          id: 'XlnRdc13',
          name: 'Company 1',
          stage: 'OP_CO',
          description:
            "Testing the 'Overview' section:\n      Privacy & Tech stack status: NOT_STARTED",
          href: '',
          fundraiseStatus: {
            displayName: 'Pre launch phase',
            value: 'PRE_LAUNCH_PHASE'
          }
        }
      },
      businessType: {
        displayName: 'B2B',
        value: 'B2B'
      },
      location: 'Atlanta',
      marketServiceArea: ['California'],
      customerSegment: [
        {
          displayName: 'Health Plan',
          value: 'HEALTH_PLAN'
        }
      ],
      healthcareSector: {
        displayName: 'Biopharma & Device',
        value: 'BIOPHARMA_AND_DEVICE'
      },
      businessFocusArea: [
        {
          displayName: 'APM Incentives',
          value: 'APM_INCENTIVES'
        }
      ],
      pictureHref:
        'https://assets.redesignhealth.com/FF2E8wgfFIWeXarovyVZ2n3MScXBkqivPW8vDTY7/Avatar-3.png',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      additionalInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      visible: {
        displayName: 'Opt in',
        value: 'OPT_IN'
      },
      id: 'uFfwbYIj',
      links: []
    },
    {
      member: {
        email: 'rhdevopstest2@gmail.com',
        givenName: 'Rodney',
        familyName: 'Dangerisfun',
        company: {
          id: '43E8cv5U',
          name: 'StealthCo',
          stage: 'OP_CO',
          description: 'Test description... 16926363929703',
          href: '',
          fundraiseStatus: {
            displayName: 'Pre launch phase',
            value: 'PRE_LAUNCH_PHASE'
          }
        }
      },
      businessType: {
        displayName: 'B2B',
        value: 'B2B'
      },
      location: 'Atlanta',
      marketServiceArea: ['California'],
      customerSegment: [
        {
          displayName: 'Health Plan',
          value: 'HEALTH_PLAN'
        }
      ],
      healthcareSector: {
        displayName: 'Biopharma & Device',
        value: 'BIOPHARMA_AND_DEVICE'
      },
      businessFocusArea: [
        {
          displayName: 'APM Incentives',
          value: 'APM_INCENTIVES'
        }
      ],
      pictureHref:
        'https://assets.redesignhealth.com/B1lG7yyNMeFbLB6gfo2CuTx9gAB6dRJNTyKrQXkZ/Avatar-4.png',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      additionalInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      visible: {
        displayName: 'Opt in',
        value: 'OPT_IN'
      },
      id: 'ADmb7FIU',
      links: []
    },
    {
      member: {
        email: 'stephanie.velazquez@redesignhealth.com',
        givenName: 'h',
        familyName: 'h',
        company: {
          id: 'ZZPhofe2',
          name: 'StealthCo',
          stage: 'OP_CO',
          description:
            'Test 847904 - submitting the privacy questionnaire and the tech stack',
          href: '',
          fundraiseStatus: {
            displayName: 'Pre launch phase',
            value: 'PRE_LAUNCH_PHASE'
          }
        }
      },
      businessType: {
        displayName: 'B2B',
        value: 'B2B'
      },
      location: 'Atlanta',
      marketServiceArea: ['California'],
      customerSegment: [
        {
          displayName: 'Health Plan',
          value: 'HEALTH_PLAN'
        }
      ],
      healthcareSector: {
        displayName: 'Biopharma & Device',
        value: 'BIOPHARMA_AND_DEVICE'
      },
      businessFocusArea: [
        {
          displayName: 'APM Incentives',
          value: 'APM_INCENTIVES'
        }
      ],
      pictureHref:
        'https://assets.redesignhealth.com/AOOnkFxmJHeMEQPVI1gsGeplLvukZwRyag4wfhgO/Avatar.png',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      additionalInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      visible: {
        displayName: 'Opt in',
        value: 'OPT_IN'
      },
      id: 'mHdtfm3B',
      links: []
    },
    {
      member: {
        email: 'kyle.copeland@redesignhealth.com',
        givenName: 'Kyle',
        familyName: 'Copeland',
        company: {
          id: 'm4Qy7ZRd',
          name: 'StealthCo',
          stage: 'OP_CO',
          description:
            'Test: 2. RH User can click the "Start now" button in "Infrastructure setup" section',
          href: '',
          fundraiseStatus: {
            displayName: 'Pre launch phase',
            value: 'PRE_LAUNCH_PHASE'
          }
        }
      },
      businessType: {
        displayName: 'D2C',
        value: 'D2C'
      },
      location: 'Atlanta',
      marketServiceArea: ['California'],
      customerSegment: [
        {
          displayName: 'Health Systems',
          value: 'HEALTH_SYSTEMS'
        }
      ],
      healthcareSector: {
        displayName: 'Care Enablement',
        value: 'CARE_ENABLEMENT'
      },
      businessFocusArea: [
        {
          displayName: 'Cancer Care',
          value: 'CANCER_CARE'
        }
      ],
      pictureHref: 'http//www.example.com/',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      additionalInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      visible: {
        displayName: 'Opt in',
        value: 'OPT_IN'
      },
      id: 'anjXb9Cv',
      links: []
    },
    {
      member: {
        email: 'example@redesignhealth.com',
        givenName: 'Example',
        familyName: 'NotDecidedOpt',
        company: {
          id: 'm4Qy7ZRd',
          name: 'StealthCo',
          stage: 'OP_CO',
          description:
            'Test: 2. RH User can click the "Start now" button in "Infrastructure setup" section',
          href: '',
          fundraiseStatus: {
            displayName: 'Pre launch phase',
            value: 'PRE_LAUNCH_PHASE'
          }
        }
      },
      businessType: {
        displayName: 'D2C',
        value: 'D2C'
      },
      location: 'Atlanta',
      marketServiceArea: ['California'],
      customerSegment: [
        {
          displayName: 'Health Systems',
          value: 'HEALTH_SYSTEMS'
        }
      ],
      healthcareSector: {
        displayName: 'Care Enablement',
        value: 'CARE_ENABLEMENT'
      },
      businessFocusArea: [
        {
          displayName: 'Cancer Care',
          value: 'CANCER_CARE'
        }
      ],
      pictureHref: 'http//www.example.com/',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      additionalInfo:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
      id: '1234567',
      links: []
    }
  ],
  page: {
    size: 20,
    totalElements: 6,
    totalPages: 1,
    number: 0
  }
}

export const mockCeosNoResults: PagedResult<Ceo> = {
  links: [
    {
      rel: 'first',
      href: 'http://localhost:8080/ceos?page=0&size=20q=abcd'
    }
  ],
  content: [],
  page: {
    size: 20,
    totalElements: 0,
    totalPages: 0,
    number: 0
  }
}

export const mockCeoFilters: Filters = {
  links: [],
  content: [
    {
      key: 'healthcareSector',
      options: [
        {
          keyword: 'Biopharma & Device',
          count: 4
        },
        {
          keyword: 'Care Enablement',
          count: 1
        }
      ]
    },
    {
      key: 'businessType',
      options: [
        {
          keyword: 'B2B',
          count: 4
        },
        {
          keyword: 'D2C',
          count: 1
        }
      ]
    },
    {
      key: 'businessFocusArea',
      options: [
        {
          keyword: 'APM Incentives',
          count: 4
        },
        {
          keyword: 'Cancer Care',
          count: 1
        }
      ]
    },
    {
      key: 'member.company.fundraiseStatus',
      options: [
        {
          keyword: 'Pre launch phase',
          count: 5
        }
      ]
    },
    {
      key: 'customerSegment',
      options: [
        {
          keyword: 'Health Plan',
          count: 4
        },
        {
          keyword: 'Health Systems',
          count: 1
        }
      ]
    }
  ]
}
