package com.org.lms.coordinator.dto;

import com.org.lms.coordinator.enums.CourseStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CourseResponse {

    private Long courseId;
    private String title;
    private String description;
    private String category;
    private String duration;
    private LocalDate startDate;
    private LocalDate endDate;
    private String createdByEmail;
    private CourseStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CourseResponse() {}

    public CourseResponse(Long courseId, String title, String description, String category,
                          String duration, LocalDate startDate, LocalDate endDate,
                          String createdByEmail, CourseStatus status,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.duration = duration;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdByEmail = createdByEmail;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getDuration() {
        return duration;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public CourseStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}