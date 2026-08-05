package com.org.lms.coordinator.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignmentId;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private LocalDate assignedDate;
    private LocalDate dueDate;
    private Integer totalMarks;

    private String attachmentFileName;
    private String attachmentContentType;
    private Long attachmentFileSize;

    @Column(length = 1000)
    private String attachmentStoragePath;

    private Long maximumSubmissionFileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}