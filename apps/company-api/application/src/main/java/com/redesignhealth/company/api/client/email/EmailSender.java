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

public interface EmailSender {

  void sendPersonAdded(Person recipient, URI portalHostname, URI adviseHostname);

  void sendInfrastructureReady(Set<Person> recipients, URI github, URI okta);

  void sendLibraryFeedback(List<String> recipients, LibraryFeedbackCommand feedback);

  void sendCompanyVendorChange(
      List<String> recipients, CompanyVendorChangeCommand companyVendorChangeCommand);

  void sendRevokeGFolderPermissionError(List<String> recipients, List<String> accountFailure);

  void sendSellerReleaseContactInfo(IpMarketplaceSellerReleaseContactInfoCommand command);

  void sendBuyerRequestContactInfo(IpMarketplaceBuyerRequestContactInfoCommand command);

  void sendBuyerRequestChat(IpMarketplaceBuyerRequestContactInfoCommand command);

  void sendNewMessageNotificationChat(
      IpMarketplaceNewMessageChatCommand ipMarketplaceNewMessageChatCommand);
}
