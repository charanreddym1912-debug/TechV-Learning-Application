package com.org.lms.coordinator.controller;

import com.org.lms.coordinator.dto.*;
import com.org.lms.coordinator.service.AssessmentGradingService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AssessmentGradingController {
    private final AssessmentGradingService gradingService;

    public AssessmentGradingController(AssessmentGradingService gradingService) {
        this.gradingService = gradingService;
    }

    @PostMapping("/assessments/{assessmentId}/attempts")
    @PreAuthorize("hasRole('STUDENT')")
    public AssessmentAttemptResponse submit(@PathVariable Long assessmentId,
                                            @Valid @RequestBody AssessmentSubmissionRequest request,
                                            Authentication authentication) {
        return gradingService.submit(assessmentId, authentication.getName(), request);
    }

    @GetMapping("/assessment-attempts/mine")
    @PreAuthorize("hasRole('STUDENT')")
    public List<AssessmentAttemptResponse> myAttempts(Authentication authentication) {
        return gradingService.attemptsForStudent(authentication.getName());
    }

    @GetMapping("/assessment-attempts/pending-review")
    @PreAuthorize("hasAnyRole('TRAINER','COORDINATOR')")
    public List<AssessmentAttemptResponse> pendingReview() {
        return gradingService.pendingReview();
    }

    @PutMapping("/assessment-answers/{answerId}/grade")
    @PreAuthorize("hasAnyRole('TRAINER','COORDINATOR')")
    public AssessmentAttemptResponse gradeAnswer(@PathVariable Long answerId,
                                                 @Valid @RequestBody AssessmentAnswerGradeRequest request) {
        return gradingService.gradeAnswer(answerId, request);
    }
}
