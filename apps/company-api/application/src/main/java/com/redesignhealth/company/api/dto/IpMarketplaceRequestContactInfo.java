package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.command.ipMarketplace.MarketplaceUserInfo;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTrackContactInfo;
import com.redesignhealth.company.api.entity.IpMarketplaceTrack;
import com.redesignhealth.company.api.exception.CompanyMemberNotFoundException;
import java.time.Instant;
import lombok.Getter;

@Getter
public class IpMarketplaceRequestContactInfo {
  private Instant dateRequest;
  private Instant dateRelease;
  private MarketplaceUserInfo buyerInfo;
  private MarketplaceUserInfo sellerInfo;
  private String chatRoomId;
  private String id;

  public static IpMarketplaceRequestContactInfo from(IpMarketplaceTrack ipMarketplaceTrack) {
    var requestContactInfo = new IpMarketplaceRequestContactInfo();
    requestContactInfo.dateRequest = ipMarketplaceTrack.getDateRequested();
    requestContactInfo.dateRelease = ipMarketplaceTrack.getDateReleasedSellerContactInfo();
    var buyer = ipMarketplaceTrack.getBuyer();
    var buyerMemberOf =
        buyer.getMemberOf().stream().findFirst().orElseThrow(CompanyMemberNotFoundException::new);
    requestContactInfo.buyerInfo =
        (ipMarketplaceTrack.getStatus().equals(IpMarketplaceTrackContactInfo.RELEASED_CONTACT_INFO))
            ? MarketplaceUserInfo.of(
                buyer.getEmail().value(),
                buyer.getGivenName(),
                buyer.getFamilyName(),
                buyerMemberOf.getCompany().getName())
            : MarketplaceUserInfo.of(
                buyer.getEmail().value(), null, null, buyerMemberOf.getCompany().getName());
    var sellerCompanyName =
        ipMarketplaceTrack.getIpMarketplace().getCompanyIpMarketplace().getCompany().getName();
    if (ipMarketplaceTrack
        .getStatus()
        .equals(IpMarketplaceTrackContactInfo.RELEASED_CONTACT_INFO)) {
      var seller = ipMarketplaceTrack.getIpMarketplace().getIpMarketplaceSeller().getSeller();
      requestContactInfo.sellerInfo =
          MarketplaceUserInfo.of(
              seller.getEmail().value(),
              seller.getGivenName(),
              seller.getFamilyName(),
              sellerCompanyName);
    } else {
      requestContactInfo.sellerInfo = MarketplaceUserInfo.of(null, null, null, sellerCompanyName);
    }
    requestContactInfo.id = ipMarketplaceTrack.getApiId().value();
    requestContactInfo.chatRoomId = ipMarketplaceTrack.getRoomId();
    return requestContactInfo;
  }
}
