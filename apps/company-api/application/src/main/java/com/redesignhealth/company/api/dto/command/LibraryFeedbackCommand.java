package com.redesignhealth.company.api.dto.command;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LibraryFeedbackCommand {
  private String title;
  private String improvements;
  private String comments;
}
