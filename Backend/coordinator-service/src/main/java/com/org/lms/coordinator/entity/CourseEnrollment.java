package com.org.lms.coordinator.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_enrollments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "student_email"}))
public class CourseEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrollmentId;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "student_email", nullable = false, length = 150)
    private String studentEmail;

    @Column(nullable = false, updatable = false)
    private LocalDateTime enrolledAt;

    public CourseEnrollment() {}

    @PrePersist
    protected void onCreate() {
        this.enrolledAt = LocalDateTime.now();
    }

    public Long getEnrollmentId() {
    	return enrollmentId; 
    	}
    public void setEnrollmentId(Long enrollmentId) {
    	this.enrollmentId = enrollmentId; 
    	}

    public Long getCourseId() { 
    	return courseId; 
    	}
    public void setCourseId(Long courseId) { 
    	this.courseId = courseId;
    	}

    public String getStudentEmail() {
    	return studentEmail; 
    	}
    public void setStudentEmail(String studentEmail) { 
    	this.studentEmail = studentEmail;
    	}

    public LocalDateTime getEnrolledAt() { 
    	return enrolledAt; 
    	}
}