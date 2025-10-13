package com.redesignhealth.company.api.controller;

import java.time.Instant;

public class ConsentCommand {

  private Instant accepted;
  private String version;

  public Instant getAccepted() {
    return accepted;
  }

  public String getVersion() {
    return version;
  }
}
