package com.org.lms.trainer.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AssignmentResponse {

    private Long assignmentId;
    private String title;
    private String description;
    private Long courseId;
    private Long batchId;
    private String status;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<FileResponse> files;

    public AssignmentResponse() {}

    public AssignmentResponse(Long assignmentId, String title, String description, Long courseId, 
                             Long batchId, String status, LocalDateTime dueDate, 
                             LocalDateTime createdAt, LocalDateTime updatedAt, List<FileResponse> files) {
        this.assignmentId = assignmentId;
        this.title = title;
        this.description = description;
        this.courseId = courseId;
        this.batchId = batchId;
        this.status = status;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.files = files;
    }

    // Getters and Setters
    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getBatchId() { return batchId; }
    public void setBatchId(Long batchId) { this.batchId = batchId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<FileResponse> getFiles() { return files; }
    public void setFiles(List<FileResponse> files) { this.files = files; }
}
