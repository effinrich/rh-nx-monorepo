package com.redesignhealth.company.api.scaffolding;

import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.linkWithRel;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;

import com.redesignhealth.company.api.dto.SerializableEnum;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.expansion.Expansion;
import java.util.Arrays;
import java.util.stream.Collectors;
import org.springframework.restdocs.hypermedia.LinkDescriptor;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.restdocs.request.ParameterDescriptor;

/** Common documentation snippets shared across resources */
public class DocUtils {

  // Links

  public static FieldDescriptor linksField() {
    return subsectionWithPath("links").description("Links to other resources");
  }

  public static LinkDescriptor selfLink() {
    return linkWithRel("self").ignored();
  }

  // Auditing

  public static FieldDescriptor createdField() {
    return subsectionWithPath("created").description("Format: ISO 8601 timestamp.");
  }

  public static FieldDescriptor createdByField() {
    return subsectionWithPath("createdBy").description("Who creates the record");
  }

  public static FieldDescriptor lastModifiedField() {
    return subsectionWithPath("lastModified")
        .description("Format: ISO 8601 timestamp. When entity was last updated.");
  }

  public static FieldDescriptor lastModifiedFieldBy() {
    return subsectionWithPath("lastModifiedBy")
        .description("Who was the last person updating the record");
  }

  // Expansions

  public static ParameterDescriptor expandQueryParameter(Expansion... expansions) {
    return parameterWithName("expand")
        .description(
            "Available options: "
                + String.join(
                    ", ",
                    Arrays.stream(expansions).map((e) -> "`" + e.getFieldName() + "`").toList()));
  }

  public static FieldDescriptor memberOfField() {
    return subsectionWithPath("memberOf")
        .description("List of companies a person is a part of (requires `?expand=memberOf`)");
  }

  public static FieldDescriptor statusesField() {
    return subsectionWithPath("statuses")
        .description("Status of the person in different companies");
  }

  public static FieldDescriptor rolesField() {
    return subsectionWithPath("roles").description("Deprecated: use 'role' instead");
  }

  public static FieldDescriptor roleField() {
    return subsectionWithPath("role").description("Role a person has");
  }

  // Search

  public static ParameterDescriptor filterQueryParameter() {
    return parameterWithName("filter")
        .description(
            "Format: `?filter=fieldName,value1|value2`. Filter results based on a field=value1 or field=value2.");
  }

  public static ParameterDescriptor qQueryParameter() {
    return parameterWithName("q").description("Full-text search across all fields");
  }

  public static FieldDescriptor highlightedTextField() {
    return subsectionWithPath("highlightedText")
        .description(
            "Text snippets of full-text search matches. Highlighted text contained in `<em />` tags. (requires `?expand=highlightedText`)");
  }

  public static FieldDescriptor keyField() {
    return fieldWithPath("key").description("Search field name");
  }

  public static FieldDescriptor optionsField() {
    return fieldWithPath("options")
        .description(
            "Available field values to filter by and how many documents exist with that value.");
  }

  // Pagination

  public static FieldDescriptor[] pageFields() {
    return new FieldDescriptor[] {
      fieldWithPath("size").description("Requested page size"),
      fieldWithPath("number").description("Page number"),
      fieldWithPath("totalElements").description("Number of elements in the database"),
      fieldWithPath("totalPages").description("Number of pages available to scan"),
    };
  }

  public static ParameterDescriptor sortQueryParameter() {
    return parameterWithName("sort")
        .description("Format: ?sort=fieldName,asc|desc. Clients can sort by any response field.");
  }

  public static ParameterDescriptor pageQueryParameter() {
    return parameterWithName("page").description("Page number");
  }

  public static ParameterDescriptor sizeQueryParameter() {
    return parameterWithName("size").description("Page size");
  }

  public static String getPossibleValues(SerializableEnum[] values) {
    return "Currently supported: "
        + Arrays.stream(values).map(t -> "`" + t + "`").collect(Collectors.joining(", "));
  }

  public static FieldDescriptor parentIdField() {
    return fieldWithPath("parentId")
        .description("Reference to parent content. `null` means it is a root node.");
  }

  public static FieldDescriptor remoteContentIdField() {
    return fieldWithPath("remoteContentId")
        .description("Reference to a remote document. Used for content indexing.");
  }

  public static FieldDescriptor orderIdField() {
    return fieldWithPath("orderId")
        .description(
            "Integer representing the order of this content as laid out in a source hierarchy");
  }

  public static FieldDescriptor remoteContentSourceField() {
    return subsectionWithPath("remoteContentSource")
        .description(
            "Remote service associated with `remoteContentId`. "
                + getPossibleValues(RemoteContentSource.values()));
  }

  public static FieldDescriptor idField() {
    return fieldWithPath("id").description("Base62 encoded identifier");
  }

  public static FieldDescriptor hrefField() {
    return fieldWithPath("href").description("Company url");
  }

  public static FieldDescriptor stageField() {
    return fieldWithPath("stage").description("Stage for the Company: THEME|CONCEPT|OP_CO|NEW_CO");
  }

  public static FieldDescriptor childrenField() {
    return subsectionWithPath("children")
        .description("List of immediate descendants from content.");
  }

  public static FieldDescriptor descendantsField() {
    return subsectionWithPath("descendants").description("List of subtree content.");
  }

  public static FieldDescriptor ancestorsField() {
    return subsectionWithPath("ancestors")
        .description("List of all parent content to the root node.");
  }

  public static FieldDescriptor nameField() {
    return fieldWithPath("name").description("Internal name/shorthand for legal name");
  }

  public static FieldDescriptor legalNameField() {
    return fieldWithPath("legalName").description("Official name of corporation");
  }

  public static FieldDescriptor numberField() {
    return fieldWithPath("number")
        .description(
            "Used for placeholder shell entity name until legal name exists (i.e. RH Studio 2 OpCo [#], Inc.)");
  }

  public static FieldDescriptor descriptionField() {
    return fieldWithPath("description").description("Long-form copy about the company");
  }

  public static FieldDescriptor membersField() {
    return subsectionWithPath("members")
        .description("People with access to this company (requires `?expand=members`)");
  }

  public static FieldDescriptor emailField() {
    return fieldWithPath("email").description("Email registered with the platform");
  }

  public static FieldDescriptor givenNameField() {
    return fieldWithPath("givenName").description("Also known as a first name");
  }

  public static FieldDescriptor familyNameField() {
    return fieldWithPath("familyName").description("Also known as a last name");
  }

  public static LinkDescriptor membersLink() {
    return linkWithRel("members").description("People with access to this company");
  }

  public static LinkDescriptor companyLink() {
    return linkWithRel("company").description("Retrieve company information");
  }

  public static LinkDescriptor companiesLink() {
    return linkWithRel("companies").description("List of companies");
  }

  public static LinkDescriptor onboardDocsLink() {
    return linkWithRel("onboardDocs")
        .description(
            "Link to external onboard documentation. This link will be omitted if the documentation doesn't exist.");
  }

  // Research Hub
  public static FieldDescriptor taxonomyTag1Field() {
    return fieldWithPath("taxonomyTag1").description("Top-level taxonomy tag");
  }

  public static FieldDescriptor taxonomyTag2Field() {
    return fieldWithPath("taxonomyTag2").description("Second-level taxonomy tag");
  }

  public static FieldDescriptor taxonomyTag3Field() {
    return fieldWithPath("taxonomyTag3").description("Third-level taxonomy tag");
  }

  public static FieldDescriptor canAccessField() {
    return fieldWithPath("canAccess")
        .description("Determine if requester can access this document");
  }

  public static FieldDescriptor additionalTagsField() {
    return fieldWithPath("additionalTags")
        .description(
            "Any additional tags deemed relevant by notetaker pulled from existing list with ability to add new tags ad hoc");
  }

  public static FieldDescriptor attachmentsField() {
    return subsectionWithPath("attachments").description("Attached files");
  }

  public static FieldDescriptor companiesField() {
    return subsectionWithPath("companies").description("Associated OpCos, Concepts, and Themes");
  }

  public static FieldDescriptor stakeholdersField() {
    return fieldWithPath("stakeholders")
        .description(
            "Stakeholder(s) relevant to interview (Govt, Provider, Payer, Patient, Pharma & Life Sciences, GPOs & Distribution, Med Devices & Tech)");
  }

  public static FieldDescriptor companyIdsField() {
    return fieldWithPath("companyIds").description("Associate OpCos, Concepts, and Themes by id");
  }

  public static FieldDescriptor isAttachmentsDisclaimerAcceptedField() {
    return fieldWithPath("isAttachmentDisclaimerAccepted")
        .description("Required if user is uploading a Note with an attachment.");
  }

  public static FieldDescriptor nameVendorField() {
    return fieldWithPath("name").description("Name for the vendor");
  }

  public static FieldDescriptor apiIdField() {
    return subsectionWithPath("apiId").description("Identifier unique for the resource");
  }

  public static FieldDescriptor[] subcategoriesField() {
    return new FieldDescriptor[] {
      fieldWithPath("category.apiId").description("unique identifier for the category"),
      fieldWithPath("category.name").description("Category name"),
      fieldWithPath("apiId").description("identifier for the subcategory"),
      fieldWithPath("name").description("subcategory name"),
    };
  }

  public static FieldDescriptor pricingField() {
    return fieldWithPath("pricing").description("pricing");
  }

  public static FieldDescriptor hasPlatformAgreementField() {
    return fieldWithPath("hasPlatformAgreement")
        .description("Determine if the Platform agreement was signed or not.");
  }
}
