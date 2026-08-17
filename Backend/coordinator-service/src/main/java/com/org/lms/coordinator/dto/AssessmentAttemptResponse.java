package com.org.lms.coordinator.dto;

import com.org.lms.coordinator.enums.AssessmentAttemptStatus;
import java.time.LocalDateTime;
import java.util.List;

public record AssessmentAttemptResponse(Long attemptId, Long assessmentId, String assessmentTitle,
        String studentEmail, AssessmentAttemptStatus status, Integer autoScore, Integer finalScore,
        Integer totalMarks, LocalDateTime submittedAt, LocalDateTime gradedAt,
        List<AssessmentAnswerResult> answers) {}
