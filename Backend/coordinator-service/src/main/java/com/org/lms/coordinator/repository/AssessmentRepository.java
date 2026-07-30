package com.org.lms.coordinator.repository;

import com.org.lms.coordinator.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByCourseCourseId(Long courseId);

    boolean existsByTitleIgnoreCaseAndCourseCourseId(String title, Long courseId);
}
