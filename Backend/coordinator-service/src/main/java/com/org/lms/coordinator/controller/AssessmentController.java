package com.org.lms.coordinator.controller;

import com.org.lms.coordinator.dto.AssessmentRequest;
import com.org.lms.coordinator.dto.AssessmentResponse;
import com.org.lms.coordinator.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping("/courses/{courseId}/assessments")
    @PreAuthorize("hasAnyRole('TRAINER','COORDINATOR')")
    public ResponseEntity<AssessmentResponse> createAssessment(@PathVariable Long courseId,
                                                              @Valid @RequestBody AssessmentRequest request) {
        AssessmentResponse response = assessmentService.createAssessment(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/assessments")
    public ResponseEntity<List<AssessmentResponse>> getAllAssessments() {
        return ResponseEntity.ok(assessmentService.getAllAssessments());
    }

    @GetMapping("/assessments/{assessmentId}")
    public ResponseEntity<AssessmentResponse> getAssessmentById(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentService.getAssessmentById(assessmentId));
    }

    @GetMapping("/courses/{courseId}/assessments")
    public ResponseEntity<List<AssessmentResponse>> getAssessmentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(assessmentService.getAssessmentsByCourse(courseId));
    }

    @PutMapping("/courses/{courseId}/assessments/{assessmentId}")
    @PreAuthorize("hasAnyRole('TRAINER','COORDINATOR')")
    public ResponseEntity<AssessmentResponse> updateAssessment(@PathVariable Long courseId,
                                                              @PathVariable Long assessmentId,
                                                              @Valid @RequestBody AssessmentRequest request) {
        return ResponseEntity.ok(assessmentService.updateAssessment(courseId, assessmentId, request));
    }

    @DeleteMapping("/assessments/{assessmentId}")
    @PreAuthorize("hasAnyRole('TRAINER','COORDINATOR')")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long assessmentId) {
        assessmentService.deleteAssessment(assessmentId);
        return ResponseEntity.noContent().build();
    }
}
