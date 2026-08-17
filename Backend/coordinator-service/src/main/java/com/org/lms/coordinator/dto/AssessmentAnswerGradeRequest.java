package com.org.lms.coordinator.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AssessmentAnswerGradeRequest(@NotNull @Min(0) Integer awardedMarks, String feedback) {}
