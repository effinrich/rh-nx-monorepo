package com.redesignhealth.company.api.controller.util;

import org.springdoc.core.annotations.ParameterObject;

/**
 * Helpers for maintaining connections between path parameters and URI paths. This is useful for
 * Swagger documentation with {@link ParameterObject}s
 */
public class Paths {
  public static final String EMAIL_PATH_VARIABLE = "email";
  public static final String COMPANY_ID_PATH_VARIABLE = "companyId";
  public static final String COMPANY_VENDOR_ID_PATH_VARIABLE = "companyVendorId";
  public static final String VENDOR_ID_PATH_VARIABLE = "vendorId";
  public static final String LIBRARY_ID_PATH_VARIABLE = "libraryId";
  public static final String CATEGORY_ID_VARIABLE = "categoryId";

  public static final String CEO_ID_VARIABLE = "ceoId";
  public static final String IP_MARKETPLACE_ID_VARIABLE = "ipMarketplaceId";
  public static final String IP_MARKETPLACE_TRACK_ID_VARIABLE = "ipMarketplaceTrackId";

  public static final String SUB_CATEGORY_ID_VARIABLE = "subcategoryId";
  public static final String RESEARCH_ID_VARIABLE = "researchId";
  public static final String EXPERT_NOTE_ID_VARIABLE = "expertNoteId";
  public static final String CONTENT_ID_PATH_VARIABLE = "id";

  public static final String EMAIL = "/{" + EMAIL_PATH_VARIABLE + "}";
  public static final String COMPANY_ID = "/{" + COMPANY_ID_PATH_VARIABLE + "}";
  public static final String COMPANY_VENDOR_ID = "/{" + COMPANY_VENDOR_ID_PATH_VARIABLE + "}";
  public static final String VENDOR_ID = "/{" + VENDOR_ID_PATH_VARIABLE + "}";
  public static final String LIBRARY_ID = "/{" + LIBRARY_ID_PATH_VARIABLE + "}";
  public static final String CONTENT_ID = "/{" + CONTENT_ID_PATH_VARIABLE + "}";
  public static final String CATEGORY_ID = "/{" + CATEGORY_ID_VARIABLE + "}";
  public static final String SUB_CATEGORY_ID = "/{" + SUB_CATEGORY_ID_VARIABLE + "}";
  public static final String RESEARCH_ID = "/{" + RESEARCH_ID_VARIABLE + "}";
  public static final String EXPERT_NOTE_ID = "/{" + EXPERT_NOTE_ID_VARIABLE + "}";
  public static final String CEO_ID = "/{" + CEO_ID_VARIABLE + "}";
  public static final String IP_MARKETPLACE_ID = "/{" + IP_MARKETPLACE_ID_VARIABLE + "}";
  public static final String IP_MARKETPLACE_TRACK_ID =
      "/{" + IP_MARKETPLACE_TRACK_ID_VARIABLE + "}";
}
