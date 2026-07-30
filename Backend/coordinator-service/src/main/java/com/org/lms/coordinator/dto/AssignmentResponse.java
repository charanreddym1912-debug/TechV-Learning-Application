package com.org.lms.coordinator.dto;

import java.time.LocalDate;

public class AssignmentResponse {

    private Long assignmentId;
    private String title;
    private String description;
    private LocalDate assignedDate;
    private LocalDate dueDate;
    private Integer totalMarks;
    private String attachmentFileName;
    private String attachmentContentType;
    private Long attachmentFileSize;
    private String attachmentStoragePath;
    private Long maximumSubmissionFileSize;
    private Long courseId;
    private String courseTitle;

    public AssignmentResponse() {}

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
}
