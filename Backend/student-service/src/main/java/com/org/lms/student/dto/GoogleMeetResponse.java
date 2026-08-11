package com.org.lms.student.dto;

public class GoogleMeetResponse {

    private String meetingCode;
    private String meetUrl;
    private String topic;
    private String provider;

    public GoogleMeetResponse() {
    }

    public GoogleMeetResponse(String meetingCode, String meetUrl, String topic, String provider) {
        this.meetingCode = meetingCode;
        this.meetUrl = meetUrl;
        this.topic = topic;
        this.provider = provider;
    }

    public String getMeetingCode() {
        return meetingCode;
    }

    public void setMeetingCode(String meetingCode) {
        this.meetingCode = meetingCode;
    }

    public String getMeetUrl() {
        return meetUrl;
    }

    public void setMeetUrl(String meetUrl) {
        this.meetUrl = meetUrl;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }
}
