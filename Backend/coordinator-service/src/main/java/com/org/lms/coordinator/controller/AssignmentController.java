package com.org.lms.coordinator.controller;

import com.org.lms.coordinator.dto.AssignmentRequest;
import com.org.lms.coordinator.dto.AssignmentResponse;
import com.org.lms.coordinator.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping("/courses/{courseId}/assignments")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<AssignmentResponse> createAssignment(@PathVariable Long courseId,
                                                               @Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse response = assignmentService.createAssignment(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<AssignmentResponse>> getAssignments() {
        return ResponseEntity.ok(assignmentService.getAssignments());
    }

    @GetMapping("/assignments/{assignmentId}")
    public ResponseEntity<AssignmentResponse> getAssignmentById(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(assignmentId));
    }

    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<List<AssignmentResponse>> getAssignmentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCourse(courseId));
    }

    @PutMapping("/courses/{courseId}/assignments/{assignmentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<AssignmentResponse> updateAssignment(@PathVariable Long courseId,
                                                               @PathVariable Long assignmentId,
                                                               @Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.updateAssignment(courseId, assignmentId, request));
    }

    @DeleteMapping("/assignments/{assignmentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }
}
