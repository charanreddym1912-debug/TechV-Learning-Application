package com.org.lms.trainer.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class GradeRequest {

    @NotEmpty
    private List<AnswerSubmission> answers;

    public GradeRequest() {}

    public List<AnswerSubmission> getAnswers() { return answers; }
    public void setAnswers(List<AnswerSubmission> answers) { this.answers = answers; }
}