package com.org.lms.batch;

import com.org.lms.common.ApiResponse;
import com.org.lms.user.entity.Student;
import com.org.lms.user.entity.Trainer;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/batches")
public class BatchController {

    private final BatchService batchService;

    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Batch>> createBatch(
            @RequestParam Long courseId,
            @Valid @RequestBody Batch batch) {
        Batch response = batchService.createBatch(batch, courseId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Batch created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Batch>>> getAllBatches() {
        List<Batch> response = batchService.getAllBatches();
        return ResponseEntity.ok(ApiResponse.success("Batches retrieved successfully", response));
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<ApiResponse<Batch>> getBatchById(@PathVariable Long batchId) {
        Batch response = batchService.getBatchById(batchId);
        return ResponseEntity.ok(ApiResponse.success("Batch retrieved successfully", response));
    }

    @PutMapping("/{batchId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Batch>> updateBatch(
            @PathVariable Long batchId,
            @RequestParam Long courseId,
            @Valid @RequestBody Batch batch) {
        Batch response = batchService.updateBatch(batchId, batch, courseId);
        return ResponseEntity.ok(ApiResponse.success("Batch updated successfully", response));
    }

    @DeleteMapping("/{batchId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteBatch(@PathVariable Long batchId) {
        batchService.deleteBatch(batchId);
        return ResponseEntity.ok(ApiResponse.success("Batch deleted successfully"));
    }

    // --- TRAINER ASSIGNMENT ---

    @PostMapping("/{batchId}/trainers")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> assignTrainer(
            @PathVariable Long batchId,
            @RequestBody Map<String, Long> payload) {
        Long trainerId = payload.get("trainerId");
        if (trainerId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("trainerId is required"));
        }
        batchService.assignTrainerToBatch(batchId, trainerId);
        return ResponseEntity.ok(ApiResponse.success("Trainer assigned to batch successfully"));
    }

    @GetMapping("/{batchId}/trainers")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Set<Trainer>>> getBatchTrainers(@PathVariable Long batchId) {
        Set<Trainer> response = batchService.getBatchTrainers(batchId);
        return ResponseEntity.ok(ApiResponse.success("Batch trainers retrieved successfully", response));
    }

    @DeleteMapping("/{batchId}/trainers/{trainerId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> removeTrainer(
            @PathVariable Long batchId,
            @PathVariable Long trainerId) {
        batchService.removeTrainerFromBatch(batchId, trainerId);
        return ResponseEntity.ok(ApiResponse.success("Trainer removed from batch successfully"));
    }

    // --- STUDENT ENROLLMENT ---

    @PostMapping("/{batchId}/students")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> enrollStudent(
            @PathVariable Long batchId,
            @RequestBody Map<String, Long> payload) {
        Long studentId = payload.get("studentId");
        if (studentId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("studentId is required"));
        }
        batchService.enrollStudentInBatch(batchId, studentId);
        return ResponseEntity.ok(ApiResponse.success("Student enrolled in batch successfully"));
    }

    @GetMapping("/{batchId}/students")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Set<Student>>> getBatchStudents(@PathVariable Long batchId) {
        Set<Student> response = batchService.getBatchStudents(batchId);
        return ResponseEntity.ok(ApiResponse.success("Batch students retrieved successfully", response));
    }

    @DeleteMapping("/{batchId}/students/{studentId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> removeStudent(
            @PathVariable Long batchId,
            @PathVariable Long studentId) {
        batchService.removeStudentFromBatch(batchId, studentId);
        return ResponseEntity.ok(ApiResponse.success("Student removed from batch successfully"));
    }
}
