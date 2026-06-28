package com.org.lms.user.dto;

import com.org.lms.common.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TrainerResponse {
    private Long id;
    private String email;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String specialization;
    private Integer experienceYears;
    private String designation;
    private UserStatus status;
    private LocalDate joiningDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
