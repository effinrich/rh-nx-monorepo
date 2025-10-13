package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import jakarta.persistence.AttributeConverter;

public class IpMarketplaceTrackConverter
    implements AttributeConverter<IpMarketplaceTrackRef, String> {
  @Override
  public String convertToDatabaseColumn(IpMarketplaceTrackRef ipMarketplaceTrackRef) {
    return (ipMarketplaceTrackRef != null) ? ipMarketplaceTrackRef.value() : null;
  }

  @Override
  public IpMarketplaceTrackRef convertToEntityAttribute(String apiId) {
    return (apiId != null) ? IpMarketplaceTrackRef.of(apiId) : null;
  }
}
