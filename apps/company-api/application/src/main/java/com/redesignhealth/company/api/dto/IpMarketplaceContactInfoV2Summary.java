package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import java.time.Instant;
import lombok.Getter;

@Getter
public class IpMarketplaceContactInfoV2Summary extends IpMarketplaceContactInfoSummary {
  private String ipMarketplaceTrackApi;
  private String chatRoomId;

  public IpMarketplaceContactInfoV2Summary(
      IpMarketplaceTrackRef ipMarketplaceTrackRef, String chatRoomId, Instant date) {
    super(date);
    this.ipMarketplaceTrackApi = ipMarketplaceTrackRef.getApiId();
    this.chatRoomId = chatRoomId;
  }

  public IpMarketplaceContactInfoV2Summary of(
      IpMarketplaceTrackRef ipMarketplaceTrackRef, String chatRoomId, Instant date) {
    return new IpMarketplaceContactInfoV2Summary(ipMarketplaceTrackRef, chatRoomId, date);
  }
}
