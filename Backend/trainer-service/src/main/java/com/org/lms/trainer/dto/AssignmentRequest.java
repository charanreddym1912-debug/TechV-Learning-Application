package com.org.lms.trainer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class AssignmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Batch ID is required")
    private Long batchId;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    private String status = "DRAFT"; // DRAFT, PUBLISHED, CLOSED

    public AssignmentRequest() {}

    public AssignmentRequest(String title, String description, Long courseId, Long batchId, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.courseId = courseId;
        this.batchId = batchId;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
