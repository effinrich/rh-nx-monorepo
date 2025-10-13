import { faker } from '@faker-js/faker'

export const companyTaxonomy = {
  CARE_DELIVERY: {
    name: 'Care Delivery',
    children: {
      CLINICAL_OPERATIONS: {
        name: 'Clinical Operations',
        children: {
          CARE_TEAM_COORDINATION: 'Care Team Coordination',
          CLINICAL_DECISION_SUPPORT: 'Clinical Decision Support',
          CLINICAL_DOCUMENTATION: 'Clinical Documenation',
          CLINICAL_POD_DELIVERY: 'Clinical Pod Delivery',
          CLINICAL_WORKFLOW_MANAGEMENT: 'Clinical Workflow Management',
          LAST_MILE_CARE: 'Last Mile Care',
          ONSITE_CARE_DELIVERY_SOLUTIONS: 'Onsite Care Delivery Solutions'
        }
      },
      VIRTUAL_CARE_OPERATIONS: {
        name: 'Virtual Care Operations',
        children: {
          REMOTE_PATIENT_MONITORING: 'Remote Patient Monitoring',
          TELEHEALTH_PLATFORM: 'Telehealth Platform',
          VIRTUAL_PROVIDER_NETWORK: 'Virtual Provider Network',
          THERAPEUTICS: 'Therapeutics'
        }
      },
      PATIENT_SUPPORT_COMMUNICATIONS: {
        name: 'Patient Support and Communications',
        children: {
          PATIENT_ENROLLMENT_AND_ACTIVATION:
            'Patient Enrollment and Activation',
          CARE_PLAN_MANAGEMENT: 'Care Plan Management',
          SECURE_PATIENT_MESSAGING: 'Secure Patient Messaging',
          COORDINATION_AND_NAVIGATION: 'Coordination and Navigation',
          EXPERIENCE: 'Experience',
          PROFILE_AND_STRATIFICATION: 'Profile and Stratification'
        }
      },
      ANCILLARY_SERVICES_TREATMENT: {
        name: 'Ancillary Services / Treatment',
        children: {
          DURABLE_MEDICAL_EQUIPMENT: 'Durable Medical Equipment',
          IMAGING: 'IMAGING',
          LABS: 'Labs',
          PRESCRIPTIONS: 'Prescriptions',
          THERAPY_INTERVENTIONS: 'Therapy / Interventions'
        }
      },
      REFERRALS_AND_SPECIALTY_NETWORKS: {
        name: 'Referrals and Specialty Networks',
        children: {
          PRIOR_AUTHORIZATION: 'Prior Authorization',
          ELECTRONIC_CONSULTS: 'Electronic Consults',
          REFERALS: 'Referrals',
          SOCIAL_CARE: 'Social Care',
          CENTER_OF_EXCELLENCE: 'Center of Excellence',
          COLLABORATION_COMMUNICATION: 'Collaboration and Communication'
        }
      },
      ECOSYSTEM: {
        name: 'Ecosystem',
        children: {
          TRANSITIONS_IN_CARE: 'Transitions in Care',
          UTILIZATION_MANAGEMENT: 'Utilization Management',
          POST_ACUTE_PARTNERS: 'Post Acute Partners',
          SPECIALTY_CARE_CENTERS: 'Specialty Care Centers',
          ACUTE_NEEDS: 'Acute Needs'
        }
      }
    }
  },
  HEALTHCARE_ADMIN: {
    name: 'Healthcare Admin',
    children: {
      PATIENT_MEMBER_ADMIN: {
        name: 'Patient or Member Admin',
        children: {
          CONSENT_SCREENERS_AIDS_FORM_BUILDING:
            'Consent, Screeners, AIDs and Form Building',
          IDENTITY_VERIFICATION: 'Identity Verification',
          PATIENT_INTAKE_ASSESSMENT: 'Patient Intake and Assessment',
          PATIENT_SCHEDULING: 'Patient Scheduling',
          ATTRIBUTION_AND_ASSIGNMENT: 'Attribution and Assignment',
          BENEFITS_EDUCATION: 'Benefits Education',
          RISK_STRATIFICATION_LOGIC: 'Risk Stratification Logic'
        }
      },
      PERSONNEL_RECRUITMENT_AND_STAFFING: {
        name: 'Personnel Recruitment and Staffing',
        children: {
          LOCUMS_TENENS: 'Locums Tenes',
          AGENCY: 'Agency',
          PER_DIEM: 'Per Diem',
          PERSONNEL_MANAGEMENT: 'Personnel Management',
          RECRUITMENT: 'Recruitment'
        }
      },
      PHYSICIAN_AND_PRACTICE_ADMIN: {
        name: 'Physician and Practice Admin',
        children: {
          PROVIDER_WORKFLOW_TOOLS: 'Provider Workflow Tools',
          ANCILLARY_SERVICE_EXPANSION: 'Ancillary Service Expansion',
          EHR_DATA_POC_INSIGHTS: 'EHR Data POC Insights',
          EXPENSE_MGMT_SOLUTION_EFFICIENCY:
            'Expense Management and Solution Efficiency',
          PATIENT_ACQUISITION_GROW: 'Patient Acquisition and Growth',
          ADMINISTRATIVE_TASK_MGMT: 'Administrative Task Management',
          PROVIDER_NETWORK_MGMT: 'Provider Network Management',
          CREDENTIALING: 'Credentialing',
          CONTRACTING: 'Contracting'
        }
      },
      PAYOR_ADMIN: {
        name: 'Payor Admin',
        children: {
          PRODUCT_DEVELOPMENT_MGMT: 'Product Development/Management',
          REGULATORY_CHANGE_READINESS_PLATFORM_PERFORMANCE:
            'Regulatory Change Readiness and Platform Performance',
          PROVIDER_NETWORKS: 'Provider Networks',
          MARKETING: 'Marketing',
          SALES: 'Sales',
          ENROLLMENT: 'Enrollment',
          CUSTOMER_EXPERIENCE: 'Customer Experience',
          COMPLIANCE: 'Compliance',
          QUALITY_MANAGEMENT: 'Quality Management',
          HEALTH_MANAGEMENT: 'Health Management',
          CLAIMS_REIMBURSEMENT: 'Claims/Reimbursement',
          REPORTING_AND_ANALYTICS: 'Reporting and Analytics',
          VERTICAL_INTEGRATION: 'Vertical Integration'
        }
      },
      FINANCIAL_SERVICES: {
        name: 'Financial Services',
        children: {
          CLEARINGHOUSE: 'Clearinghouse',
          CODING: 'Coding',
          ELIGIBILITY_COPAY: 'Eligibility and Copay',
          MEDICAL_BILLING: 'Medical Billing',
          PATIENT_BILLING_COLLECTION: 'Patient Billing and Collection',
          CAPITATION_PAYMENT_PROCESSING: 'Capitation Payment Processing',
          REVENUE_CYCLE_MGMT: 'Revenue Cycle Management',
          FUNDS_FLOW_MGMT: 'Funds Flow Management',
          FACTORING: 'Factoring',
          REVENUE_MAXIMIZATION: 'Revenue Maximization'
        }
      },
      CENTRALIZED_RESOURCE_MGMT: {
        name: 'Centralized Resource Management',
        children: {
          BENEFITS_ADMINISTRATION: 'Benefits Administration',
          PATIENT_ASSIGNMENT: 'Patient Assignment',
          ALERTS_NOTIFICATIONS: 'Alerts and Notifications',
          TRAINING_DEVELOPMENT: 'Training and Development'
        }
      }
    }
  },
  DATA_ANALYTICS: {
    name: 'Data Analytics',
    children: {
      INTEROPERABILITY: {
        name: 'Interoperability',
        children: {
          CLAIMS_DATA: 'Claims Data',
          CLINICAL_DATA: 'Clinical Data',
          ENCOUNTER_NOTIFICATION_SERVICES: 'Encounter Notification Services',
          PATIENT_GENERATED_HEALTH_DATA: 'Patient Generated Health Data',
          ENTITY_ENTITY_DATA_SHARING: 'Entity-entity data sharing',
          QUALIFIED_HEALTH_INFORMATION_NETWORK:
            'Qualified Health Information Network',
          ACCESS_ENABLEMENT: 'Access Enablement',
          EXTRACT_TRANSFORM_LOAD: 'Extract, Transform and Load (ETL)'
        }
      },
      ANALYTICS: {
        name: 'Analytics',
        children: {
          PATIENT_PRACTICE_INSIGHTS: 'Patient and Practice Insights',
          DATA_QUALITY: 'Data Quality',
          DATA_WAREHOUSING: 'Data Warehousing',
          EPISODE_GROUPERS: 'Episode Groupers',
          ACTUARIAL_SERVICES: 'Actuarial Services'
        }
      },
      AUTOMATION: {
        name: 'Automation',
        children: {
          MACHINE_LEARNING: 'Machine Learning',
          ARTIFICIAL_INTELLIGENCE_NLP: 'Artificial Intelligence / NLP',
          ROBOTIC_PROCESS_AUTOMATION: 'Robotic Process Automation'
        }
      },
      HEALTHCARE_ECONOMICS: {
        name: 'Healthcare Economics',
        children: {
          COST_OF_CARE_MODELING: 'Cost of Care Modeling',
          CONTRACT_PERFORMANCE_STRATEGIC_PLANNING:
            'Contract Performance and Strategic Planning',
          UNDERWRITING: 'Underwriting'
        }
      }
    }
  },
  REGULATORY_COMPLIANCE: {
    name: 'Regulatory and Compliance',
    children: {
      GOVT_AND_COMMERCIAL_PROGRAMS: {
        name: 'Government and Commercial Programs',
        children: {
          GRANT_WRITING: 'Grant Writing',
          CMMI_MODEL_EVALUATION: 'CMMI Model Evaluation',
          TRAINING_EDUCATION: 'Training and Education'
        }
      },
      // SECURITY: 'Security',
      // PRIVACY_CONFIDENTIALITY: 'Privacy and Confidentiality',
      // CYBERSECURITY: 'Cybersecurity',
      AUDITS_AND_COMPLIANCE: {
        name: 'Audits and Compliance',
        children: {
          CLINICAL_SITE_VISITS: 'Clinical Site Visits',
          PAYER_FINANCIAL_COMPLIANCE_AUDITS:
            'Payer Financial/Compliance Audits',
          PAYOR_CLINICAL_AUDITS: 'Payor Clinical Audits'
        }
      },
      PLAN_SUBMISSION: {
        name: 'Plan Submission',
        children: {
          BENEFITS: 'Benefits',
          PRICING: 'Pricing',
          SERVICE_AUTHORIZATION_RULES: 'Service Authorization Rules',
          NETWORK_DEVELOPMENT: 'Network Development'
        }
      },
      LICENSURE: {
        name: 'Licensure',
        children: {
          FACILITY_LICENSURE: 'Facility Licensure',
          FACILITY_COMPLIANCE: 'Facility Compliance',
          PROVIDER_LICENSURE: 'Provider Licensure',
          PROVIDER_COMPLIANCE: 'Provider Compliance'
        }
      },
      PRICE_TRANSPARENCY: {
        name: 'Price Transparency',
        children: {
          FEE_SCHEDULE_REGISTERS: 'Fee Schedule Registers',
          PRICE_ESTIMATION: 'Price Estimation',
          REAL_TIME_ADJUDICATION: 'Real Time Adjudication'
        }
      }
    }
  },
  ENABLING_INFRASTRUCTURE: {
    name: 'Enabling Infrastructure',
    children: {
      VALUE_BASED_CARE_SUPPORT: {
        name: 'Value Based Care Support',
        children: {
          CONVENER_PROVIDER_ENABLEMENT: 'Convener Provider Enablement',
          RISK_ADJUSTMENT_DOCUMENTATION: 'Risk Adjustment and Documentation',
          QUALITY_MEASURES_STAR_MEASURES: 'Quality Measures and Star Measures',
          OPTIMIZED_MEDICATION_MGMT: 'Optimized Medication Management',
          MERGERS_ACQUISITIONS_AGGREGATION:
            'Mergers, Acquisitions, and Aggregation'
        }
      },
      OPTIMIZING_PERFORMANCE: {
        name: 'Optimizing Performance',
        children: {
          MGMT_SERVICES_ORGANIZATION: 'Management Services Organization',
          FINANCIAL_INCENTIVES_REWARDS: 'Financial Incentives Rewards',
          SALES_CRM_TOOLS: 'Sales CRM Tools',
          CONTRACT_MGMT_SOLUTION: 'Contract Management Solution'
        }
      },
      MARKETPLACE: {
        name: 'Marketplace',
        children: {
          CUSTOMER_ACQUISITION_GROWTH: 'Customer Acquisition and Growth',
          CONSUMER_GOODS: 'Consumer Goods',
          PRODUCT_SERVICES: 'Product and Services'
        }
      },
      PATIENT_COORDINATION: {
        name: 'Patient Coordination',
        children: {
          DIRECT_TO_CONSUMER_MODELS: 'Direct to Consumer Models',
          PATIENT_ACTIVATION: 'Patient Activation',
          DIRECT_TO_PROVIDER_MODELS: 'Direct to Provider Models',
          ADDRESSING_SDOH: 'Addressing SDOH'
        }
      },
      NETWORK_MGMT: {
        name: 'Network Management',
        children: {
          POST_ACUTE_SERVICES: 'Post Acute Services',
          SERVICE_UTILIZATION_MGMT: 'Service Utilization Management',
          SECOND_OPINIONS: 'Second Opinions',
          CURBSIDE_CONSULTATION: 'Curbside Consultation',
          APPROPRIATE_SITE_OF_SERVICE: 'Appropriate Site of Service'
        }
      }
    }
  }
}

export function randomTaxonomy() {
  const tax1Key = faker.helpers.objectKey(companyTaxonomy)
  const tax1Val = companyTaxonomy[tax1Key].name
  const tax2Key = faker.helpers.objectKey(companyTaxonomy[tax1Key].children)
  const tax2Val = companyTaxonomy[tax1Key].children[tax2Key]['name']
  const tax3Key = faker.helpers.objectKey(
    companyTaxonomy[tax1Key]['children'][tax2Key]['children']
  )
  const tax3Val =
    companyTaxonomy[tax1Key].children[tax2Key]['children'][tax3Key]

  return [
    { key: tax1Key, value: tax1Val },
    { key: tax2Key, value: tax2Val },
    { key: tax3Key, value: tax3Val }
  ]
}
