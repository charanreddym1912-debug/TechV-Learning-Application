package com.org.lms.coordinator.controller;

import com.org.lms.coordinator.dto.CourseRequest;
import com.org.lms.coordinator.dto.CourseResponse;
import com.org.lms.coordinator.dto.EnrollmentResponse;
import com.org.lms.coordinator.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CourseRequest request,
                                                        Authentication authentication) {
        String coordinatorEmail = authentication.getName();
        CourseResponse response = courseService.createCourse(request, coordinatorEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseService.getCourseById(courseId));
    }

    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long courseId,
                                                        @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.updateCourse(courseId, request));
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(@PathVariable Long courseId,
                                                              Authentication authentication) {
        String studentEmail = authentication.getName();
        EnrollmentResponse response = courseService.enrollStudent(courseId, studentEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}