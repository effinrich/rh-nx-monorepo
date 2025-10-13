package com.redesignhealth.company.api.util;

import java.util.Optional;
import java.util.regex.Pattern;

public class GoogleDriveUtil {
  private static final Pattern GOOGLE_DRIVE_LINK_REGEX =
      Pattern.compile(
          "https://docs\\.google\\.com/(document|presentation)/d/(?<id>[0-9a-zA-Z-_]+)");

  /**
   * Extract Google Drive ID from Google Doc/Slides link
   *
   * @param link Google Drive link
   * @return empty if ID can't be found
   */
  public static Optional<String> getDocumentIdFromLink(String link) {
    if (link == null) {
      return Optional.empty();
    }

    var matcher = GOOGLE_DRIVE_LINK_REGEX.matcher(link);
    if (matcher.find()) {
      return Optional.of(matcher.group("id"));
    }
    return Optional.empty();
  }
}
