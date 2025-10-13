package com.redesignhealth.company.api.client.email;

import com.redesignhealth.company.api.dto.command.LibraryFeedbackCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBuyerRequestContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceNewMessageChatCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceSellerReleaseContactInfoCommand;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorChangeCommand;
import com.redesignhealth.company.api.entity.Person;
import java.net.URI;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NoopEmailSender implements EmailSender {

  private static final Logger logger = LoggerFactory.getLogger(NoopEmailSender.class);

  @Override
  public void sendPersonAdded(Person recipient, URI portalHostname, URI adviseHostname) {
    logger.info(
        "Mocked call to send \"Person Added\" email to {}. Enable email interactions through 'aws.enabled' property.",
        recipient.getEmail());
  }

  @Override
  public void sendInfrastructureReady(Set<Person> recipients, URI github, URI okta) {
    logger.info(
        "Mocked call to send \"Infrastructure Ready\" email to {}. Enable email interactions through 'aws.enabled' property.",
        recipients.stream().map((p) -> p.getEmail().value()).collect(Collectors.joining(",")));
  }

  @Override
  public void sendLibraryFeedback(List<String> recipients, LibraryFeedbackCommand feedback) {
    logger.info("Mocked call to send \"Library Feedback\" email");
  }

  @Override
  public void sendCompanyVendorChange(
      List<String> recipients, CompanyVendorChangeCommand companyVendorChangeCommand) {
    logger.info("Mocked call to send \"Vendor change\" email");
  }

  @Override
  public void sendRevokeGFolderPermissionError(
      List<String> recipients, List<String> accountFailure) {
    logger.info("Mocked call to send \"Revoke GFolder Permission Error\" email");
  }

  @Override
  public void sendSellerReleaseContactInfo(IpMarketplaceSellerReleaseContactInfoCommand command) {
    logger.info("Mocked call to send \"Seller Release Contact Info\" email");
  }

  @Override
  public void sendBuyerRequestContactInfo(IpMarketplaceBuyerRequestContactInfoCommand command) {
    logger.info("Mocked call to send \"Buyer Request Contact Info\" email");
  }

  @Override
  public void sendBuyerRequestChat(IpMarketplaceBuyerRequestContactInfoCommand command) {
    logger.info("Mocked call to send \"Buyer Request Chat\" email");
  }

  @Override
  public void sendNewMessageNotificationChat(
      IpMarketplaceNewMessageChatCommand ipMarketplaceNewMessageChatCommand) {
    logger.info("Mocked call to send \"New Message Notification Chat\" email");
  }
}
