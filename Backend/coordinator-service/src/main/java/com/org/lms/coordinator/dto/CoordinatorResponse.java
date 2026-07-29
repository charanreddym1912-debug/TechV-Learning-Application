package com.org.lms.coordinator.dto;

public class CoordinatorResponse {

    private Long coordinatorId;
    private String fullName;
    private String email;
    private String status;

    public CoordinatorResponse(Long coordinatorId, String fullName, String email, String status) {
        this.coordinatorId = coordinatorId;
        this.fullName = fullName;
        this.email = email;
        this.status = status;
    }

    public Long getCoordinatorId() { return coordinatorId; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getStatus() { return status; }
}
