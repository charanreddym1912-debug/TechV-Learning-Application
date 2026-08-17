package com.org.lms.coordinator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AssessmentAnswerSubmissionRequest(@NotNull Long questionId, @NotBlank String response) {}
