package com.org.lms.trainer.controller;

import com.org.lms.trainer.dto.*;
import com.org.lms.trainer.service.TrainerService;
import com.org.lms.trainer.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/trainers")
public class TrainerController {

    private final TrainerService trainerService;
    private final AssignmentService assignmentService;

    public TrainerController(TrainerService trainerService, AssignmentService assignmentService) {
        this.trainerService = trainerService;
        this.assignmentService = assignmentService;
    }

    @PostMapping("/registertrainer")
    public ResponseEntity<TrainerResponse> registerTrainer(@Valid @RequestBody TrainerSignupRequest request) {
        TrainerResponse response = trainerService.registerTrainer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== ASSIGNMENT MANAGEMENT ====================

    /**
     * Creates a new assignment
     * POST /api/v1/trainers/{trainerId}/assignments
     */
    @PostMapping("/{trainerId}/assignments")
    public ResponseEntity<AssignmentResponse> createAssignment(
            @PathVariable Long trainerId,
            @Valid @RequestBody AssignmentRequest request,
            Authentication authentication) {
        // Verify trainer is authorized (optional - depends on your security setup)
        AssignmentResponse response = assignmentService.createAssignment(trainerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Gets all assignments for a trainer
     * GET /api/v1/trainers/{trainerId}/assignments
     */
    @GetMapping("/{trainerId}/assignments")
    public ResponseEntity<List<AssignmentResponse>> getTrainerAssignments(@PathVariable Long trainerId) {
        List<AssignmentResponse> assignments = assignmentService.getTrainerAssignments(trainerId);
        return ResponseEntity.ok(assignments);
    }

    /**
     * Gets a specific assignment with all files
     * GET /api/v1/trainers/{trainerId}/assignments/{assignmentId}
     */
    @GetMapping("/{trainerId}/assignments/{assignmentId}")
    public ResponseEntity<AssignmentResponse> getAssignment(
            @PathVariable Long trainerId,
            @PathVariable Long assignmentId) {
        AssignmentResponse assignment = assignmentService.getAssignment(trainerId, assignmentId);
        return ResponseEntity.ok(assignment);
    }

    /**
     * Updates an assignment
     * PUT /api/v1/trainers/{trainerId}/assignments/{assignmentId}
     */
    @PutMapping("/{trainerId}/assignments/{assignmentId}")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long trainerId,
            @PathVariable Long assignmentId,
            @Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse response = assignmentService.updateAssignment(trainerId, assignmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Publishes an assignment (makes it visible to students)
     * POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/publish
     */
    @PostMapping("/{trainerId}/assignments/{assignmentId}/publish")
    public ResponseEntity<AssignmentResponse> publishAssignment(
            @PathVariable Long trainerId,
            @PathVariable Long assignmentId) {
        AssignmentResponse response = assignmentService.publishAssignment(trainerId, assignmentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Deletes an assignment
     * DELETE /api/v1/trainers/{trainerId}/assignments/{assignmentId}
     */
    @DeleteMapping("/{trainerId}/assignments/{assignmentId}")
    public ResponseEntity<Map<String, String>> deleteAssignment(
            @PathVariable Long trainerId,
            @PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(trainerId, assignmentId);
        return ResponseEntity.ok(Map.of("message", "Assignment deleted successfully"));
    }

    // ==================== FILE UPLOAD MANAGEMENT ====================

    /**
     * Uploads a single file to an assignment
     * POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/files
     */
    @PostMapping("/{trainerId}/assignments/{assignmentId}/files")
    public ResponseEntity<FileResponse> uploadFile(
            @PathVariable Long trainerId,
            @PathVariable Long assignmentId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {
        String uploaderEmail = authentication.getName();
        FileResponse response = assignmentService.uploadFileToAssignment(trainerId, assignmentId, file, uploaderEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Uploads multiple files to an assignment
     * POST /api/v1/trainers/{trainerId}/assignments/{assignmentId}/upload-multiple
     */
    @PostMapping("/{trainerId}/assignments/{assignmentId}/upload-multiple")
    public ResponseEntity<List<FileResponse>> uploadMultipleFiles(
            @PathVariable Long trainerId,
            @PathVariable Long assignmentId,
            @RequestParam("files") MultipartFile[] files,
            Authentication authentication) throws IOException {
        String uploaderEmail = authentication.getName();
        List<FileResponse> responses = assignmentService.uploadFilesToAssignment(trainerId, assignmentId, files, uploaderEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    /**
     * Deletes a file from an assignment
     * DELETE /api/v1/trainers/{trainerId}/assignments/{assignmentId}/files/{fileId}
     */
    @DeleteMapping("/{trainerId}/assignments/{assignmentId}/files/{fileId}")
    public ResponseEntity<Map<String, String>> deleteFile(
            @PathVariable Long trainerId,
            @PathVariable Long assignmentId,
            @PathVariable Long fileId) {
        assignmentService.deleteFile(trainerId, assignmentId, fileId);
        return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
    }

    /**
     * Gets assignments by course
     * GET /api/v1/trainers/courses/{courseId}/assignments
     */
    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<List<AssignmentResponse>> getCourseAssignments(@PathVariable Long courseId) {
        List<AssignmentResponse> assignments = assignmentService.getCourseAssignments(courseId);
        return ResponseEntity.ok(assignments);
    }

    /**
     * Gets assignments by batch
     * GET /api/v1/trainers/batches/{batchId}/assignments
     */
    @GetMapping("/batches/{batchId}/assignments")
    public ResponseEntity<List<AssignmentResponse>> getBatchAssignments(@PathVariable Long batchId) {
        List<AssignmentResponse> assignments = assignmentService.getBatchAssignments(batchId);
        return ResponseEntity.ok(assignments);
    }
}
