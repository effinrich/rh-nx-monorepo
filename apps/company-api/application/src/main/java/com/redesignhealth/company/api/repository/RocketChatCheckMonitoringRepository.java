package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.RocketChatCheckMonitoring;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RocketChatCheckMonitoringRepository
    extends JpaRepository<RocketChatCheckMonitoring, Long> {
  Optional<RocketChatCheckMonitoring> findByUserAndRoomId(Person user, String chatRoomId);
}
