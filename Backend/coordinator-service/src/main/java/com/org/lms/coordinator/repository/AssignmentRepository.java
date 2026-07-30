package com.org.lms.coordinator.repository;

import com.org.lms.coordinator.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseCourseId(Long courseId);

    boolean existsByCourseCourseIdAndTitleIgnoreCase(Long courseId, String title);
}
