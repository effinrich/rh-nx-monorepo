package com.redesignhealth.company.api.entity;

import static jakarta.persistence.EnumType.STRING;

import com.google.common.annotations.VisibleForTesting;
import com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.SerializableEnum;
import com.redesignhealth.company.api.dto.enums.CeoBusinessFocusArea;
import com.redesignhealth.company.api.dto.enums.CeoBusinessType;
import com.redesignhealth.company.api.dto.enums.CeoCustomerSegment;
import com.redesignhealth.company.api.dto.enums.CeoHealthcareSector;
import com.redesignhealth.company.api.dto.enums.CeoVisible;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.CeoRefConverter;
import com.redesignhealth.company.api.entity.converter.PersonRefConverter;
import com.redesignhealth.company.api.entity.ref.CeoRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Entity
@Getter
public class Ceo extends Auditable {
  @Id @GeneratedValue private Long id;

  @Convert(converter = CeoRefConverter.class)
  @Setter
  private CeoRef apiId;

  @Setter
  @Column(unique = true)
  @Convert(converter = PersonRefConverter.class)
  private PersonRef email;

  @Setter private String pictureHref;

  @Enumerated(STRING)
  @Setter
  private CeoBusinessType businessType;

  @Setter private String location;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb", name = "market_service_area")
  @Setter
  private List<String> marketServiceArea;

  @Enumerated(STRING)
  @Setter
  private List<CeoCustomerSegment> customerSegment;

  @Enumerated(STRING)
  @Setter
  private CeoHealthcareSector healthcareSector;

  @Enumerated(STRING)
  @Setter
  private List<CeoBusinessFocusArea> businessFocusArea;

  @Setter public String bio;

  @Setter public String additionalInfo;

  @Enumerated(STRING)
  @Setter
  private CeoVisible visible;

  @Setter public String linkedinHref;

  @OneToOne(mappedBy = "ceo")
  private Person person;

  @Transient private Map<String, List<String>> highlightedText;

  @VisibleForTesting
  public void setPerson(Person person) {
    this.person = person;
  }

  public static Ceo from(SearchResult<CeoDirectoryDoc> searchDoc) {
    var ceoDirectoryDoc = searchDoc.getSource();
    var ceo = new Ceo();
    ceo.apiId = CeoRef.of(searchDoc.getId());
    ceo.email = PersonRef.of(ceoDirectoryDoc.getMember().getEmail());
    ceo.pictureHref = ceoDirectoryDoc.getPictureHref();
    ceo.businessType =
        (ceoDirectoryDoc.getBusinessType() != null)
            ? SerializableEnum.fromDisplayName(
                CeoBusinessType.values(), ceoDirectoryDoc.getBusinessType())
            : null;
    ceo.location = ceoDirectoryDoc.getLocation();
    ceo.marketServiceArea = ceoDirectoryDoc.getMarketServiceArea();
    ceo.customerSegment =
        (ceoDirectoryDoc.getCustomerSegment() != null)
            ? ceoDirectoryDoc.getCustomerSegment().stream()
                .map(value -> SerializableEnum.fromDisplayName(CeoCustomerSegment.values(), value))
                .toList()
            : null;
    ceo.healthcareSector =
        (ceoDirectoryDoc.getHealthcareSector() != null)
            ? SerializableEnum.fromDisplayName(
                CeoHealthcareSector.values(), ceoDirectoryDoc.getHealthcareSector())
            : null;
    ceo.businessFocusArea =
        (ceoDirectoryDoc.getBusinessFocusAreas() != null)
            ? ceoDirectoryDoc.getBusinessFocusAreas().stream()
                .map(
                    value -> SerializableEnum.fromDisplayName(CeoBusinessFocusArea.values(), value))
                .toList()
            : null;
    ceo.bio = ceoDirectoryDoc.getBio();
    ceo.additionalInfo = ceoDirectoryDoc.getAdditionalInfo();
    ceo.visible =
        (ceoDirectoryDoc.getVisible() != null)
            ? CeoVisible.valueOf(ceoDirectoryDoc.getVisible())
            : null;
    ceo.highlightedText = searchDoc.getHighlightedText();
    return ceo;
  }
}
