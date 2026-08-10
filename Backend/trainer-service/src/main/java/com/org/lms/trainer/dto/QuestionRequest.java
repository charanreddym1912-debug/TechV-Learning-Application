package com.org.lms.trainer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class QuestionRequest {

    @NotBlank
    private String questionText;

    @NotBlank
    private String questionType; // MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, LONG_ANSWER

    @NotNull
    private Integer marks;

    @NotBlank
    private String correctAnswer;

    private List<String> options;

    public QuestionRequest() {}

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
}