package com.redesignhealth.company.api.client.rocketchat.dto;

import java.time.Instant;
import lombok.Getter;

@Getter
public class GroupCountersResponse {
  private boolean joined;
  private int members;
  private int unreads;
  private Instant unreadsFrom;
  private Long msgs;
  private Instant latest;
  private Long userMentions;
  private boolean success;
}
