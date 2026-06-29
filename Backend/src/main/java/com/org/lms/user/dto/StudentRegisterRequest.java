package com.org.lms.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentRegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email formatting")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phoneNumber;
    private String qualification;
    private LocalDate enrollmentDate;
}
