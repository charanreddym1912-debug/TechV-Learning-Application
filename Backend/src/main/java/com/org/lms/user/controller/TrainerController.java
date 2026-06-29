package com.org.lms.user.controller;

import com.org.lms.common.ApiResponse;
import com.org.lms.user.dto.TrainerRegisterRequest;
import com.org.lms.user.dto.TrainerResponse;
import com.org.lms.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/trainers")
public class TrainerController {

    private final UserService userService;

    public TrainerController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<TrainerResponse>> registerTrainer(@Valid @RequestBody TrainerRegisterRequest request) {
        TrainerResponse response = userService.registerTrainer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trainer registered successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<List<TrainerResponse>>> getAllTrainers() {
        List<TrainerResponse> response = userService.getAllTrainers();
        return ResponseEntity.ok(ApiResponse.success("Trainers retrieved successfully", response));
    }

    @GetMapping("/{trainerId}")
    @PreAuthorize("hasRole('COORDINATOR') or (hasRole('TRAINER') and principal.id == #trainerId)")
    public ResponseEntity<ApiResponse<TrainerResponse>> getTrainerById(@PathVariable Long trainerId) {
        TrainerResponse response = userService.getTrainerById(trainerId);
        return ResponseEntity.ok(ApiResponse.success("Trainer retrieved successfully", response));
    }

    @PutMapping("/{trainerId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<TrainerResponse>> updateTrainer(
            @PathVariable Long trainerId,
            @Valid @RequestBody TrainerRegisterRequest request) {
        TrainerResponse response = userService.updateTrainer(trainerId, request);
        return ResponseEntity.ok(ApiResponse.success("Trainer updated successfully", response));
    }

    @DeleteMapping("/{trainerId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<ApiResponse<Void>> deleteTrainer(@PathVariable Long trainerId) {
        userService.deleteTrainer(trainerId);
        return ResponseEntity.ok(ApiResponse.success("Trainer deleted successfully"));
    }

    @GetMapping("/{trainerId}/courses")
    @PreAuthorize("hasRole('COORDINATOR') or (hasRole('TRAINER') and principal.id == #trainerId)")
    public ResponseEntity<ApiResponse<List<Object>>> getTrainerCourses(@PathVariable Long trainerId) {
        // Skeleton mock: return empty list of courses
        return ResponseEntity.ok(ApiResponse.success("Trainer courses retrieved", Collections.emptyList()));
    }

    @GetMapping("/{trainerId}/batches")
    @PreAuthorize("hasRole('COORDINATOR') or (hasRole('TRAINER') and principal.id == #trainerId)")
    public ResponseEntity<ApiResponse<List<Object>>> getTrainerBatches(@PathVariable Long trainerId) {
        // Skeleton mock: return empty list of batches
        return ResponseEntity.ok(ApiResponse.success("Trainer batches retrieved", Collections.emptyList()));
    }
}
