package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplaceSpeciality implements SerializableEnum {
  ALLERGY_AND_IMMUNOLOGY("Allergy and Immunology"),
  ANESTHESIOLOGY("Anesthesiology"),
  CARDIOLOGY("Cardiology"),
  DERMATOLOGY("Dermatology"),
  EMERGENCY_MEDICINE("Emergency Medicine"),
  ENDOCRINOLOGY("Endocrinology"),
  FAMILY_MEDICINE("Family Medicine"),
  GASTROENTEROLOGY("Gastroenterology"),
  GERIATRICS("Geriatrics"),
  HEMATOLOGY("Hematology"),
  INFECTIOUS_DISEASE("Infectious Disease"),
  INTERNAL_MEDICINE("Internal Medicine"),
  MEDICAL_GENETICS("Medical Genetics"),
  NEPHROLOGY("Nephrology"),
  NEUROLOGY("Neurology"),
  OBSTETRICS_AND_GYNECOLOGY_OB_GYN("Obstetrics and Gynecology (OB/GYN)"),
  OPHTHALMOLOGY("Ophthalmology"),
  ORTHOPEDICS("Orthopedics"),
  OTOLARYNGOLOGY_ENT("Otolaryngology (ENT)"),
  PALLIATIVE_MEDICINE("Palliative Medicine"),
  PATHOLOGY("Pathology"),
  PEDIATRICS("Pediatrics"),
  PHYSICAL_MEDICINE_AND_REHABILITATION("Physical Medicine and Rehabilitation"),
  PLASTIC_SURGERY("Plastic Surgery"),
  PSYCHIATRY("Psychiatry"),
  PULMONOLOGY("Pulmonology"),
  RADIATION_ONCOLOGY("Radiation Oncology"),
  RADIOLOGY("Radiology"),
  RHEUMATOLOGY("Rheumatology"),
  SLEEP_MEDICINE("Sleep Medicine"),
  SPORTS_MEDICINE("Sports Medicine"),
  UROLOGY("Urology");

  private final String displayName;

  IpMarketplaceSpeciality(String displayName) {
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
