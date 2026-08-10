package com.org.lms.coordinator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class AssignmentRequest {

    @NotBlank(message = "Assignment title is required")
    private String title;

    private String description;

    @NotNull(message = "Assigned date is required")
    private LocalDate assignedDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotNull(message = "Total marks are required")
    @Positive(message = "Total marks must be greater than zero")
    private Integer totalMarks;

    private String attachmentFileName;
    private String attachmentContentType;

    @Positive(message = "Attachment file size must be greater than zero")
    private Long attachmentFileSize;

    private String attachmentStoragePath;

    @Positive(message = "Maximum submission file size must be greater than zero")
    private Long maximumSubmissionFileSize;

    public AssignmentRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDate assignedDate) {
        this.assignedDate = assignedDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getAttachmentFileName() {
        return attachmentFileName;
    }

    public void setAttachmentFileName(String attachmentFileName) {
        this.attachmentFileName = attachmentFileName;
    }

    public String getAttachmentContentType() {
        return attachmentContentType;
    }

    public void setAttachmentContentType(String attachmentContentType) {
        this.attachmentContentType = attachmentContentType;
    }

    public Long getAttachmentFileSize() {
        return attachmentFileSize;
    }

    public void setAttachmentFileSize(Long attachmentFileSize) {
        this.attachmentFileSize = attachmentFileSize;
    }

    public String getAttachmentStoragePath() {
        return attachmentStoragePath;
    }

    public void setAttachmentStoragePath(String attachmentStoragePath) {
        this.attachmentStoragePath = attachmentStoragePath;
    }

    public Long getMaximumSubmissionFileSize() {
        return maximumSubmissionFileSize;
    }

    public void setMaximumSubmissionFileSize(Long maximumSubmissionFileSize) {
        this.maximumSubmissionFileSize = maximumSubmissionFileSize;
    }
}
