package com.org.lms.coordinator.dto;

import java.time.LocalDateTime;

public class MockInterviewResponse {

    private Long mockInterviewId;
    private String title;
    private String description;
    private LocalDateTime scheduledDateTime;
    private String interviewerName;
    private Integer durationInMinutes;
    private String meetingLink;
    private Long courseId;

    public MockInterviewResponse() {}

    public Long getMockInterviewId() {
        return mockInterviewId;
    }

    public void setMockInterviewId(Long mockInterviewId) {
        this.mockInterviewId = mockInterviewId;
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

    public LocalDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(LocalDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
    }

    public String getInterviewerName() {
        return interviewerName;
    }

    public void setInterviewerName(String interviewerName) {
        this.interviewerName = interviewerName;
    }

    public Integer getDurationInMinutes() {
        return durationInMinutes;
    }

    public void setDurationInMinutes(Integer durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
