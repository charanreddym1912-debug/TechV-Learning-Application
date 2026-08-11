package com.org.lms.trainer.controller;

import com.org.lms.trainer.dto.AssessmentRequest;
import com.org.lms.trainer.dto.AssessmentResponse;
import com.org.lms.trainer.dto.GradeResponse;
import com.org.lms.trainer.dto.GradeRequest;
import com.org.lms.trainer.service.AssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessments")
@PreAuthorize("hasRole('TRAINER')")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public ResponseEntity<AssessmentResponse> createAssessment(@Valid @RequestBody AssessmentRequest request,
                                                                Authentication authentication) {
        AssessmentResponse response = assessmentService.createAssessment(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AssessmentResponse>> getMyAssessments(Authentication authentication) {
        return ResponseEntity.ok(assessmentService.getMyAssessments(authentication.getName()));
    }

    @DeleteMapping("/{assessmentId}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long assessmentId,
                                                  Authentication authentication) {
        assessmentService.deleteAssessment(assessmentId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{assessmentId}/grade")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<GradeResponse> gradeSubmission(@PathVariable Long assessmentId,
                                                          @Valid @RequestBody GradeRequest request) {
        return ResponseEntity.ok(assessmentService.gradeSubmission(assessmentId, request));
    }
}