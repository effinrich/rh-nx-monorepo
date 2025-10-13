package com.redesignhealth.company.api.dto.command.vendor;

import com.redesignhealth.company.api.dto.PersonReducedInfo;
import com.redesignhealth.company.api.dto.SerializableEnum;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.vendor.CompanyVendor;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
public class CompanyVendorChangeCommand {
  String type;
  String createdByName;
  String changedOn;
  String name;
  List<String> categories;
  List<String> subcategories;
  String companyName;

  private static final String PATTERN_FORMAT = "MM/dd/yyyy hh:mm:ss z";
  private static final String LOCATION = "America/New_York";
  private static final DateTimeFormatter FORMATTER =
      DateTimeFormatter.ofPattern(PATTERN_FORMAT).withZone(ZoneId.of(LOCATION));
  ;

  private CompanyVendorChangeCommand() {}

  public static CompanyVendorChangeCommand from(
      CompanyVendor companyVendor, PersonReducedInfo personReducedInfo, Type type) {
    var companyVendorChangeCommand = new CompanyVendorChangeCommand();
    companyVendorChangeCommand.type = type.getDisplayName();
    companyVendorChangeCommand.changedOn = FORMATTER.format(Instant.now());
    companyVendorChangeCommand.name = companyVendor.getVendor().getName();
    companyVendorChangeCommand.categories =
        companyVendor.getSubcategories().stream()
            .map(x -> x.getCategory().getName())
            .distinct()
            .toList();
    companyVendorChangeCommand.subcategories =
        companyVendor.getSubcategories().stream().map(Subcategory::getName).distinct().toList();
    companyVendorChangeCommand.createdByName =
        personReducedInfo.getGivenName() + " " + personReducedInfo.getFamilyName();
    companyVendorChangeCommand.companyName = companyVendor.getCompany().getName();
    return companyVendorChangeCommand;
  }

  public static CompanyVendorChangeCommand of(
      String type,
      String createdByName,
      String name,
      String companyName,
      List<String> categories,
      List<String> subcategories) {
    var companyVendorChangeCommand = new CompanyVendorChangeCommand();
    companyVendorChangeCommand.type = type;
    companyVendorChangeCommand.createdByName = createdByName;
    companyVendorChangeCommand.changedOn = FORMATTER.format(Instant.now());
    companyVendorChangeCommand.name = name;
    companyVendorChangeCommand.categories = categories;
    companyVendorChangeCommand.subcategories = subcategories;
    companyVendorChangeCommand.companyName = companyName;
    return companyVendorChangeCommand;
  }

  public enum Type implements SerializableEnum {
    NEW_VENDOR("New vendor created."),
    NEW_SUBCATEGORIES("Subcategories are different from existing vendor.");

    private final String displayName;

    Type(String displayName) {
      this.displayName = displayName;
    }

    @Override
    public String getValue() {
      return this.name();
    }

    @Override
    public String getDisplayName() {
      return this.displayName;
    }
  }
}
