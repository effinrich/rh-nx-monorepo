package com.redesignhealth.company.api.property;

import java.util.List;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/*this class be removed when move to the GAuth integration*/
@ConfigurationProperties("rocket-chat-service")
@Getter
public class RocketChatSellerCredentials {
  private final List<SellerIdentification> sellers;

  public RocketChatSellerCredentials(List<SellerIdentification> sellers) {
    this.sellers = sellers;
  }
}
