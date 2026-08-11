package com.org.lms.trainer.dto;

public class AnswerSubmission {

    private Long questionId;
    private String studentAnswer;

    public AnswerSubmission() {}

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }
}