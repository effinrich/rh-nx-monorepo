package com.redesignhealth.company.api.template;

import com.redesignhealth.company.api.dto.command.LibraryFeedbackCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBuyerRequestContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceNewMessageChatCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceSellerReleaseContactInfoCommand;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorChangeCommand;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.template.data.FormAnswer;
import com.redesignhealth.company.api.template.data.TechStackOption;
import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/** Central location for generating HTML from Thymeleaf templates */
@Component
public class TemplateGenerator {

  private final TemplateEngine templateEngine;

  public TemplateGenerator(TemplateEngine templateEngine) {
    this.templateEngine = templateEngine;
  }

  public String createPersonAddedEmail(Person person, URI portalHostname, URI adviseHostname) {
    var showAdviseLink =
        person.getRole() != null && person.getRole().hasPermissionsOf(RoleAuthority.ROLE_RH_USER);
    var context =
        new Context(
            Locale.ENGLISH,
            Map.of(
                "person", person,
                "portalHostname", portalHostname,
                "showAdviseLink", showAdviseLink,
                "adviseHostname", adviseHostname));
    return templateEngine.process("email/person-added", context);
  }

  public String createInfrastructureReadyEmail(URI github, URI okta) {
    var context = new Context(Locale.ENGLISH, Map.of("github", github, "okta", okta));
    return templateEngine.process("email/infra-ready", context);
  }

  public String createTechStackAttachment(List<TechStackOption> options) {
    var context = new Context(Locale.ENGLISH, Map.of("options", options));
    return templateEngine.process("attachment/tech-stack", context);
  }

  public String createPrivacyAttachment(List<FormAnswer> answers) {
    var context = new Context(Locale.ENGLISH, Map.of("answers", answers));
    return templateEngine.process("attachment/privacy-questionnaire", context);
  }

  public String createLibraryFeedbackEmail(LibraryFeedbackCommand feedback) {
    var context = new Context(Locale.ENGLISH, Map.of("feedback", feedback));
    return templateEngine.process("email/library-feedback", context);
  }

  public String createCompanyVendorChangeEmail(
      CompanyVendorChangeCommand companyVendorChangeCommand) {
    var context = new Context(Locale.ENGLISH, Map.of("change", companyVendorChangeCommand));
    return templateEngine.process("email/vendor-change", context);
  }

  public String createRevokeGFolderPermissionErrorNotification(List<String> accountFailure) {
    var context = new Context(Locale.ENGLISH, Map.of("emails", accountFailure));
    return templateEngine.process("email/revoke-permission-error", context);
  }

  public String createSellerContactInfoNotification(
      IpMarketplaceSellerReleaseContactInfoCommand command) {
    var context = new Context(Locale.ENGLISH, Map.of("sellerContactInfo", command));
    return templateEngine.process("email/seller-contact-info", context);
  }

  public String createBuyerContactInfoNotification(
      IpMarketplaceBuyerRequestContactInfoCommand command) {
    return createTemplateForTheBuyer(command, "email/buyer-request-contact-info");
  }

  public String createBuyerChatNotification(IpMarketplaceBuyerRequestContactInfoCommand command) {
    return createTemplateForTheBuyer(command, "email/buyer-request-chat-seller");
  }

  public String createNewMessageNotificationChat(IpMarketplaceNewMessageChatCommand command) {
    var context = new Context(Locale.ENGLISH, Map.of("notification", command));
    return templateEngine.process("email/ip-marketplace-user-new-message-notification", context);
  }

  private String createTemplateForTheBuyer(
      IpMarketplaceBuyerRequestContactInfoCommand command, String templateName) {
    var context = new Context(Locale.ENGLISH, Map.of("buyerRequest", command));
    return templateEngine.process(templateName, context);
  }
}
