const fs = require('fs');
const path = require('path');

const randomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const faker = {
    string: { alphanumeric: (len) => randomString(len) },
    company: {
        name: () => `Company ${randomString(5)}`,
        catchPhrase: () => 'We do things efficiently and effectively.'
    },
    date: {
        past: () => new Date(Date.now() - randomInt(0, 10000000000)),
        recent: () => new Date(Date.now() - randomInt(0, 1000000))
    },
    helpers: {
        arrayElement: randomElement
    },
    internet: {
        url: () => `https://example.com/${randomString(5)}`,
        email: () => `user${randomString(5)}@example.com`
    },
    datatype: {
        boolean: () => Math.random() > 0.5
    },
    person: {
        firstName: () => `First${randomString(3)}`,
        lastName: () => `Last${randomString(3)}`,
        fullName: () => `First${randomString(3)} Last${randomString(3)}`
    },
    commerce: {
        department: () => 'Tech',
        productName: () => `Product ${randomString(4)}`
    },
    number: {
        int: ({min, max} = {min: 0, max: 100}) => randomInt(min || 0, max || 100)
    },
    lorem: {
        paragraph: () => 'Lorem ipsum dolor sit amet. '.repeat(3),
        sentence: () => 'Lorem ipsum dolor sit amet.',
        word: () => 'lorem'
    },
    location: {
        city: () => 'New York',
        state: () => 'California'
    },
    image: {
        avatar: () => 'https://via.placeholder.com/150'
    }
};

const generateCompanies = (count) => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.alphanumeric(8),
    name: faker.company.name(),
    legalName: faker.company.name() + ', Inc.',
    description: faker.company.catchPhrase(),
    created: faker.date.past().toISOString(),
    lastModified: faker.date.recent().toISOString(),
    stage: faker.helpers.arrayElement(['OP_CO', 'THEME']),
    status: 'ACTIVE',
    taxonomy: [
      {
        value: 'CARE_DELIVERY',
        displayName: 'Care Delivery',
        level: 1
      }
    ],
    fundraiseStatus: {
      displayName: faker.helpers.arrayElement(['Series A', 'Series B', 'Seed', 'Pre launch phase']),
      value: faker.helpers.arrayElement(['SERIES_A', 'SERIES_B', 'SEED', 'PRE_LAUNCH_PHASE'])
    },
    href: faker.internet.url(),
    dashboardHref: faker.internet.url(),
    hasPlatformAgreement: faker.datatype.boolean(),
    links: [],
    members: [] // Populated later if needed
  }));
};

const generateVendors = (count) => {
  return Array.from({ length: count }).map(() => ({
    apiId: faker.string.alphanumeric(8),
    name: faker.company.name(),
    contacts: [
      {
        email: faker.internet.email(),
        givenName: faker.person.firstName(),
        familyName: faker.person.lastName(),
        willingToDiscuss: faker.datatype.boolean()
      }
    ],
    subcategories: [
      {
        category: {
          apiId: faker.string.alphanumeric(8),
          name: faker.commerce.department()
        },
        apiId: faker.string.alphanumeric(8),
        name: faker.commerce.productName()
      }
    ],
    pricing: `$${faker.number.int({ min: 100, max: 5000 })}/month`,
    vendorType: {
      displayName: 'Vendor',
      value: 'VENDOR'
    },
    vendorPointContact: faker.internet.email(),
    description: faker.lorem.paragraph(),
    pros: faker.lorem.sentence(),
    cons: faker.lorem.sentence(),
    discountInfo: faker.lorem.sentence(),
    feedbackFromOpCos: faker.lorem.sentence(),
    features: faker.lorem.sentence(),
    hasPlatformAgreement: faker.datatype.boolean(),
    created: faker.date.past().toISOString(),
    lastModified: faker.date.recent().toISOString(),
    links: []
  }));
};

const generateCeos = (count, companies) => {
  return Array.from({ length: count }).map(() => {
    const company = faker.helpers.arrayElement(companies);
    return {
      id: faker.string.alphanumeric(8),
      member: {
        email: faker.internet.email(),
        givenName: faker.person.firstName(),
        familyName: faker.person.lastName(),
        company: company
      },
      businessType: {
        value: 'B2B',
        displayName: 'B2B'
      },
      location: faker.location.city(),
      marketServiceArea: [faker.location.state()],
      customerSegment: [
        {
          value: 'HEALTH_PLAN',
          displayName: 'Health Plan'
        }
      ],
      healthcareSector: {
        value: 'BIOPHARMA_AND_DEVICE',
        displayName: 'Biopharma & Device'
      },
      businessFocusArea: [
        {
          value: 'APM_INCENTIVES',
          displayName: 'APM Incentives'
        }
      ],
      pictureHref: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
      additionalInfo: faker.lorem.sentence(),
      visible: {
        value: faker.helpers.arrayElement(['OPT_IN', 'OPT_OUT']),
        displayName: 'Opt in' // Simplified
      },
      linkedinHref: faker.internet.url(),
      links: []
    };
  });
};

const generateIpListings = (count) => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.alphanumeric(8),
    name: faker.commerce.productName(),
    organization: {
      name: faker.company.name(),
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
    executiveSummary: faker.lorem.paragraph(),
    therapeuticNeedOrTrendsBeingAddressed: faker.lorem.paragraph(),
    technologyOverview: faker.lorem.paragraph(),
    licenseRestriction: faker.datatype.boolean(),
    aboutLicenseRestriction: faker.lorem.paragraph(),
    preferredTerms: [
      {
        displayName: 'Equity',
        value: 'EQUITY'
      }
    ],
    preferredTermsOther: faker.lorem.sentence(),
    associatedFilesOrMedia: [],
    patentStatus: {
      displayName: 'Other',
      value: 'OTHER'
    },
    patentIssueDate: faker.date.past().toISOString(),
    patentGeographicValidity: [],
    patentGeographicValidityOther: faker.lorem.sentence(),
    patentStatusOtherInfo: faker.lorem.sentence(),
    disease: faker.lorem.word(),
    organOfFocus: [],
    technologyType: [
       {
          displayName: 'Medical Devices',
          value: 'MEDICAL_DEVICES'
        }
    ],
    speciality: [],
    sellerSummaryTechTransferApproach: faker.lorem.sentence(),
    responsibleInventor: faker.person.fullName(),
    technologyLevelOfMaturity: [],
    patentStatusHref: faker.internet.url(),
    freedomToOperateCertification: {
      displayName: 'Yes',
      value: 'YES'
    },
    legalPatentabilityAssessmentAvailable: true,
    copyrighted: true,
    links: [],
    metrics: {
        viewCount: faker.number.int(100),
        requestCount: faker.number.int(20)
    }
  }));
};

const generateData = () => {
  const companies = generateCompanies(100);
  const vendors = generateVendors(100);
  const ceos = generateCeos(50, companies);
  const ipListings = generateIpListings(100);
  
  // Specific users
  const users = [
    {
      email: 'sazh.katzroy@redesignhealth.com',
      givenName: 'Sazh',
      familyName: 'Katzroy',
      role: { authority: 'ROLE_SUPER_ADMIN', displayName: 'Super Admin' },
      memberOf: [],
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      ceoInfo: { id: '', ceo: false },
      picture: faker.image.avatar()
    }
  ];

  // Add more random users
  for(let i=0; i<50; i++) {
     users.push({
        email: faker.internet.email(),
        givenName: faker.person.firstName(),
        familyName: faker.person.lastName(),
        role: { authority: 'ROLE_OP_CO_USER', displayName: 'Company User' },
        memberOf: [faker.helpers.arrayElement(companies)],
        created: faker.date.past().toISOString(),
        lastModified: faker.date.recent().toISOString(),
        ceoInfo: { id: '', ceo: false },
        picture: faker.image.avatar()
     });
  }

  const db = {
    companies,
    vendors,
    ceos,
    ipListings,
    users,
    consents: [
        {
            type: { displayName: 'Terms of service', value: 'TERMS_OF_SERVICE' },
            version: 'f7170faf8d48561a00ea36adc22efc76',
            accepted: new Date().toISOString(),
            links: []
        }
    ]
  };

  const outputPath = path.join(__dirname, 'db.json');
  fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));
  console.log(`Data generated at ${outputPath}`);
};

generateData();
