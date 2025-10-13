package com.redesignhealth.company.api.dto.command.ipMarketplace;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Optional;
import lombok.Getter;

@Getter
public class IpMarketplaceContactInfoCommand {
  @Schema(example = "rh@redesighnhealth.com")
  private Optional<PersonRef> buyerEmail;

  public static IpMarketplaceContactInfoCommand of(PersonRef buyerEmail) {
    var ipMarketplaceContactInfoCommand = new IpMarketplaceContactInfoCommand();
    ipMarketplaceContactInfoCommand.buyerEmail = Optional.of(buyerEmail);
    return ipMarketplaceContactInfoCommand;
  }
}
