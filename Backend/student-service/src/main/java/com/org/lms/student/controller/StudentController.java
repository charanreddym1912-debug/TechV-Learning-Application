package com.org.lms.student.controller;

import com.org.lms.student.dto.StudentRegisterRequest;
import com.org.lms.student.dto.StudentResponse;
import com.org.lms.student.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/registerstudent")
    public ResponseEntity<StudentResponse> registerStudent(@Valid @RequestBody StudentRegisterRequest request) {
        StudentResponse response = studentService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
