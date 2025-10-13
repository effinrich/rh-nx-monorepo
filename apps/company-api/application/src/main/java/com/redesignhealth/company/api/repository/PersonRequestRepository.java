package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.PersonRequest;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface PersonRequestRepository
    extends PagingAndSortingRepository<PersonRequest, Long>, CrudRepository<PersonRequest, Long> {}
