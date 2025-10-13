package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import jakarta.persistence.AttributeConverter;

public class IpMarketPlaceConverter implements AttributeConverter<IpMarketplaceRef, String> {
  @Override
  public String convertToDatabaseColumn(IpMarketplaceRef ipMarketplaceRef) {
    return (ipMarketplaceRef != null) ? ipMarketplaceRef.value() : null;
  }

  @Override
  public IpMarketplaceRef convertToEntityAttribute(String apiId) {
    return (apiId != null) ? IpMarketplaceRef.of(apiId) : null;
  }
}
