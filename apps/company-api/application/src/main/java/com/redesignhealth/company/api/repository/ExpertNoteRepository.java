package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.ExpertNote;
import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpertNoteRepository extends CrudRepository<ExpertNote, Long>, RefRepository {
  List<ExpertNote> findByApiIdIsNull();

  Optional<ExpertNote> findByApiId(ExpertNoteRef apiId);
}
