package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.ref.Ref;

public interface RefRepository {

  boolean existsByApiId(Ref apiId);
}
