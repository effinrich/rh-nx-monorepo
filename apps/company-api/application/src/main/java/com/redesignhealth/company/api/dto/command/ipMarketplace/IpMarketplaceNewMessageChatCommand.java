package com.redesignhealth.company.api.dto.command.ipMarketplace;

import java.net.URI;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class IpMarketplaceNewMessageChatCommand {
  private String receiverFirstName;
  private String ipMarketplaceName;
  private String replierCompanyName;
  private int unreadMessages;
  private String receiverEmail;
  private URI portalHostname;

  public static IpMarketplaceNewMessageChatCommand of(
      String receiverFirstName,
      String ipMarketplaceName,
      String replierCompanyName,
      int unreadMessages,
      String receiverEmail,
      URI portalHostname) {
    return new IpMarketplaceNewMessageChatCommand(
        receiverFirstName,
        ipMarketplaceName,
        replierCompanyName,
        unreadMessages,
        receiverEmail,
        portalHostname);
  }
}
