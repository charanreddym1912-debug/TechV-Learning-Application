package com.org.lms.trainer.repository;

import com.org.lms.trainer.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByCreatedByEmail(String createdByEmail);
}