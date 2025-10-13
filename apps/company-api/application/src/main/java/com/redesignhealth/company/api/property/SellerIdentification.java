package com.redesignhealth.company.api.property;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
/*this class be removed when move to the GAuth integration*/
public class SellerIdentification {
  private String email;
  private String username;
  private String password;
}
