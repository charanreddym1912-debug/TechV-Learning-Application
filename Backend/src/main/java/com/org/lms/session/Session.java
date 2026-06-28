package com.org.lms.session;

import com.org.lms.batch.Batch;
import com.org.lms.common.BaseEntity;
import com.org.lms.user.entity.Trainer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter
@Setter
public class Session extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String topic;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    private Integer duration; // duration in minutes

    @Column(name = "zoom_meeting_id", length = 50)
    private String zoomMeetingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;
}
