package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Details about a logged in user. This might be scrapped for a {@link PersonSummary} once a person
 * holds information like "picture."
 */
public class UserInfoSummary extends PersonSummary {
  @Schema(example = "https://example.com/image.jpeg")
  private String picture;

  private UserInfoSummary(Person p) {
    super(p);
  }

  public static UserInfoSummary from(Person p, RedesignUserDetails userDetails) {
    var info = new UserInfoSummary(p);
    info.picture = (String) userDetails.getMetadata().get("picture");
    return info;
  }

  public String getPicture() {
    return this.picture;
  }
}
