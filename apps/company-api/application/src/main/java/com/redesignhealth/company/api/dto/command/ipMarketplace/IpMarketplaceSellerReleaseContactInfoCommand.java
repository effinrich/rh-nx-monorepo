package com.redesignhealth.company.api.dto.command.ipMarketplace;

import com.redesignhealth.company.api.dto.PersonReducedInfo;
import com.redesignhealth.company.api.entity.IpMarketplace;
import com.redesignhealth.company.api.entity.Person;
import java.net.URI;
import lombok.Getter;

@Getter
public class IpMarketplaceSellerReleaseContactInfoCommand {
  private String ipName;
  private PersonReducedInfo buyerInfo;
  private MarketplaceUserInfo sellerInfo;
  private URI portalHostname;

  public static IpMarketplaceSellerReleaseContactInfoCommand from(
      IpMarketplace ipMarketplace, Person buyer, URI portalHostname) {
    var ipMarketplaceSellerReleaseContactInfo = new IpMarketplaceSellerReleaseContactInfoCommand();
    ipMarketplaceSellerReleaseContactInfo.ipName = ipMarketplace.getName();
    ipMarketplaceSellerReleaseContactInfo.buyerInfo =
        PersonReducedInfo.of(buyer.getEmail().value(), buyer.getGivenName(), buyer.getFamilyName());
    var sellerCompanyName = ipMarketplace.getCompanyIpMarketplace().getCompany().getName();
    var seller = ipMarketplace.getIpMarketplaceSeller().getSeller();
    ipMarketplaceSellerReleaseContactInfo.sellerInfo =
        MarketplaceUserInfo.of(
            seller.getEmail().value(),
            seller.getGivenName(),
            seller.getFamilyName(),
            sellerCompanyName);
    ipMarketplaceSellerReleaseContactInfo.portalHostname = portalHostname;
    return ipMarketplaceSellerReleaseContactInfo;
  }

  public static IpMarketplaceSellerReleaseContactInfoCommand of(
      String ipName,
      String buyerGivenName,
      String buyerFamilyName,
      String buyerEmail,
      String sellerGivenName,
      String sellerFamilyName,
      String sellerEmail,
      String sellerCompanyName,
      URI portalHostname) {
    var ipMarketplaceSellerReleaseContactInfo = new IpMarketplaceSellerReleaseContactInfoCommand();
    ipMarketplaceSellerReleaseContactInfo.ipName = ipName;
    ipMarketplaceSellerReleaseContactInfo.buyerInfo =
        PersonReducedInfo.of(buyerEmail, buyerGivenName, buyerFamilyName);
    ipMarketplaceSellerReleaseContactInfo.sellerInfo =
        MarketplaceUserInfo.of(sellerEmail, sellerGivenName, sellerFamilyName, sellerCompanyName);
    return ipMarketplaceSellerReleaseContactInfo;
  }
}
