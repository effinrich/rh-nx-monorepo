package com.redesignhealth.company.api.service;

import com.google.api.services.drive.DriveScopes;
import com.google.auth.oauth2.GoogleCredentials;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * RH Advise Slim Backend
 *
 * <p>It provides clients with access tokens representing a service account, for brokering access to
 * the RH Advise "backend" Google sheets. Prevents service account credentials from needing to leave
 * the server side.
 *
 * <p>This class is structured oddly. It is meant for _iterating fast_, so it does not have a NoOp*
 * equivalent like many other services. The Optional constructor parameter means that in the absence
 * of the svc account JSON (like a unit test env), the type will initialize as a Bean without
 * complaint. Trying to really use the instance in that env will throw an exception.
 *
 * <p>This saves time up front in development, and test authors are expected to know whether they
 * are dealing with an instance that should or should not get a non-mocked call to getAccessToken().
 */
public class AdviseService {

  private final Optional<GoogleCredentials> credentials;

  public AdviseService(Optional<String> svcAccountJson) {
    if (svcAccountJson.isPresent()) {
      try {
        credentials =
            Optional.of(
                GoogleCredentials.fromStream(
                        new ByteArrayInputStream(svcAccountJson.get().getBytes()))
                    .createScoped(List.of(DriveScopes.DRIVE)));
      } catch (IOException e) {
        // TODO: If this thing flies, custom exception needed for long term
        throw new RuntimeException(e);
      }
    } else {
      credentials = Optional.empty();
    }
  }

  public String getAccessToken() {
    if (credentials.isEmpty()) {
      // TODO: If this thing flies, custom exception needed for long term
      throw new RuntimeException(
          "No credentials available for AdviseService to generate an access token");
    }
    try {
      var googleToken = credentials.get().refreshAccessToken();
      return googleToken.getTokenValue();
    } catch (IOException e) {
      // TODO: If this thing flies, custom exception needed for long term
      throw new RuntimeException("Error refreshing access token in AdviseService", e);
    }
  }
}
