package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.TaskHistory;
import com.redesignhealth.company.api.entity.ref.TaskRef;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository
    extends PagingAndSortingRepository<TaskHistory, Long>, CrudRepository<TaskHistory, Long> {

  Optional<TaskHistory> findByName(TaskRef name);
}
