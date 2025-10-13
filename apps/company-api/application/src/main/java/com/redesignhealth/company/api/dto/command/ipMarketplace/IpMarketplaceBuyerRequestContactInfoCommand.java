package com.redesignhealth.company.api.dto.command.ipMarketplace;

import java.net.URI;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class IpMarketplaceBuyerRequestContactInfoCommand {
  private String sellerGivenName;
  private String buyerCompanyName;
  private String ipName;
  private String sellerEmail;
  private URI portalHostname;

  public static IpMarketplaceBuyerRequestContactInfoCommand of(
      String sellerGivenName,
      String buyerCompanyName,
      String ipName,
      String sellerEmail,
      URI portalHostname) {
    return new IpMarketplaceBuyerRequestContactInfoCommand(
        sellerGivenName, buyerCompanyName, ipName, sellerEmail, portalHostname);
  }
}
