package com.redesignhealth.company.api.dto.command;

import com.redesignhealth.company.api.dto.enums.CeoBusinessFocusArea;
import com.redesignhealth.company.api.dto.enums.CeoBusinessType;
import com.redesignhealth.company.api.dto.enums.CeoCustomerSegment;
import com.redesignhealth.company.api.dto.enums.CeoHealthcareSector;
import com.redesignhealth.company.api.dto.enums.CeoVisible;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Getter;

@Getter
public class CeoBaseCommand {
  @Schema(example = "http//www.example.com/")
  private String pictureHref;

  private CeoBusinessType businessType;

  @Schema(example = "Atlanta")
  private String location;

  @Schema(example = "[\"California\"]")
  private List<String> marketServiceArea;

  private List<CeoCustomerSegment> customerSegment;

  private List<CeoBusinessFocusArea> businessFocusArea;

  private CeoHealthcareSector healthcareSector;

  @Schema(example = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do")
  private String bio;

  @Schema(example = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do")
  private String additionalInfo;

  @Schema(example = "http//www.example.com/")
  private String linkedinHref;

  private CeoVisible visible;
}
