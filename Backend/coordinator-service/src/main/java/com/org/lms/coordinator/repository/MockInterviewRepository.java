package com.org.lms.coordinator.repository;

import com.org.lms.coordinator.entity.Course;
import com.org.lms.coordinator.entity.MockInterview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    boolean existsByCourseAndTitleIgnoreCase(Course course, String title);
    boolean existsByCourseAndTitleIgnoreCaseAndMockInterviewIdNot(Course course, String title, Long mockInterviewId);
    List<MockInterview> findByCourseOrderByScheduledDateTimeAsc(Course course);
    Optional<MockInterview> findByMockInterviewIdAndCourse(Long mockInterviewId, Course course);
    List<MockInterview> findByCourse_CourseIdOrderByScheduledDateTimeAsc(Long courseId);
}
