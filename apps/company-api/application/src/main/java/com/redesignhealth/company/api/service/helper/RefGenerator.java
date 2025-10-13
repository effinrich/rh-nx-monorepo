package com.redesignhealth.company.api.service.helper;

import com.redesignhealth.company.api.entity.id.ApiIdGenerator;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.entity.ref.CeoRef;
import com.redesignhealth.company.api.entity.ref.CompanyVendorRef;
import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import com.redesignhealth.company.api.entity.ref.Ref;
import com.redesignhealth.company.api.entity.ref.ResearchArticleRef;
import com.redesignhealth.company.api.entity.ref.ResearchRef;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.entity.ref.VendorRef;
import com.redesignhealth.company.api.repository.RefRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class RefGenerator {

  public static <T extends Ref> T of(RefRepository repository, Class<T> clazz) {
    T newId = null;
    while (newId == null) {
      T potential = of(clazz, ApiIdGenerator.generate());
      if (!repository.existsByApiId(potential)) {
        newId = potential;
      } else {
        log.warn("ID: \"{}\" collision detected when creating \"{}\"", potential, clazz);
      }
    }
    return newId;
  }

  private static <T extends Ref> T of(Class<T> clazz, String value) {
    if (clazz == CompanyVendorRef.class) {
      return clazz.cast(CompanyVendorRef.of(value));
    }

    if (clazz == VendorRef.class) {
      return clazz.cast(VendorRef.of(value));
    }

    if (clazz == CategoryRef.class) {
      return clazz.cast(CategoryRef.of(value));
    }
    if (clazz == SubcategoryRef.class) {
      return clazz.cast(SubcategoryRef.of(value));
    }

    if (clazz == ResearchRef.class) {
      return clazz.cast(ResearchRef.of(value));
    }
    if (clazz == ResearchArticleRef.class) {
      return clazz.cast(ResearchArticleRef.of(value));
    }

    if (clazz == ExpertNoteRef.class) {
      return clazz.cast(ExpertNoteRef.of(value));
    }

    if (clazz == CeoRef.class) {
      return clazz.cast(CeoRef.of(value));
    }

    if (clazz == IpMarketplaceRef.class) {
      return clazz.cast(IpMarketplaceRef.of(value));
    }

    if (clazz == IpMarketplaceTrackRef.class) {
      return clazz.cast(IpMarketplaceTrackRef.of(value));
    }
    throw new IllegalArgumentException();
  }
}
