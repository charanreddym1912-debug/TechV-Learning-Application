package com.org.lms.coordinator.dto;

import java.time.LocalDate;

public class CourseResponse {

    private Long courseId;
    private String title;
    private String description;
    private String category;
    private String duration;
    private LocalDate startDate;
    private LocalDate endDate;
    private String createdByEmail;

    public CourseResponse(Long courseId, String title, String description, String category,
                           String duration, LocalDate startDate, LocalDate endDate, String createdByEmail) {
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.duration = duration;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdByEmail = createdByEmail;
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
}