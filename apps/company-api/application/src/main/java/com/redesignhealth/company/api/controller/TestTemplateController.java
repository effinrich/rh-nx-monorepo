package com.redesignhealth.company.api.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.dto.command.LibraryFeedbackCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBuyerRequestContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceNewMessageChatCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceSellerReleaseContactInfoCommand;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorChangeCommand;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.template.TemplateGenerator;
import com.redesignhealth.company.api.template.data.FormAnswer;
import com.redesignhealth.company.api.template.data.TechStackOption;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Controller for visual testing of templates */
@RestController
@RequestMapping("/public/test-template")
public class TestTemplateController {

  private final TemplateGenerator templateGenerator;

  public TestTemplateController(TemplateGenerator templateGenerator) {
    this.templateGenerator = templateGenerator;
  }

  @GetMapping
  public EntityModel<Map<Object, Object>> getTemplates() {
    return EntityModel.of(Map.of())
        .add(
            linkTo(TestTemplateController.class)
                .slash("/email/person-added")
                .withRel("person-added-email"))
        .add(
            linkTo(TestTemplateController.class)
                .slash("/email/infrastructure-ready")
                .withRel("infrastructure-ready-email"))
        .add(
            linkTo(TestTemplateController.class)
                .slash("/attachment/tech-stack")
                .withRel("tech-stack-attachment"))
        .add(
            linkTo(TestTemplateController.class)
                .slash("/attachment/privacy-questionnaire")
                .withRel("privacy-questionnaire-attachment"))
        .add(
            linkTo(TestTemplateController.class)
                .slash("/library/feedback")
                .withRel("library-feedback-email"))
        .add(linkTo(TestTemplateController.class).slash("/vendor/changes").withRel("vendor-change"))
        .add(
            linkTo(TestTemplateController.class)
                .slash("/revoke-gfolder-permission-failure")
                .withRel("revoke-permission-error"))
        .add(
            linkTo(TestTemplateController.class)
                .slash("/seller-contact-info")
                .withRel("seller-contact-info"));
  }

  @GetMapping(value = "/email/person-added", produces = MediaType.TEXT_HTML_VALUE)
  public String getPersonAdded(
      @RequestParam(defaultValue = "?email") String email,
      @RequestParam(defaultValue = "?givenName") String givenName,
      @RequestParam(defaultValue = "?portalHostname") String portalHostname,
      @RequestParam(defaultValue = "ROLE_RH_USER") RoleAuthority role,
      @RequestParam(defaultValue = "?adviseHostname") String adviseHostname) {
    Person p = Person.from(PersonRef.of(email));
    p.setGivenName(givenName);
    p.setRole(role);
    return templateGenerator.createPersonAddedEmail(
        p, URI.create(portalHostname), URI.create(adviseHostname));
  }

  @GetMapping(value = "/email/infrastructure-ready", produces = MediaType.TEXT_HTML_VALUE)
  public String getInfraComplete(
      @RequestParam(defaultValue = "https://example.com/github") String github,
      @RequestParam(defaultValue = "https://example.com/okta") String okta) {
    return templateGenerator.createInfrastructureReadyEmail(URI.create(github), URI.create(okta));
  }

  @GetMapping(value = "/attachment/tech-stack", produces = MediaType.TEXT_PLAIN_VALUE)
  public String getTechStack() {
    List<TechStackOption> options =
        List.of(
            TechStackOption.builder()
                .name("Nginx")
                .type("API Gateway")
                .optIn(false)
                .comment("We'll be providing our own API Gateway")
                .build(),
            TechStackOption.builder().type("Artifactory").name("ECR").optIn(true).build());
    return templateGenerator.createTechStackAttachment(options);
  }

  @GetMapping(value = "/attachment/privacy-questionnaire", produces = MediaType.TEXT_PLAIN_VALUE)
  public String getPrivacyQuestionnaire() {
    List<FormAnswer> options =
        List.of(
            FormAnswer.builder("q1-a")
                .answer("Yes")
                .comment("Email address, Phone Numbers")
                .build(),
            FormAnswer.builder("q2-a").answer("It depends").comment("Patient Names").build(),
            FormAnswer.builder("q3-a")
                .answer("It depends")
                .comment("Payment Transactions for some instances")
                .build(),
            FormAnswer.builder("q3-b")
                .answer("It depends")
                .comment("Sometimes we may store the credit card information during a request")
                .build(),
            FormAnswer.builder("q3-c")
                .comment("Database (Managed or Self Managed) or file system storage (S3)")
                .build());
    return templateGenerator.createPrivacyAttachment(options);
  }

  @GetMapping(value = "/email/library-feedback", produces = MediaType.TEXT_HTML_VALUE)
  public String getFeedback(
      @RequestParam(defaultValue = "?title") String title,
      @RequestParam(defaultValue = "?improvements") String improvements,
      @RequestParam(defaultValue = "?comments") String comments) {
    var feedback = new LibraryFeedbackCommand();
    feedback.setTitle(title);
    feedback.setImprovements(improvements);
    feedback.setComments(comments);
    return templateGenerator.createLibraryFeedbackEmail(feedback);
  }

  @GetMapping(value = "/vendor/changes", produces = MediaType.TEXT_HTML_VALUE)
  public String getCompanyVendorChanges(
      @RequestParam(defaultValue = "?type") String type,
      @RequestParam(defaultValue = "?createdByName") String createdByName,
      @RequestParam(defaultValue = "?name") String name,
      @RequestParam(defaultValue = "?companyName") String companyName,
      @RequestParam(defaultValue = "?categories") List<String> categories,
      @RequestParam(defaultValue = "?subcategories") List<String> subcategories) {
    var vendorChanges =
        CompanyVendorChangeCommand.of(
            type, createdByName, name, companyName, categories, subcategories);
    return templateGenerator.createCompanyVendorChangeEmail(vendorChanges);
  }

  @GetMapping(value = "/revoke-gfolder-permission-failure", produces = MediaType.TEXT_HTML_VALUE)
  public String getCompanyVendorChanges(
      @RequestParam(defaultValue = "?account_failure") List<String> accountFailure) {
    return templateGenerator.createRevokeGFolderPermissionErrorNotification(accountFailure);
  }

  @GetMapping(value = "/seller-contact-info", produces = MediaType.TEXT_HTML_VALUE)
  public String getSellerContactInfo(
      @RequestParam(defaultValue = "?ipName") String ipName,
      @RequestParam(defaultValue = "?buyerGivenName") String buyerGivenName,
      @RequestParam(defaultValue = "?buyerFamilyName") String buyerFamilyName,
      @RequestParam(defaultValue = "?buyerEmail") String buyerEmail,
      @RequestParam(defaultValue = "?sellerGivenName") String sellerGivenName,
      @RequestParam(defaultValue = "?sellerFamilyName") String sellerFamilyName,
      @RequestParam(defaultValue = "?sellerEmail") String sellerEmail,
      @RequestParam(defaultValue = "?companyName") String companyName,
      @RequestParam(defaultValue = "?portalHostname") String portalHostname) {

    var ipMarketplaceSellerReleaseContactInfo =
        IpMarketplaceSellerReleaseContactInfoCommand.of(
            ipName,
            buyerGivenName,
            buyerFamilyName,
            buyerEmail,
            sellerGivenName,
            sellerFamilyName,
            sellerEmail,
            companyName,
            URI.create(portalHostname));
    return templateGenerator.createSellerContactInfoNotification(
        ipMarketplaceSellerReleaseContactInfo);
  }

  @GetMapping(value = "/buyer-request-contact-info", produces = MediaType.TEXT_HTML_VALUE)
  public String getBuyerRequestContactInfo(
      @RequestParam(defaultValue = "?sellerGivenName") String sellerGivenName,
      @RequestParam(defaultValue = "?buyerCompanyName") String buyerCompanyName,
      @RequestParam(defaultValue = "?ipName") String ipName,
      @RequestParam(defaultValue = "?sellerEmail") String sellerEmail,
      @RequestParam(defaultValue = "?portalHostname") String portalHostname) {

    var ipMarketplaceBuyerRequestContactInfoCommand =
        IpMarketplaceBuyerRequestContactInfoCommand.of(
            sellerGivenName, buyerCompanyName, ipName, sellerEmail, URI.create(portalHostname));
    return templateGenerator.createBuyerContactInfoNotification(
        ipMarketplaceBuyerRequestContactInfoCommand);
  }

  @GetMapping(value = "/buyer-request-chat", produces = MediaType.TEXT_HTML_VALUE)
  public String getBuyerRequestChat(
      @RequestParam(defaultValue = "?sellerGivenName") String sellerGivenName,
      @RequestParam(defaultValue = "?buyerCompanyName") String buyerCompanyName,
      @RequestParam(defaultValue = "?ipName") String ipName,
      @RequestParam(defaultValue = "?sellerEmail") String sellerEmail,
      @RequestParam(defaultValue = "?portalHostname") String portalHostname) {

    var ipMarketplaceBuyerRequestContactInfoCommand =
        IpMarketplaceBuyerRequestContactInfoCommand.of(
            sellerGivenName, buyerCompanyName, ipName, sellerEmail, URI.create(portalHostname));
    return templateGenerator.createBuyerChatNotification(
        ipMarketplaceBuyerRequestContactInfoCommand);
  }

  @GetMapping(
      value = "/ip-marketplace-user-new-message-notification",
      produces = MediaType.TEXT_HTML_VALUE)
  public String ipMarketplaceUserNewMessageNotification(
      @RequestParam(defaultValue = "?firstName") String firstName,
      @RequestParam(defaultValue = "?ipMarketplaceName") String ipMarketplaceName,
      @RequestParam(defaultValue = "?replierCompanyName") String replierCompanyName,
      @RequestParam(defaultValue = "?unreads") int unreads,
      @RequestParam(defaultValue = "?email") String email,
      @RequestParam(defaultValue = "?portalHostname") String portalHostname) {

    var ipMarketplaceNewMessageChatCommand =
        IpMarketplaceNewMessageChatCommand.of(
            firstName,
            ipMarketplaceName,
            replierCompanyName,
            unreads,
            email,
            URI.create(portalHostname));
    return templateGenerator.createNewMessageNotificationChat(ipMarketplaceNewMessageChatCommand);
  }
}
