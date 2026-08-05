package com.org.lms.student.controller;

import com.org.lms.student.dto.UserLookupResponse;
import com.org.lms.student.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal, service-to-service only endpoint. This is NOT routed through the
 * API Gateway (no gateway route is defined for /internal/**), so external
 * clients cannot reach it directly through the public entry point.
 * auth-service calls this endpoint directly (via Eureka + RestTemplate) during login,
 * since auth-service does not have its own access to the students database.
 *
 * Note: for a production system, this endpoint should additionally be locked
 * down with network policies or a shared internal API key, since any client
 * that can resolve the service directly could still call it.
 */
@RestController
@RequestMapping("/internal/students")
public class StudentInternalController {

    private final StudentService studentService;

    public StudentInternalController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<UserLookupResponse> findByEmail(@PathVariable String email) {
        return studentService.findByEmailForAuth(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
