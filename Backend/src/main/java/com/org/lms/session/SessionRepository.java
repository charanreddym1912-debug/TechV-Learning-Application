package com.org.lms.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByTrainerId(Long trainerId);
    List<Session> findByBatchIdIn(Collection<Long> batchIds);
    List<Session> findByBatchId(Long batchId);
}
