package com.org.lms.coordinator.repository;

import com.org.lms.coordinator.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    Optional<CourseEnrollment> findByCourseIdAndStudentEmail(Long courseId, String studentEmail);
    List<CourseEnrollment> findByCourseId(Long courseId);
}