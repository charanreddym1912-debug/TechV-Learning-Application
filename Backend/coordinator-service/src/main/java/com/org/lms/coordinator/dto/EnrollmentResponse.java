package com.org.lms.coordinator.dto;

public class EnrollmentResponse {

    private Long enrollmentId;
    private Long courseId;
    private String studentEmail;
    private String message;

    public EnrollmentResponse(Long enrollmentId, Long courseId, String studentEmail, String message) {
        this.enrollmentId = enrollmentId;
        this.courseId = courseId;
        this.studentEmail = studentEmail;
        this.message = message;
    }

    public Long getEnrollmentId() {
    	return enrollmentId; 
    	}
    public Long getCourseId() {
    	return courseId;
    	}
    public String getStudentEmail() {
    	return studentEmail; 
    	}
    public String getMessage() {
    	return message; 
    	}
}