package com.org.lms.attendance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceRecordRequest {

    @NotNull(message = "Session ID is required")
    private Long sessionId;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Presence flag is required")
    private Boolean isPresent;
}
