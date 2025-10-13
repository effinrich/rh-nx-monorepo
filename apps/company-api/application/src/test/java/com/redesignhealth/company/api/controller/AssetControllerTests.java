package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.AssetController.MULTIPART_FILE_KEY;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.TEXT_PLAIN;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.client.file.RemoteFileUploader;
import com.redesignhealth.company.api.client.file.dto.RemoteFile;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.AssetService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import software.amazon.awssdk.services.s3.model.S3Exception;

@WebMvcTest(AssetController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/asset")
class AssetControllerTests {

  @Autowired private MockMvc mockMvc;
  @MockBean private RemoteFileUploader remoteFileUploader;
  private static final MockMultipartFile mockFile =
      new MockMultipartFile(
          MULTIPART_FILE_KEY, "memo.txt", TEXT_PLAIN.toString(), "Body of work".getBytes());

  @TestConfiguration
  static class TestConfig {
    @Bean
    public AssetService assetService(RemoteFileUploader remoteFileUploader) {
      return new AssetService(remoteFileUploader);
    }
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testCreate_success() throws Exception {
    when(remoteFileUploader.upload(
            mockFile.getOriginalFilename(), mockFile.getBytes(), mockFile.getContentType()))
        .thenReturn(
            RemoteFile.builder()
                .href("https://example.com/file.txt")
                .filename(mockFile.getOriginalFilename())
                .build());

    mockMvc
        .perform(MockMvcRequestBuilders.multipart("/asset").file(mockFile))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.content[0].name", Matchers.is("memo.txt")))
        .andExpect(jsonPath("$.content[0].href", Matchers.is("https://example.com/file.txt")))
        .andDo(
            document(
                "create",
                responseFields(
                        fieldWithPath("content").description("List of assets uploaded"),
                        linksField().ignored())
                    .andWithPrefix("content[].", nameField(), hrefField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_uploaderException() throws Exception {
    when(remoteFileUploader.upload(any(), any(), any()))
        .thenThrow(S3Exception.builder().statusCode(403).message("Access denied").build());

    mockMvc
        .perform(MockMvcRequestBuilders.multipart("/asset").file(mockFile))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.message", Matchers.is("Access denied")))
        .andExpect(jsonPath("$.error", Matchers.is("Internal Server Error")));
  }

  private static FieldDescriptor nameField() {
    return fieldWithPath("name").description("Filename with extension");
  }

  private static FieldDescriptor hrefField() {
    return fieldWithPath("href").description("Link to file");
  }
}
