package com.org.lms.coordinator.service;

import com.org.lms.coordinator.dto.CourseRequest;
import com.org.lms.coordinator.dto.CourseResponse;
import com.org.lms.coordinator.dto.EnrollmentResponse;
import com.org.lms.coordinator.entity.Course;
import com.org.lms.coordinator.entity.CourseEnrollment;
import com.org.lms.coordinator.enums.CourseStatus;
import com.org.lms.coordinator.repository.CourseEnrollmentRepository;
import com.org.lms.coordinator.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;

    public CourseService(CourseRepository courseRepository, CourseEnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public CourseResponse createCourse(CourseRequest request, String coordinatorEmail) {
        validateCourseDates(request);

        if (courseRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new RuntimeException("Course already exists with title: " + request.getTitle());
        }

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setDuration(request.getDuration());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setStatus(calculateStatus(request.getStartDate(), request.getEndDate()));
        course.setCreatedByEmail(coordinatorEmail);

        Course saved = courseRepository.save(course);
        return toResponse(saved);
    }

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(Long courseId) {
        Course course = findCourseOrThrow(courseId);
        return toResponse(course);
    }

    public CourseResponse updateCourse(Long courseId, CourseRequest request) {
        validateCourseDates(request);
        Course course = findCourseOrThrow(courseId);
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setDuration(request.getDuration());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setStatus(calculateStatus(request.getStartDate(), request.getEndDate()));

        Course updated = courseRepository.save(course);
        return toResponse(updated);
    }

    public void deleteCourse(Long courseId) {
        Course course = findCourseOrThrow(courseId);
        courseRepository.delete(course);
    }

    public EnrollmentResponse enrollStudent(Long courseId, String studentEmail) {
        findCourseOrThrow(courseId); // ensures course exists before enrolling

        if (enrollmentRepository.findByCourseIdAndStudentEmail(courseId, studentEmail).isPresent()) {
            throw new RuntimeException("Already enrolled in this course");
        }

        CourseEnrollment enrollment = new CourseEnrollment();
        enrollment.setCourseId(courseId);
        enrollment.setStudentEmail(studentEmail);

        CourseEnrollment saved = enrollmentRepository.save(enrollment);
        return new EnrollmentResponse(saved.getEnrollmentId(), saved.getCourseId(),
                saved.getStudentEmail(), "Successfully enrolled");
    }

    private Course findCourseOrThrow(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
    }

    private CourseStatus calculateStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (endDate != null && endDate.isBefore(today)) {
            return CourseStatus.COMPLETED;
        }

        if (startDate != null && startDate.isAfter(today)) {
            return CourseStatus.INACTIVE;
        }

        return CourseStatus.ACTIVE;
    }

    private void validateCourseDates(CourseRequest request) {
        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new RuntimeException("Start date should not be after end date");
            }

            if (request.getDuration() != null && !request.getDuration().isBlank()) {
                try {
                    int parsedDuration = Integer.parseInt(request.getDuration().trim());
                    long daysBetween = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
                    if (parsedDuration != daysBetween) {
                        throw new RuntimeException("Duration should match the difference between start date and end date");
                    }
                } catch (NumberFormatException ignored) {
                    // Preserve existing string-based duration behavior and only enforce when a numeric value is supplied.
                }
            }
        }
    }

    private CourseResponse toResponse(Course course) {
        return new CourseResponse(course.getCourseId(), course.getTitle(), course.getDescription(),
                course.getCategory(), course.getDuration(), course.getStartDate(),
                course.getEndDate(), course.getCreatedByEmail(), course.getStatus(),
                course.getCreatedAt(), course.getUpdatedAt());
    }
}