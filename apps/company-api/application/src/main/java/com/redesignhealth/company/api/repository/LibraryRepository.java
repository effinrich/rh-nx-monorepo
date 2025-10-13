package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.library.Library;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LibraryRepository
    extends CrudRepository<Library, Long>, PagingAndSortingRepository<Library, Long> {
  boolean existsByApiId(LibraryRef apiId);

  Optional<Library> findByApiId(LibraryRef apiId);
}
