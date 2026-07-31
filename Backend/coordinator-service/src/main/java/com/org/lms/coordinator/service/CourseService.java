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

    public CourseService(
            CourseRepository courseRepository,
            CourseEnrollmentRepository enrollmentRepository
    ) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public CourseResponse createCourse(
            CourseRequest request,
            String coordinatorEmail
    ) {

        validateCourseDates(request);

        if (courseRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new RuntimeException(
                    "Course already exists with title: " + request.getTitle()
            );
        }

        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setDuration(request.getDuration());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setStatus(
                calculateStatus(
                        request.getStartDate(),
                        request.getEndDate()
                )
        );
        course.setCreatedByEmail(coordinatorEmail);

        Course savedCourse = courseRepository.save(course);

        return toResponse(savedCourse);
    }

    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CourseResponse getCourseById(Long courseId) {

        Course course = findCourseOrThrow(courseId);

        return toResponse(course);
    }

    public CourseResponse updateCourse(
            Long courseId,
            CourseRequest request
    ) {

        validateCourseDates(request);

        Course course = findCourseOrThrow(courseId);

        if (courseRepository.existsByTitleIgnoreCase(request.getTitle())
                && !course.getTitle().equalsIgnoreCase(request.getTitle())) {

            throw new RuntimeException(
                    "Course already exists with title: " + request.getTitle()
            );
        }

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setDuration(request.getDuration());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setStatus(
                calculateStatus(
                        request.getStartDate(),
                        request.getEndDate()
                )
        );

        Course updatedCourse = courseRepository.save(course);

        return toResponse(updatedCourse);
    }

    public void deleteCourse(Long courseId) {

        Course course = findCourseOrThrow(courseId);

        courseRepository.delete(course);
    }

    public EnrollmentResponse enrollStudent(
            Long courseId,
            String studentEmail
    ) {

        findCourseOrThrow(courseId);

        if (studentEmail == null || studentEmail.isBlank()) {
            throw new IllegalArgumentException(
                    "Student email is required"
            );
        }

        if (enrollmentRepository
                .findByCourseIdAndStudentEmail(courseId, studentEmail)
                .isPresent()) {

            throw new RuntimeException(
                    "Student is already enrolled in this course"
            );
        }

        CourseEnrollment enrollment = new CourseEnrollment();
        enrollment.setCourseId(courseId);
        enrollment.setStudentEmail(studentEmail);

        CourseEnrollment savedEnrollment =
                enrollmentRepository.save(enrollment);

        return new EnrollmentResponse(
                savedEnrollment.getEnrollmentId(),
                savedEnrollment.getCourseId(),
                savedEnrollment.getStudentEmail(),
                "Successfully enrolled"
        );
    }

    private Course findCourseOrThrow(Long courseId) {

        if (courseId == null || courseId <= 0) {
            throw new IllegalArgumentException(
                    "Course ID must be greater than zero"
            );
        }

        return courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with id: " + courseId
                        )
                );
    }

    private CourseStatus calculateStatus(
            LocalDate startDate,
            LocalDate endDate
    ) {

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

        if (request == null) {
            throw new IllegalArgumentException(
                    "Course request cannot be null"
            );
        }

        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        if (startDate != null && endDate != null) {

            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException(
                        "Start date should not be after end date"
                );
            }

            validateDuration(
                    request.getDuration(),
                    startDate,
                    endDate
            );
        }
    }

    private void validateDuration(
            String duration,
            LocalDate startDate,
            LocalDate endDate
    ) {

        if (duration == null || duration.isBlank()) {
            return;
        }

        try {
            int parsedDuration =
                    Integer.parseInt(duration.trim());

            if (parsedDuration <= 0) {
                throw new IllegalArgumentException(
                        "Duration must be greater than zero"
                );
            }

            long daysBetween = ChronoUnit.DAYS.between(
                    startDate,
                    endDate
            );

            if (parsedDuration != daysBetween) {
                throw new IllegalArgumentException(
                        "Duration should match the difference between start date and end date"
                );
            }

        } catch (NumberFormatException ignored) {
            /*
             * Duration is currently stored as a String.
             * Numeric validation is applied only when the supplied
             * duration contains a number.
             */
        }
    }

    private CourseResponse toResponse(Course course) {

        return new CourseResponse(
                course.getCourseId(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getDuration(),
                course.getStartDate(),
                course.getEndDate(),
                course.getCreatedByEmail(),
                course.getStatus(),
                course.getCreatedAt(),
                course.getUpdatedAt()
        );
    }
}