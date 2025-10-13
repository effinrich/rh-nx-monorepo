package com.redesignhealth.company.api.client.rocketchat.dto;

import java.util.Map;
import lombok.Getter;

@Getter
public class UserCreateTokenResponse {
  private Map<String, String> data;
  private boolean success;
}
