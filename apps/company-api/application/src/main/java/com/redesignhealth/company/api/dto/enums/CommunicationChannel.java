package com.redesignhealth.company.api.dto.enums;

public enum CommunicationChannel {
  EMAIL("Email"),
  CHAT("Chat");
  private final String communicationChannel;

  CommunicationChannel(String communicationChannel) {
    this.communicationChannel = communicationChannel;
  }
}
