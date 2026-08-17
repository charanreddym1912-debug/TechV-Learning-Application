package com.org.lms.coordinator.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "assessment_answers")
public class AssessmentAnswer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false)
    private AssessmentAttempt attempt;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private AssessmentQuestion question;
    @Column(nullable = false, length = 10000)
    private String responseText;
    private Integer awardedMarks;
    @Column(nullable = false)
    private boolean autoGraded;
    @Column(length = 2000)
    private String trainerFeedback;
}
