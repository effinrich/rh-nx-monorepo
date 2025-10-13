package com.redesignhealth.company.api.client.file;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.http.MediaType.TEXT_PLAIN;

import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.testing.http.MockHttpTransport;
import com.google.api.client.testing.http.MockLowLevelHttpRequest;
import com.google.api.services.drive.Drive;
import java.io.IOException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class GoogleDriveClientImplTest {

  private GoogleDriveClient googleDriveClient;

  private MockHttpTransport mockHttpTransport = new MockHttpTransport();

  @BeforeEach
  public void setup() {
    googleDriveClient =
        new GoogleDriveClientImpl(
            new Drive.Builder(mockHttpTransport, GsonFactory.getDefaultInstance(), request -> {})
                .setApplicationName("TEST")
                .build());
  }

  @Test
  void testGetDocument_returns404Exception() throws IOException {
    var fileId = "12345";
    var request =
        (MockLowLevelHttpRequest) mockHttpTransport.buildRequest("GET", "https://example.com");
    request.getResponse().setStatusCode(404);
    assertThatThrownBy(() -> googleDriveClient.getDocument(fileId, TEXT_PLAIN))
        .hasMessage(
            "Google Drive document 12345 not found. Verify that the document is shared with our service account.");
  }
}
