package com.org.lms.coordinator.repository;

import com.org.lms.coordinator.entity.AssessmentAttempt;
import com.org.lms.coordinator.enums.AssessmentAttemptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {
    Optional<AssessmentAttempt> findByAssessmentAssessmentIdAndStudentEmail(Long assessmentId, String studentEmail);
    List<AssessmentAttempt> findByStudentEmailOrderBySubmittedAtDesc(String studentEmail);
    List<AssessmentAttempt> findByStatusOrderBySubmittedAtAsc(AssessmentAttemptStatus status);
}
