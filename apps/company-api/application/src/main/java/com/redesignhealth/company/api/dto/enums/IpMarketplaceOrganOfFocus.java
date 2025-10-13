package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplaceOrganOfFocus implements SerializableEnum {
  ADRENAL_GLANDS("Adrenal glands"),
  APPENDIX("Appendix"),
  BLADDER("Bladder"),
  BONES("Bones"),
  BONE_MARROW("Bone marrow"),
  BRAIN("Brain"),
  BRONCHI("Bronchi"),
  DIAPHRAGM("Diaphragm"),
  EARS("Ears"),
  ESOPHAGUS("Esophagus"),
  EYES("Eyes"),
  FALLOPIAN_TUBES("Fallopian tubes"),
  GALLBLADDER("Gallbladder"),
  GENITALS("Genitals"),
  HEART("Heart"),
  HYPOTHALAMUS("Hypothalamus"),
  JOINTS("Joints"),
  KIDNEYS("Kidneys"),
  LARGE_INTESTINE("Large intestine"),
  LARYNX("Larynx"),
  LIVER("Liver"),
  LUNGS("Lungs"),
  LYMPH_NODES("Lymph nodes"),
  MAMMARY_GLANDS("Mammary glands"),
  MESENTERY("Mesentery"),
  MOUTH("Mouth"),
  NASAL_CAVITY("Nasal cavity"),
  NOSE("Nose"),
  OVARIES("Ovaries"),
  PANCREAS("Pancreas"),
  PINEAL_GLAND("Pineal gland"),
  PITUITARY_GLAND("Pituitary gland"),
  PROSTATE("Prostate"),
  RECTUM("Rectum"),
  SALIVARY_GLANDS("Salivary glands"),
  SKELETAL_MUSCLES("Skeletal muscles"),
  SKIN("Skin"),
  SMALL_INTESTINE("Small intestine"),
  SPINAL_CORD("Spinal cord"),
  SPLEEN("Spleen"),
  STOMACH("Stomach"),
  TEETH("Teeth"),
  TESTES("Testes"),
  THYMUS("Thymus"),
  THYROID_GLAND("Thyroid gland"),
  TONGUE("Tongue"),
  TRACHEA("Trachea"),
  URETERS("Ureters"),
  UTERUS("Uterus"),
  VEINS("Veins");

  private final String displayName;

  IpMarketplaceOrganOfFocus(String displayName) {
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
