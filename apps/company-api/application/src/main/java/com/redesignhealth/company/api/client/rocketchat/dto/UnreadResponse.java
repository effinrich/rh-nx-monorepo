package com.redesignhealth.company.api.client.rocketchat.dto;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UnreadResponse {
  private int unreads;
  private Instant unreadsFrom;
}
