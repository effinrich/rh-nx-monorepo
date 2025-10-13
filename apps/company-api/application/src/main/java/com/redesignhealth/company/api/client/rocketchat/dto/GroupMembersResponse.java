package com.redesignhealth.company.api.client.rocketchat.dto;

import java.util.List;
import java.util.Map;
import lombok.Getter;

@Getter
public class GroupMembersResponse {
  List<Map<String, String>> members;
  int count;
  int offset;
  int total;
  boolean success;
}
