package com.org.lms.trainer.dto;

import java.time.LocalDate;

public class AssessmentResponse {

    private Long assessmentId;
    private String title;
    private String course;
    private String batch;
    private LocalDate dueDate;
    private Integer durationMinutes;
    private int totalQuestions;
    private int totalMarks;
    private String status;

    public AssessmentResponse(Long assessmentId, String title, String course, String batch,
                               LocalDate dueDate, Integer durationMinutes, int totalQuestions,
                               int totalMarks, String status) {
        this.assessmentId = assessmentId;
        this.title = title;
        this.course = course;
        this.batch = batch;
        this.dueDate = dueDate;
        this.durationMinutes = durationMinutes;
        this.totalQuestions = totalQuestions;
        this.totalMarks = totalMarks;
        this.status = status;
    }

    public Long getAssessmentId() { return assessmentId; }
    public String getTitle() { return title; }
    public String getCourse() { return course; }
    public String getBatch() { return batch; }
    public LocalDate getDueDate() { return dueDate; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public int getTotalQuestions() { return totalQuestions; }
    public int getTotalMarks() { return totalMarks; }
    public String getStatus() { return status; }
}