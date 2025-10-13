import { DrawerFormAccordionProps } from '@redesignhealth/portal/ui'

export const formItems: Record<
  string,
  {
    groupLabel: string
    groupItems: Array<{
      categoryName: string
      serviceName: string
      learnMoreItems?: DrawerFormAccordionProps['listItems']
    }>
  }
> = {
  service: {
    groupLabel: 'Service Infrastructure',
    groupItems: [
      {
        categoryName: 'Artifactory',
        serviceName: 'AWS ECR'
      },
      {
        categoryName: 'CI',
        serviceName: 'Github Actions'
      },
      {
        categoryName: 'Code Repo',
        serviceName: 'Github'
      },
      {
        categoryName: 'Secured KV',
        serviceName: 'Hashicorp - Vault',
        learnMoreItems: [
          {
            header: 'Vault by Hashicorp',
            items: [
              'Vault is the industry standard for storing and persisting secure and sensitive data set some small example',
              'Vault is an open source system, that is cloud agnostic ',
              'Vault has a polyglot SDK to allow for integration natively to all popular languages and frameworks ',
              'Vault has a very friendly UI that will allow non-tech access to manage and persist data in a very secure way ',
              'Vault uses a 256-bit Advanced Encryption Standard (AES) cipher in the Galois Counter Mode (GCM) with 96-bit nonces',
              'Offer is either Managed or Self Hosted based on company level of comfort'
            ]
          }
        ]
      },
      {
        categoryName: 'DNS',
        serviceName: 'Route 53',
        learnMoreItems: [
          {
            header: 'Route 53',
            items: [
              'Route-53 is a cloud edge service that will allow for complex DNS interoperability ',
              'Features include DNS Failover, Health check and monitoring, ELB integration, Private VPC ',
              'As this is an edge service we prefer to stick with Cloud vendor offering to leverage the interplay with other edge components',
              'Managed Service'
            ]
          }
        ]
      },
      {
        categoryName: 'DDOS Protection',
        serviceName: 'AWS WAF',
        learnMoreItems: [
          {
            header: 'Web Application Firewall',
            items: [
              'AWS - WAF is an AWS edge service that will enable the ability to provide Tier 1 Firewall and DDOS protection against components within the stack. This is necessary for compliance with many Security Frameworks',
              'Features include Web Traffic Filtering, Bot control, Account Takeover Fraud Prevention, Real-Time visibility and integration with AWS firewall manager',
              'As this is an edge service we prefer to stick with Cloud vendor offering to leverage the interplay with other edge components',
              'Managed Service '
            ]
          }
        ]
      },
      {
        categoryName: 'API Gateway',
        serviceName: 'NGINX',
        learnMoreItems: [
          {
            header: 'Nginx',
            items: [
              'Nginx is an open source, free server and reverse proxy and considered industry standard tool.',
              'It is very highly performant across the HTTP, IMAP/POP',
              'It is provides Layer 7 features such as Load balancing',
              'Very large pull of resources about nginx online and easy to hire to support',
              'Will be the key ingress into the services and software developed',
              'Low to maintenance and very easy to use and learn',
              'Integrates natively with all cloud providers edge service offerings ',
              'Offer is either Managed or Self Hosted based on Company level of comfort'
            ]
          }
        ]
      },
      {
        categoryName: 'CIAM (Internal)',
        serviceName: 'Google + Cognito',
        learnMoreItems: [
          {
            header: 'Oauth 2.0',
            items: [
              'For OAuth we will use google to authenticate the use against the Google workspace',
              'All users to an infrastructure will first be added to the Google workspace as a standard practice ',
              'This will allow for a no cost initial entry to getting authentication into the infra and platform resources ',
              'This will be managed from a single location that can be authenticated and managed via google',
              'Once an company is ready to establish a native CIAM we can migrate to okta',
              'Google: will provide a free no effort management for Oauth (Standard - Recommended)',
              'Okta will allow for growth and an advanced management fidelity for future growth (Optional)'
            ]
          }
        ]
      },
      {
        categoryName: 'Config Management Infra',
        serviceName: 'Terraform',
        learnMoreItems: [
          {
            header: 'Terraform',
            items: [
              'Terraform templates allows for the platform to initiate and kick off specific infrastructure choices to size the build out properly for the company',
              'Terraform templates will allow RH-Platform to centralize and version control an offering for an company that can be replayed via the Platform UI or forked allowing Companies to always have access to the latest RH offering',
              'Templates allows for a modernization of the UI experience to make it simple for a non-tech user to kick off a build out and for more technical users to bypass the UI and use the templates directly',
              'Terraform is open source and free, and will be managed and maintained by RH for platform use which guarantees companies has the latest and greatest version available'
            ]
          }
        ]
      },
      {
        categoryName: 'Config Management Dynamic',
        serviceName: 'Vault'
      },
      {
        categoryName: 'Image Orchestration',
        serviceName: 'ECS',
        learnMoreItems: [
          {
            header: 'Elastic Container Service',
            items: [
              'Very simple way to deploy applications onto an infrastructure ',
              'Simple orchestration that will solve the generic use-case for small marketing websites',
              'Automatically scales applications',
              'Standard level of availability and security',
              'Longer term can migrate to EKS depending on use case'
            ]
          }
        ]
      },
      {
        categoryName: 'Storage',
        serviceName: 'S3',
        learnMoreItems: [
          {
            header: 'Simple Storage Service',
            items: [
              'AWS S3 is the standard offering for general purpose storage that can be used across various Open source tools.',
              'S3 is low cost and highly scalable',
              'Derivative is available on all cloud providers'
            ]
          }
        ]
      },
      {
        categoryName: 'CDN',
        serviceName: 'CloudFront'
      }
    ]
  },
  'telemetry & data': {
    groupLabel: 'Telemetry and Data Infrastructure',
    groupItems: [
      {
        categoryName: 'Metrics',
        serviceName: 'Cloud Watch',
        learnMoreItems: [
          {
            header: 'Cloud Watch',
            items: [
              'Cloud watch will be the recommend first offering for Logging and events',
              'Secondary offering of ELK will be provided for more advanced abilities ',
              'Allows for a AWS centric solution for capturing logs and providing an interface to view. ',
              'Integrates easily with all AWS solutions'
            ]
          }
        ]
      },
      {
        categoryName: 'Metrics Visualization',
        serviceName: 'Cloud Watch',
        learnMoreItems: [
          {
            header: 'Cloud Watch',
            items: [
              'Cloud watch will be the recommend first offering for Logging and events',
              'Secondary offering of ELK will be provided for more advanced abilities ',
              'Allows for a AWS centric solution for capturing logs and providing an interface to view. ',
              'Integrates easily with all AWS solutions'
            ]
          }
        ]
      },
      {
        categoryName: 'Logging Visualization',
        serviceName: 'Cloud Watch',
        learnMoreItems: [
          {
            header: 'Cloud Watch',
            items: [
              'Cloud watch will be the recommend first offering for Logging and events',
              'Secondary offering of ELK will be provided for more advanced abilities ',
              'Allows for a AWS centric solution for capturing logs and providing an interface to view. ',
              'Integrates easily with all AWS solutions'
            ]
          }
        ]
      }
    ]
  }
}
