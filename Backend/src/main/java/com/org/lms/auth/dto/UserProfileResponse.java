package com.org.lms.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String email;
    private String role;
    private String status;
    private String firstName;
    private String lastName;
    private String fullName;
    private String employeeId;
    private String phoneNumber;
}
