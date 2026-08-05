package com.org.lms.student.dto;

public class StudentResponse {

    private Long studentId;
    private String firstName;
    private String lastName;
    private String email;
    private String qualification;
    private String status;

    public StudentResponse(Long studentId, String firstName, String lastName,
                            String email, String qualification, String status) {
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.qualification = qualification;
        this.status = status;
    }

    public Long getStudentId() { return studentId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getQualification() { return qualification; }
    public String getStatus() { return status; }
}
