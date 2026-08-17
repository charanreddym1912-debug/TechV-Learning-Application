package com.org.lms.coordinator.dto;

import com.org.lms.coordinator.enums.QuestionType;

public record AssessmentAnswerResult(Long answerId, Long questionId, String questionText,
        QuestionType questionType, String response, Integer maximumMarks, Integer awardedMarks,
        boolean autoGraded, String trainerFeedback) {}
