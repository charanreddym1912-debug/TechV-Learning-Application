package com.org.lms.user.controller;

import com.org.lms.common.ApiResponse;
import com.org.lms.user.dto.StudentRegisterRequest;
import com.org.lms.user.dto.StudentResponse;
import com.org.lms.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final UserService userService;

    public StudentController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<StudentResponse>> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        StudentResponse response = userService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student registered successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {
        List<StudentResponse> response = userService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", response));
    }

    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR') or (hasRole('STUDENT') and principal.id == #studentId)")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long studentId) {
        StudentResponse response = userService.getStudentById(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", response));
    }

    @PutMapping("/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long studentId,
            @Valid @RequestBody StudentRegisterRequest request) {
        StudentResponse response = userService.updateStudent(studentId, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", response));
    }

    @DeleteMapping("/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long studentId) {
        userService.deleteStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully"));
    }
}
