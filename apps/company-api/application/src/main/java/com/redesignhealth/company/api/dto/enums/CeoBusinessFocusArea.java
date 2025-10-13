package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CeoBusinessFocusArea implements SerializableEnum {
  APM_INCENTIVES_DESIGN("APM Incentives Design"),
  BENEFITS("Benefits"),
  CANCER_CARE("Cancer Care"),
  CARDIOLOGY("Cardiology"),
  CHILD_DEVELOPMENT("Child Development"),
  CARDIOVASCULAR_HEALTH("Cardiovascular Health"),
  CLINICAL_TRIAL_FINANCIAL_MANAGEMENT("Clinical Trial Financial Management"),
  COGNITIVE_HEALTH("Cognitive Health"),
  COMPLEMENTARY_AND_ALTERNATIVE_MEDICINE("Complementary and Alternative Medicine"),
  CONCIERGE_BENEFIT_TO_INCREASE_EMPLOYEE_RETENTION_PRODUCTIVITY_AND_MORALE(
      "Concierge Benefit to Increase Employee Retention, Productivity, and Morale"),
  CONTRACT_MANAGEMENT("Contract Management"),
  COSMETIC_DERMATOLOGY("Cosmetic Dermatology"),
  ECOMMERCE("eCommerce"),
  ENDOCRINOLOGY_OR_DIABETES("Endocrinology / Diabetes"),
  GASTROINTESTINAL_COMPLAINTS_AND_DISEASES("Gastrointestinal Complaints and Diseases"),
  HAIR_LOSS("Hair Loss"),
  HEALTHCARE_PAYMENTS("Healthcare Payments"),
  HOME_BASED_CARE("Home-Based Care"),
  HOSPITAL_DISCHARGE_AND_TRANSITION_CARE_MANAGEMENT(
      "Hospital Discharge and Transition Care Management"),
  INFUSION_OR_CHRONIC_CONDITIONS("Infusion / Chronic Conditions"),
  KIDNEY_CARE("Kidney Care"),
  MEDIA_AND_SENIOR_ENGAGEMENT("Media and Senior Engagement"),
  MEDICAL_CREDENTIALING_AND_NETWORK_MANAGEMENT("Medical Credentialing & Network Management"),
  MEDICARE("Medicare"),
  MEDICARE_ADVANTAGE("Medicare Advantage"),
  MENTAL_HEALTH("Mental Health"),
  NEUROLOGY("Neurology"),
  OBESITY("Obesity"),
  PEDIATRIC_MENTAL_HEALTH("Pediatric Mental Health"),
  PEDIATRIC_PRIMARY_CARE("Pediatric Primary Care"),
  PEO_FOR_INDEPENDENT_HEALTHCARE_PRACTICES("PEO for independent healthcare practices"),
  PERIOPERATIVE_CARE("Perioperative Care"),
  PHARMA_SAAS("Pharma SaaS"),
  PHYSICAL_THERAPY("Physical Therapy"),
  PRESCRIPTION_REGIMEN_OPTIMIZATION("Prescription Regimen Optimization"),
  PATIENT_ADHERENCE("Patient Adherence"),
  PRIMARY_CARE("Primary Care"),
  PROVIDER_NETWORK("Provider Network"),
  PSYCHEDELICS("Psychedelics"),
  SENIOR_CARE_OR_SDOH("Senior Care / SDOH"),
  SENIOR_HEALTH_INSURANCE("Senior Health Insurance"),
  SOCIAL_DETERMINANTS_OF_HEALTH("Social Determinants of Health"),
  SPECIALTY_CARE("Specialty Care"),
  SSBCI_PROGRAMS("SSBCI Programs"),
  SUPPLEMENTAL_BENEFITS("Supplemental Benefits"),
  UNPAID_CAREGIVER_ENGAGEMENT("Unpaid Caregiver Engagement"),
  VIRTUAL_SPECIALTY_CARE("Virtual Specialty Care"),
  WOMENS_HEALTH("Women's Health"),
  WORKFLOW_AUTOMATION("Workflow Automation"),
  WORKFORCE_EDUCATION("Workforce Education");

  private final String displayName;

  CeoBusinessFocusArea(String displayName) {
    this.displayName = displayName;
  }

  @Override
  public String getValue() {
    return this.name();
  }

  @Override
  public String getDisplayName() {
    return this.displayName;
  }
}
