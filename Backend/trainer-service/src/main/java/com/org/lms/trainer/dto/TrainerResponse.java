package com.org.lms.trainer.dto;

public class TrainerResponse {

    private Long trainerId;
    private String firstName;
    private String lastName;
    private String email;
    private String designation;
    private String status;

    public TrainerResponse(Long trainerId, String firstName, String lastName,
                            String email, String designation, String status) {
        this.trainerId = trainerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.designation = designation;
        this.status = status;
    }

    public Long getTrainerId() { return trainerId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getDesignation() { return designation; }
    public String getStatus() { return status; }
}
