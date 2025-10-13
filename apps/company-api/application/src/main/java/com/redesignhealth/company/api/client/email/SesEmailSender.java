package com.redesignhealth.company.api.client.email;

import com.redesignhealth.company.api.dto.command.LibraryFeedbackCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBuyerRequestContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceNewMessageChatCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceSellerReleaseContactInfoCommand;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorChangeCommand;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.template.TemplateGenerator;
import java.net.URI;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;
import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.Message;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

/** AWS Simple Email Sender (SES) client */
public class SesEmailSender implements EmailSender {
  private static final Logger logger = LoggerFactory.getLogger(SesEmailSender.class);
  private final SesV2Client client;
  private final TemplateGenerator templateGenerator;
  private static final String FROM = "noreply@redesignhealth.com";

  public SesEmailSender(SesV2Client client, TemplateGenerator templateGenerator) {
    this.client = client;
    this.templateGenerator = templateGenerator;
  }

  @Override
  public void sendPersonAdded(Person recipient, URI portalHostname, URI adviseHostname) {
    Assert.notNull(recipient.getEmail(), "Email must not be null");
    Assert.notNull(recipient.getGivenName(), "Given name must not be null");
    Assert.notNull(portalHostname, "Portal Hostname must not be null");
    Assert.notNull(adviseHostname, "Advise Hostname must not be null");

    String subject = "Welcome to Redesign Health!";
    String to = recipient.getEmail().value();
    String body =
        templateGenerator.createPersonAddedEmail(recipient, portalHostname, adviseHostname);
    sendEmail(List.of(to), body, subject, "\"Person Added\" email sent to {}");
  }

  @Override
  public void sendInfrastructureReady(Set<Person> recipients, URI github, URI sso) {
    String subject = "Infrastructure Request Completed";
    List<String> to = recipients.stream().map(p -> p.getEmail().value()).toList();
    String body = templateGenerator.createInfrastructureReadyEmail(github, sso);
    sendEmail(to, body, subject, "\"Infrastructure Ready\" email sent to {}");
  }

  @Override
  public void sendLibraryFeedback(List<String> recipients, LibraryFeedbackCommand feedback) {
    String subject = "An item in Library has received feedback";
    String body = templateGenerator.createLibraryFeedbackEmail(feedback);
    sendEmail(recipients, body, subject, "\"Library feedback\" email sent to {}");
  }

  @Override
  public void sendCompanyVendorChange(
      List<String> recipients, CompanyVendorChangeCommand companyVendorChangeCommand) {
    String subject = "Company Vendor data suffered a change";
    String body = templateGenerator.createCompanyVendorChangeEmail(companyVendorChangeCommand);
    sendEmail(recipients, body, subject, "\"Company Vendor change\" email sent to {}");
  }

  @Override
  public void sendRevokeGFolderPermissionError(
      List<String> recipients, List<String> accountFailure) {
    String subject = "Trying to revoke Gfolder permission some account(s) had issues";
    String body = templateGenerator.createRevokeGFolderPermissionErrorNotification(accountFailure);
    sendEmail(
        recipients, body, subject, "\"Failure in revoke Gfolder permission\" email sent to {}");
  }

  @Override
  public void sendSellerReleaseContactInfo(IpMarketplaceSellerReleaseContactInfoCommand command) {
    String subject = "You requested a seller's contact information";
    String body = templateGenerator.createSellerContactInfoNotification(command);
    sendEmail(
        List.of(command.getBuyerInfo().getEmail()),
        body,
        subject,
        "\"Send Seller Release Contact Info \" email sent to {}");
  }

  @Override
  public void sendBuyerRequestContactInfo(IpMarketplaceBuyerRequestContactInfoCommand command) {
    String subject = "New request for your contact information";
    String body = templateGenerator.createBuyerContactInfoNotification(command);
    sendEmail(
        List.of(command.getSellerEmail()),
        body,
        subject,
        "\"Failure in Send Buyer Request Contact Info \" email sent to {}");
  }

  @Override
  public void sendBuyerRequestChat(IpMarketplaceBuyerRequestContactInfoCommand command) {
    String subject = "You have 1 new message";
    String body = templateGenerator.createBuyerChatNotification(command);
    sendEmail(
        List.of(command.getSellerEmail()),
        body,
        subject,
        "\"Failure in Send Buyer Request Chat \" email sent to {}");
  }

  @Override
  public void sendNewMessageNotificationChat(IpMarketplaceNewMessageChatCommand command) {
    String subject = String.format("You have %d new message(s)", command.getUnreadMessages());
    String body = templateGenerator.createNewMessageNotificationChat(command);
    sendEmail(
        List.of(command.getReceiverEmail()),
        body,
        subject,
        "\"Failure in New Message Notification Chat \" email sent to {}");
  }

  private void sendEmail(List<String> recipients, String body, String subject, String message) {
    var request =
        SendEmailRequest.builder()
            .destination(d -> d.toAddresses(recipients))
            .content(
                c ->
                    c.simple(
                        Message.builder()
                            .body(b -> b.html(content -> content.data(body)))
                            .subject(s -> s.data(subject))
                            .build()))
            .fromEmailAddress(FROM)
            .build();
    try {
      client.sendEmail(request);
      logger.info(message, String.join(",", recipients));
    } catch (Exception e) {
      logger.error("Issue sending email via SES", e);
    }
  }
}
