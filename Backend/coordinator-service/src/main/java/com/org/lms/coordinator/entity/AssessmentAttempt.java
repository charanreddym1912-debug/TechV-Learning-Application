package com.org.lms.coordinator.entity;

import com.org.lms.coordinator.enums.AssessmentAttemptStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity
@Table(name = "assessment_attempts", uniqueConstraints = @UniqueConstraint(columnNames = {"assessment_id", "student_email"}))
public class AssessmentAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attemptId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;
    @Column(name = "student_email", nullable = false, length = 150)
    private String studentEmail;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
    private AssessmentAttemptStatus status;
    @Column(nullable = false)
    private Integer autoScore = 0;
    private Integer finalScore;
    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    private LocalDateTime gradedAt;
    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssessmentAnswer> answers = new ArrayList<>();
    @PrePersist void onSubmit() { if (submittedAt == null) submittedAt = LocalDateTime.now(); }
}
